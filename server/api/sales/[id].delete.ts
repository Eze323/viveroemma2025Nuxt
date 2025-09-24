// server/api/sales/[id].delete.ts
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };

    // Validar permisos (solo admin)
    if (decoded.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para eliminar ventas',
      });
    }

    // Obtener ID de la venta
    const saleId = parseInt(event.context.params?.id || '');
    if (isNaN(saleId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de venta inválido',
      });
    }

    // Verificar si la venta existe
    const sale = await prisma.sales.findUnique({
      where: { id: saleId },
      include: { sale_items: true },
    });
    if (!sale) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Venta no encontrada',
      });
    }

    // Eliminar la venta en una transacción
    await prisma.$transaction(async (tx) => {
      // Restaurar stock de los productos
      for (const item of sale.sale_items) {
        await tx.products.update({
          where: { id: item.product_id },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Eliminar ítems de la venta
      await tx.sale_items.deleteMany({
        where: { sale_id: saleId },
      });

      // Eliminar la venta
      await tx.sales.delete({
        where: { id: saleId },
      });
    });

    return {
      success: true,
      message: 'Venta eliminada correctamente',
    };
  } catch (error) {
    console.error('Error en DELETE /api/sales/[id]:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});