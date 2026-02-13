import { defineEventHandler, getRouterParam } from 'h3';
import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, resellerOrderItems, products } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const db = useDrizzle();
    const idStr = getRouterParam(event, 'id');
    const id = parseInt(idStr as string);

    if (isNaN(id)) {
        return { success: false, message: 'Invalid ID' };
    }

    try {
        const order = await db.query.resellerOrders.findFirst({
            where: eq(resellerOrders.id, id),
        });

        if (!order) {
            return { success: false, message: 'Order not found' };
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
