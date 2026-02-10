// server/api/admin/resellers/ranking.get.ts

import { users } from '~/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const db = useDrizzle();

    return await db.select({
        name: users.name,
        points: users.points
    })
        .from(users)
        .where(eq(users.role, 'reseller'))
        .orderBy(desc(users.points))
        .limit(5); // El Top 5
});