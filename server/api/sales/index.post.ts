// // server/api/sales/index.post.ts
// import { PrismaClient } from '@prisma/client';
// import { createError, defineEventHandler, readBody, H3Event } from 'h3';
// import jwt from 'jsonwebtoken';

// // Inicializar Prisma Client (puedes mover esto a un archivo separado como ~/server/utils/prisma.ts)
// const prisma = new PrismaClient();

// // Interfaz para el cuerpo de la solicitud
// interface SaleItem {
//   productId: number;
//   quantity: number;
//   unitPrice: number;
// }

// interface SaleBody {
//   customerId?: number;
//   customer: string;
//   email?: string;
//   items: SaleItem[];
// }

// // Validar JWT_SECRET
// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET no está definido en las variables de entorno');
// }
// const JWT_SECRET = process.env.JWT_SECRET;

// export default defineEventHandler(async (event: H3Event) => {
//   try {
//     // Validar token JWT
//     const authHeader = event.node.req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Token de autenticación faltante o inválido',
//       });
//     }
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };

//     // Leer y tipar el cuerpo de la solicitud
//     const body = await readBody<SaleBody>(event);
//     const { customerId, customer, email, items } = body;

//     // Validar entrada
//     if (!customer || !items || items.length === 0) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Faltan datos de cliente o ítems de venta',
//       });
//     }

//     // Validar cliente (si se proporciona customerId)
//     if (customerId) {
//       const customerExists = await prisma.customers.findUnique({
//         where: { id: customerId },
//       });
//       if (!customerExists) {
//         throw createError({
//           statusCode: 404,
//           statusMessage: 'Cliente no encontrado',
//         });
//       }
//     }

//     // Validar productos y calcular total_price
//     let totalPrice = 0;
//     for (const item of items) {
//       const product = await prisma.products.findUnique({
//         where: { id: item.productId },
//       });
//       if (!product) {
//         throw createError({
//           statusCode: 404,
//           statusMessage: `Producto con ID ${item.productId} no encontrado`,
//         });
//       }
//       if (product.stock < item.quantity) {
//         throw createError({
//           statusCode: 400,
//           statusMessage: `Stock insuficiente para el producto ${product.name}`,
//         });
//       }
//       totalPrice += item.quantity * item.unitPrice;
//     }

//     // Crear la venta en una transacción
//     const sale = await prisma.$transaction(async (tx) => {
//       // Crear la venta
//       const newSale = await tx.sales.create({
//         data: {
//           user_id: decoded.userId,
//           customer_id: customerId,
//           customer,
//           email,
//           seller: decoded.email,
//           date: new Date(),
//           time: new Date(),
//           status: 'Pendiente',
//           total_price: totalPrice,
//         },
//       });

//       // Crear los ítems de la venta
//       for (const item of items) {
//         await tx.sale_items.create({
//           data: {
//             sale_id: newSale.id,
//             product_id: item.productId,
//             quantity: item.quantity,
//             unit_price: item.unitPrice,
//             subtotal: item.quantity * item.unitPrice,
//           },
//         });

//         // Actualizar el stock del producto
//         await tx.products.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }

//       return newSale;
//     });

//     return {
//       success: true,
//       sale: {
//         id: sale.id,
//         customer,
//         total_price: sale.total_price,
//         date: sale.date,
//         status: sale.status,
//       },
//     };
//   } catch (error) {
//     console.error('Error en /api/sales:', error);
//     const err = error as { statusCode?: number; statusMessage?: string };
//     throw createError({
//       statusCode: err.statusCode || 500,
//       statusMessage: err.statusMessage || 'Error en el servidor',
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// });

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
}

// Validar JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event) => {
  try {
    // Validar token JWT
    const authHeader = getHeader(event, 'Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticación faltante o inválido',
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };

    // Leer y tipar el cuerpo de la solicitud
    const body = await readBody<SaleBody>(event);
    const { customerId, customer, email, items } = body;

    // Validar entrada
    if (!customer || !items || items.length === 0) {
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

    // Validar productos y calcular total_price
    let totalPrice = 0;
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
      totalPrice += item.quantity * item.unitPrice;
    }

    // Crear la venta en una transacción
    const newSale = await db.transaction(async (tx) => {
      // Crear la venta
      const [sale] = await tx
        .insert(sales)
        .values({
          userId: decoded.userId,
          customerId: customerId || null,
          customer,
          email: email || null,
          seller: decoded.email,
          date: new Date(),
          time: new Date(),
          status: 'Pendiente',
          totalPrice,
        })
        .returning({ id: sales.id });

      // Crear los ítems de la venta y actualizar stock
      for (const item of items) {
        await tx.insert(sale_items).values({
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
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
      sale: {
        id: newSale.id,
        customer,
        total_price: totalPrice,
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