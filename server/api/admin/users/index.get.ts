import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();

        const allUsers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                status: users.status,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.id));

        return allUsers;

    } catch (error: any) {
        console.error('Fetch Users Error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al obtener la lista de usuarios',
        });
    }
});
