// server/api/sales/index.get.ts
import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, getQuery, H3Event } from 'h3';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

interface QueryParams {
  page?: string;
  limit?: string;
  status?: string;
  user_id?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
}

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

    // Leer parámetros de consulta
    const query = getQuery(event) as QueryParams;
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.user_id) where.user_id = parseInt(query.user_id);
    if (query.customer_id) where.customer_id = parseInt(query.customer_id);
    if (query.date_from || query.date_to) {
      where.date = {};
      if (query.date_from) where.date.gte = new Date(query.date_from);
      if (query.date_to) where.date.lte = new Date(query.date_to);
    }

    // Obtener ventas con paginación
    const [sales, total] = await Promise.all([
      prisma.sales.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: { sale_items: { include: { product: true } } },
      }),
      prisma.sales.count({ where }),
    ]);

    return {
      success: true,
      data: sales.map(sale => ({
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
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error en GET /api/sales:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});