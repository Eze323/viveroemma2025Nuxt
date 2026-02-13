// server/api/sales/[id].get.ts
import { createError, defineEventHandler, H3Event } from 'h3';
import { useDrizzle } from '~/server/utils/drizzle';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
    const db = useDrizzle();
    // Validar token JWT
    const authHeader = event.node.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticación faltante o inválido',
      });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    // Obtener ID de la venta
    const saleId = parseInt(event.context.params?.id || '');
    if (isNaN(saleId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de venta inválido',
      });
    }

    // Buscar la venta
    const sale = await db.query.sales.findFirst({
      where: (sales, { eq }) => eq(sales.id, saleId),
      with: {
        saleItems: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Venta no encontrada',
      });
    }

    return {
      success: true,
      sale: {
        id: sale.id,
        user_id: sale.userId,
        customer_id: sale.customerId,
        customer: sale.customer,
        email: sale.email,
        seller: sale.seller,
        date: sale.date,
        time: sale.time,
        status: sale.status,
        total_price: sale.totalPrice,
        created_at: sale.createdAt,
        updated_at: sale.updatedAt,
        sale_items: sale.saleItems.map(item => ({
          id: item.id,
          product_id: item.productId,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.subtotal,
        })),
      },
    };
  } catch (error) {
    console.error('Error en GET /api/sales/[id]:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  }
});