import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, resellerOrderItems } from '~/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        // const user = await requireAuth(event);
        // const userId = user.id;
        const query = getQuery(event);
        const userId = Number(query.userId); // Temporary until global auth context

        if (!userId) throw new Error('User ID required');

        const db = useDrizzle();

        const orders = await db
            .select()
            .from(resellerOrders)
            .where(eq(resellerOrders.userId, userId))
            .orderBy(desc(resellerOrders.createdAt));

        return {
            success: true,
            data: orders
        };

    } catch (error) {
        console.error('Error fetching reseller orders:', error);
        return {
            success: false,
            error: 'Failed to fetch orders'
        };
    }
});
