import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders, resellerOrderItems, notifications, users } from '~/server/db/schema';
import { sql, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const db = useDrizzle();
    const body = await readBody(event);
    const { userId, items, total } = body;

    return await db.transaction(async (tx) => {
        // 1. Crear la Orden
        const [result] = await tx.insert(resellerOrders).values({
            userId,
            total,
            status: 'pending_payment',
            createdAt: sql`NOW()`, // Agregamos fecha de creación explícita si es necesario, o dejamos que DB lo maneje
        });
        const orderId = result.insertId;

        // 2. Insertar Items en BLOQUE (Mucho más rápido)
        const itemsToInsert = items.map((item: any) => ({
            orderId,
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.quantity * item.price
        }));
        await tx.insert(resellerOrderItems).values(itemsToInsert);

        // Obtener datos del usuario para la notificación
        const [user] = await tx.select().from(users).where(eq(users.id, userId)).limit(1);

        // 3. Notificación "silenciosa" para el Admin
        await tx.insert(notifications).values({
            userId: 1,
            title: 'Nuevo pedido mayorista',
            message: `${user?.name || 'Un canastero'} acaba de realizar un pedido por $${total}`,
            type: 'sale',
            link: '/admin/pedidos-mayoristas'
        });

        return { success: true, data: { orderId } };
    });
});