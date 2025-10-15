// server/api/products/index.get.ts
import { defineEventHandler, createError, H3Event } from 'h3';
import { db } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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

    // Obtener productos publicados
    const productRecords = await db
      .select({
        id: products.id,
        name: products.name,
        precio_venta: products.precio_venta,
        stock: products.stock,
      })
      .from(products);
      // .where(eq(products.publicado, true)); // Descomenta si tienes el campo publicado

    // Mapear los datos al formato esperado por el frontend
    const mappedProducts = productRecords.map(product => ({
      id: product.id,
      name: product.name,
      unit_price: Number(product.precio_venta),
      stock: product.stock,
    }));

    return {
      success: true,
      data: mappedProducts,
    };
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  }
});
