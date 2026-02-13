// server/api/admin/resellers.get.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { desc, or, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        const results = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            points: users.points
        })
            .from(users)
            .where(
                or(
                    eq(users.role, 'reseller'),
                    eq(users.role, 'suspendido'),
                    eq(users.role, 'canastero') // Por si acaso usaste este nombre
                )
            )
            .orderBy(desc(users.points));

        return results; // Esto DEBE devolver un array
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        });
    }
});