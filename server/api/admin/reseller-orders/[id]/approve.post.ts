import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, users } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        // const admin = await requireAdmin(event);
        const id = getRouterParam(event, 'id');
        if (!id) throw new Error('Order ID required');

        const db = useDrizzle();

        // 1. Get order details
        const order = await db.query.resellerOrders.findFirst({
            where: eq(resellerOrders.id, Number(id))
        });

        if (!order) throw new Error('Order not found');
        if (order.status === 'completed') throw new Error('Order already completed');

        // 2. Calculate points (e.g. 1 point for every 100 currency units)
        // Customize this logic as needed
        const pointsAwarded = Math.floor(Number(order.total) / 100);

        // 3. Transaction: Update order status and add points to user
        // 3. Transaction: Update order status and add points to user
        await db.transaction(async (tx) => {
            // Update Order Status
            await tx.update(resellerOrders)
                .set({
                    status: 'completed',
                    updatedAt: sql`NOW()`
                })
                .where(eq(resellerOrders.id, Number(id)));

            // Fetch user to get current points
            const user = await tx.query.users.findFirst({
                where: eq(users.id, order.userId)
            });

            if (user) {
                const newPoints = (user.points || 0) + pointsAwarded;
                // console.log(`Awarding details: Total: ${order.total}, Points: ${pointsAwarded}, Old: ${user.points}, New: ${newPoints}`);

                // Award Points to User
                await tx.update(users)
                    .set({
                        points: newPoints
                    })
                    .where(eq(users.id, order.userId));
            }
        });

        return {
            success: true,
            message: `Order approved and ${pointsAwarded} points awarded.`
        };

    } catch (error) {
        console.error('Error approving order:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to approve order'
        };
    }
});
