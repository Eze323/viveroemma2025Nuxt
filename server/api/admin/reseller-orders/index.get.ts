import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, users } from '~/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
    try {
        const userCtx = await requireAuth(event);
        const db = useDrizzle();

        const isAdminOrEncargado = userCtx.role === 'admin' || userCtx.role === 'encargado';

        // Base Query
        let query = db
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
            .leftJoin(users, eq(resellerOrders.userId, users.id));

        // Filtro por usuario si es canastero o reseller
        if (!isAdminOrEncargado) {
            query = query.where(eq(resellerOrders.userId, userCtx.id));
        }

        const orders = await query.orderBy(desc(resellerOrders.createdAt));

        return {
            success: true,
            data: orders
        };

    } catch (error: any) {
        console.error('Error fetching admin reseller orders:', error);

        const statusCode = error.statusCode || 500;
        const statusMessage = error.statusMessage || 'Error al cargar los pedidos';

        throw createError({
            statusCode,
            statusMessage,
        });
    }
});
