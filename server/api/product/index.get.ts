// server/api/products/index.get.ts
import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, H3Event } from 'h3';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET no está definido en las variables de entorno');
// }
// const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Validar token JWT
    // const authHeader = event.node.req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Token de autenticación faltante o inválido',
    //   });
    // }
    // const token = authHeader.split(' ')[1];
    // jwt.verify(token, JWT_SECRET);

    // Obtener productos publicados
    const productRecords = await prisma.products.findMany({
      // where: {
      //   publicado: true,
      // },
      // select: {
      //   id: true,
      //   name: true,
      //   precio_venta: true,
      //   stock: true,
      // },
    });

    // Mapear los datos al formato esperado por el frontend
    // const products = productRecords.map(product => ({
    //   id: product.id,
    //   name: product.name,
    //   unit_price: Number(product.precio_venta), // Convertir Decimal a número
    //   stock: product.stock,
    // }));

    return {
      success: true,
      data: productRecords,
    };
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});