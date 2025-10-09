import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    console.log('Attempting to connect to database...');
    const productRecords = await prisma.products.findMany({
      where: {
        publicado: true,
      },
      select: {
        id: true,
        name: true,
        precio_venta: true,
        stock: true,
      },
    });

    console.log('Products fetched:', productRecords);

    // Map data to frontend format
    const products = productRecords.map(product => ({
      id: product.id,
      name: product.name,
      unit_price: Number(product.precio_venta), // Convert Decimal to number
      stock: product.stock,
    }));

    return {
      success: true,
      data: products, // Return mapped products
    };
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error en el servidor',
      data: { error: error instanceof Error ? error.message : String(error) },
    });
  } finally {
    await prisma.$disconnect();
  }
});