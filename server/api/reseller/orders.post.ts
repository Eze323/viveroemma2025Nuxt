import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, resellerOrderItems, products } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        // TODO: Add auth check here when authentication is fully ready
        // const user = await requireAuth(event); 
        // For now we trust the client sends userId or we get it from session
        const body = await readBody(event);
        const { userId, items, total } = body;

        if (!userId || !items || items.length === 0) {
            throw new Error('Invalid order data');
        }

        const db = useDrizzle();

        // Create Order
        const [result] = await db.insert(resellerOrders).values({
            userId,
            total,
            status: 'pending_payment',
            createdAt: sql`NOW()`,
            updatedAt: sql`NOW()`
        });

        const orderId = result.insertId;

        // Create Order Items
        for (const item of items) {
            // Optional: Verify stock/price here again for security
            await db.insert(resellerOrderItems).values({
                orderId,
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.quantity * item.price
            });
        }

        return {
            success: true,
            data: {
                orderId,
                message: 'Order created successfully'
            }
        };

    } catch (error) {
        console.error('Error creating reseller order:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create order'
        };
    }
});
