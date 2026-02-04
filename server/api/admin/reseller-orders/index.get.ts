import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, users } from '~/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        // await requireAdmin(event);
        const db = useDrizzle();

        const orders = await db
            .select({
                id: resellerOrders.id,
                userId: resellerOrders.userId,
                userName: users.name,
                total: resellerOrders.total,
                status: resellerOrders.status,
                paymentProofUrl: resellerOrders.paymentProofUrl,
                createdAt: resellerOrders.createdAt
            })
            .from(resellerOrders)
            .leftJoin(users, eq(resellerOrders.userId, users.id))
            .orderBy(desc(resellerOrders.createdAt));

        return {
            success: true,
            data: orders
        };

    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return {
            success: false,
            error: 'Failed to fetch'
        };
    }
});
