// server/api/products/index.get.ts
import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const productRecords = await prisma.products.findMany();
    return {
      success: true,
      data: productRecords,
    };
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error en el servidor',
      data: { error: error instanceof Error ? error.message : String(error) },
    });
  } finally {
    await prisma.$disconnect();
  }
});