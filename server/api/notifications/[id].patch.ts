import { useDrizzle } from '~/server/utils/drizzle';
import { notifications } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' });

    const db = useDrizzle();

    await db.update(notifications)
        .set({ isRead: 1 })
        .where(eq(notifications.id, parseInt(id)));

    return { success: true };
});