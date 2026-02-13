import { useDrizzle } from '~/server/utils/drizzle';
import { eq, or, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const db = useDrizzle();
    try {
        const results = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            points: users.points
        })
            .from(users)
            // Buscamos tanto a los activos como a los suspendidos para la tabla
            .where(
                or(
                    eq(users.role, 'reseller'),
                    eq(users.role, 'canastero'),
                    eq(users.role, 'suspendido')
                )
            )
            .orderBy(desc(users.points));

        console.log(results);
        return results; // Nuxt lo enviará como un JSON Array []
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al obtener canasteros'
        });
    }
});