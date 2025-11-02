// server/api/sales/index.post.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { sales, sale_items, customers, products } from '~/src/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createError, defineEventHandler, readBody, getHeader } from 'h3';
import jwt from 'jsonwebtoken';

// Interfaz para el cuerpo de la solicitud
interface SaleItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface SaleBody {
  customerId?: number;
  customer: string;
  email?: string;
  items: SaleItem[];
  subtotal?: number;
  iva?: number;
  total?: number;
}

// Validar JWT_SECRET (opcional por ahora)
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET no está definido – autenticación deshabilitada temporalmente');
}
const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret'; // Fallback para evitar crash

export default defineEventHandler(async (event) => {
  try {
    // TEMPORAL: Bypass validación JWT para testing – hardcodea userId=1 (admin)
    // TODO: Re-activa cuando integres auth real
    /*
    const authHeader = getHeader(event, 'Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticación faltante o inválido',
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
    */
    const decoded = { userId: 1, email: 'admin@test.com', role: 'admin' }; // Hardcode para testing

    
    // Leer y tipar el cuerpo de la solicitud
    const body = await readBody<SaleBody>(event);
    console.log('Body recibido en /api/sales:', body);  // DEBUG: Ve qué llega

    const { customerId, customer, email, items, subtotal, iva, total } = body;

    // Validar entrada
   if (!customer || !items || items.length === 0) {
      console.log('Validación falló: customer=', customer, 'items=', items, 'items.length=', items?.length);  // DEBUG
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos de cliente o ítems de venta',
      });
    }

    const db = useDrizzle();
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error de conexión a la base de datos',
      });
    }

    // Validar cliente (si se proporciona customerId)
    if (customerId) {
      const [customerExists] = await db
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1);
      if (!customerExists) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Cliente no encontrado',
        });
      }
    }

    // Validar productos y calcular total_price (usa total del body si viene, o calcula)
    let totalPrice = total || 0;
    if (!totalPrice) {
      totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }
    for (const item of items) {
      const [product] = await db
        .select({ id: products.id, name: products.name, stock: products.stock })
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);
      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: `Producto con ID ${item.productId} no encontrado`,
        });
      }
      if (product.stock < item.quantity) {
        throw createError({
          statusCode: 400,
          statusMessage: `Stock insuficiente para el producto ${product.name}`,
        });
      }
    }

    // Crear la venta en una transacción
    const newSale = await db.transaction(async (tx) => {
      // Crear la venta
      const [sale] = await tx
        .insert(sales)
        .values({
          userId: decoded.userId,  // ¡FIX! Usa decoded.userId (1), no customerId
          customerId: customerId || null,  // Agrega customerId explícito si no tiene default
          customer,
          email: email || null,
          seller: decoded.email,
          date: new Date(),
          time: new Date(),
          status: 'Pendiente',
          totalPrice,
          subtotal: subtotal || 0,  // Guarda subtotal si viene
          iva: iva || 0,  // Guarda IVA si viene
        })
        .$returningId();  // ¡FIX! Usa .returning() para MySQL/Drizzle – no .$returningId()

      // Crear los ítems de la venta y actualizar stock
      for (const item of items) {
        await tx.insert(sale_items).values({
          sale_id: sale.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice.toString(), // Convert to string if schema expects string
        });

        // Actualizar el stock del producto
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      return sale;
    });

    return {
      success: true,
      data: {
        id: newSale.id,
        customer,
        subtotal: subtotal || 0,
        iva: iva || 0,
        total: totalPrice,
        date: new Date().toISOString().split('T')[0],  // Formato YYYY-MM-DD
        status: 'Pendiente',
      },
    };
  } catch (error) {
    console.error('Error en /api/sales:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  }
});