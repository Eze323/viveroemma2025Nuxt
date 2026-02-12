import { db } from '~/server/utils/drizzle';
import { resellerOrders as orders, users, notifications } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event); // { userId, reason }

    await db.transaction(async (tx) => {
        // Volvemos el pedido a 'pending_payment' para que el canastero suba otro comprobante
        await tx.update(orders)
            .set({ status: 'pending_payment' })
            .where(eq(orders.id, parseInt(id!)));

        // Notificamos al canastero por qué se rechazó
        await tx.insert(notifications).values({
            userId: body.userId,
            title: 'Problema con tu pago',
            message: `Tu comprobante fue rechazado: ${body.reason}. Por favor, subí uno nuevo.`,
            type: 'stock', // Usamos color naranja/alerta
            link: '/reseller/comprobante'
        });
    });

    return { success: true };
});