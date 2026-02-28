import { defineEventHandler, getRouterParam, createError } from 'h3';
import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, resellerOrderItems, products } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
    try {
        const userCtx = await requireAuth(event);
        const db = useDrizzle();
        const idStr = getRouterParam(event, 'id');
        const id = parseInt(idStr as string);

        if (isNaN(id)) {
            throw createError({ statusCode: 400, statusMessage: 'ID de pedido inválido' });
        }

        const order = await db.query.resellerOrders.findFirst({
            where: eq(resellerOrders.id, id),
        });

        if (!order) {
            throw createError({ statusCode: 404, statusMessage: 'Pedido no encontrado' });
        }

        // Seguridad: Solo el dueño del pedido o un admin/encargado puede verlo
        const isAdminOrEncargado = userCtx.role === 'admin' || userCtx.role === 'encargado';
        if (!isAdminOrEncargado && order.userId !== userCtx.id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No tienes permiso para ver este pedido'
            });
        }

        const items = await db.select({
            id: resellerOrderItems.id,
            quantity: resellerOrderItems.quantity,
            unitPrice: resellerOrderItems.unitPrice,
            subtotal: resellerOrderItems.subtotal,
            productName: products.name,
            productImage: products.imageUrl,
        })
            .from(resellerOrderItems)
            .innerJoin(products, eq(resellerOrderItems.productId, products.id))
            .where(eq(resellerOrderItems.orderId, id));

        return {
            success: true,
            data: {
                ...order,
                items
            }
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        return { success: false, message: 'Server error' };
    }
});
