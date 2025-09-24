// // server/api/products/[id].delete.ts
// import { useDrizzle } from '~/server/utils/drizzle';
// import { products } from '~/src/db/schema';
// import { eq } from 'drizzle-orm';

// export default defineEventHandler(async (event) => {
//   try {
//    // await requireAuth(event);
//     const db = useDrizzle();

//     const idParam = event.context.params?.id;
//     if (!idParam) {
//     }
//     const id = parseInt(idParam);
//     const [product] = await db.delete(products).where(eq(products.id, id));

//     if (!product) {
//     }

//     return { success: true, data: { message: 'Producto eliminado' } };
//   } catch (error) {
//     console.error('Error in /api/products/[id] DELETE:', error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : String(error) 
//     };
//   }
// });

// server/api/products/[id].delete.ts
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

    // Obtener ID del producto
    const productId = parseInt(event.context.params?.id || '');
    if (isNaN(productId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido',
      });
    }

    // Verificar si el producto existe
    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado',
      });
    }

    // Verificar si el producto está asociado a sale_items
    const relatedSaleItems = await prisma.sale_items.count({
      where: { product_id: productId },
    });
    if (relatedSaleItems > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se puede eliminar el producto porque está asociado a una o más ventas',
      });
    }

    // Eliminar el producto
    await prisma.products.delete({
      where: { id: productId },
    });

    return {
      success: true,
      data: { message: 'Producto eliminado exitosamente' },
    };
  } catch (error) {
    console.error('Error en DELETE /api/products/[id]:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});