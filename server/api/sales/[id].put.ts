// server/api/sales/[id].get.ts
import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, H3Event } from 'h3';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
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
    const sale = await prisma.sales.findUnique({
      where: { id: saleId },
      include: { sale_items: { include: { product: true } } },
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
        user_id: sale.user_id,
        customer_id: sale.customer_id,
        customer: sale.customer,
        email: sale.email,
        seller: sale.seller,
        date: sale.date,
        time: sale.time,
        status: sale.status,
        total_price: sale.total_price,
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_items: sale.sale_items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
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
  } finally {
    await prisma.$disconnect();
  }
});