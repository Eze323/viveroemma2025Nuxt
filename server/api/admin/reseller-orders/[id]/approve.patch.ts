import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders as orders, users, notifications } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event); // { userId, points }

    const db = useDrizzle();

    return await db.transaction(async (tx) => {
        // 1. Marcar pedido como completado
        await tx.update(orders)
            .set({ status: 'completed' })
            .where(eq(orders.id, parseInt(id!)));

        // 2. Sumar puntos al Canastero
        await tx.update(users)
            .set({ points: sql`${users.points} + ${body.points}` })
            .where(eq(users.id, body.userId));

        // 3. Notificación para el Admin (Campanita)
        await tx.insert(notifications).values({
            userId: 1, // Tu ID de admin
            title: 'Venta Confirmada',
            message: `Se aprobaron ${body.points} puntos por un pedido de mayorista.`,
            type: 'sale',
            link: '/admin/pedidos-mayoristas'
        });

        // 4. (Opcional) Notificación para el Canastero
        // Si querés que el canastero también vea una alerta de que le aprobaron el pedido:
        await tx.insert(notifications).values({
            userId: body.userId,
            title: '¡Pedido Aprobado!',
            message: `Tu pedido ha sido procesado. Sumaste ${body.points} puntos.`,
            type: 'info',
            link: '/reseller/mis-pedidos'
        });

        return { success: true };
    });
});