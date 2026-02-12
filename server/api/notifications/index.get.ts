import { db } from '~/server/utils/drizzle';
import { notifications } from '~/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    // Permitir userId por query para que funcione en desarrollo hasta tener auth completa
    const userId = query.userId ? Number(query.userId) : 1;

    return await db.select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(10);
});