import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
// import { requireAdmin } from '~/server/utils/auth'; // Optional security middleware

/**
 * Admin endpoint to approve a user.
 * 
 * Sets the 'status' to 'active'.
 */
export default defineEventHandler(async (event) => {
    try {
        // await requireAdmin(event); // Ensure only admins can access this

        const id = parseInt(event.context.params?.id || '');
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID de usuario inválido',
            });
        }

        const db = useDrizzle();

        // Update the user status to 'active'
        const result = await db.update(users)
            .set({
                status: 'active',
                updatedAt: new Date(),
            })
            .where(eq(users.id, id));

        if (!result) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Usuario no encontrado',
            });
        }

        return {
            success: true,
            message: 'Usuario aprobado exitosamente. Ahora puede iniciar sesión.',
        };

    } catch (error: any) {
        console.error('Approval Error:', error);

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al aprobar usuario',
        });
    }
});
