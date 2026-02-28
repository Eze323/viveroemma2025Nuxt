// import { useDrizzle } from '~/server/utils/drizzle';
// import { resellerOrders, resellerOrderItems } from '~/server/db/schema';
// import { eq, desc } from 'drizzle-orm';

// export default defineEventHandler(async (event) => {
//     try {
//         // const user = await requireAuth(event);
//         // const userId = user.id;
//         const query = getQuery(event);
//         const userId = Number(query.userId); // Temporary until global auth context

//         if (!userId) throw new Error('User ID required');

//         const db = useDrizzle();

//         const orders = await db
//             .select()
//             .from(resellerOrders)
//             .where(eq(resellerOrders.userId, userId))
//             .orderBy(desc(resellerOrders.createdAt));

//         return {
//             success: true,
//             data: orders
//         };

//     } catch (error) {
//         console.error('Error fetching reseller orders:', error);
//         return {
//             success: false,
//             error: 'Failed to fetch orders'
//         };
//     }
// });
import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, users } from '~/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
    try {
        const userCtx = await requireAuth(event);
        const queryParams = getQuery(event);
        const db = useDrizzle();

        const isAdminOrEncargado = userCtx.role === 'admin' || userCtx.role === 'encargado';

        // Determinar el ID del usuario a filtrar
        let targetUserId = userCtx.id;

        if (isAdminOrEncargado) {
            // Un admin puede ver los de cualquier usuario si pasa el ID, 
            // o ver TODOS si no pasa nada.
            targetUserId = queryParams.userId ? Number(queryParams.userId) : null;
        }

        // Base Query
        let query = db
            .select({
                id: resellerOrders.id,
                userId: resellerOrders.userId,
                userName: users.name,
                total: resellerOrders.total,
                status: resellerOrders.status,
                paymentProofUrl: resellerOrders.paymentProofUrl,
                createdAt: resellerOrders.createdAt,
            })
            .from(resellerOrders)
            .leftJoin(users, eq(resellerOrders.userId, users.id));

        // Filtro por usuario
        if (targetUserId) {
            query = query.where(eq(resellerOrders.userId, targetUserId));
        }

        const orders = await query.orderBy(desc(resellerOrders.createdAt));

        return {
            success: true,
            data: orders
        };

    } catch (error: any) {
        console.error('Error fetching orders:', error);

        const statusCode = error.statusCode || 500;
        const statusMessage = error.statusMessage || 'Error al cargar los pedidos';

        throw createError({
            statusCode,
            statusMessage,
        });
    }
});