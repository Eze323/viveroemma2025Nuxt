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
import { resellerOrders, users } from '~/server/db/schema'; // Importamos users también
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();

        // En el panel de Admin, queremos ver TODOS los pedidos
        // Hacemos un Left Join con la tabla users para traer el nombre del canastero
        const orders = await db
            .select({
                id: resellerOrders.id,
                userId: resellerOrders.userId,
                userName: users.name, // Traemos el nombre desde la tabla users
                total: resellerOrders.total,
                status: resellerOrders.status,
                paymentProofUrl: resellerOrders.paymentProofUrl,
                createdAt: resellerOrders.createdAt,
            })
            .from(resellerOrders)
            .leftJoin(users, eq(resellerOrders.userId, users.id)) // Unimos por ID de usuario
            .orderBy(desc(resellerOrders.createdAt));

        return {
            success: true,
            data: orders
        };

    } catch (error: any) {
        console.error('Error fetching admin orders:', error);
        return {
            success: false,
            error: 'Error al cargar los pedidos: ' + error.message
        };
    }
});