import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateRoleBody {
    role: 'admin' | 'encargado' | 'operario' | 'user' | 'reseller' | 'canastero';
}

export default defineEventHandler(async (event) => {
    try {
        const id = parseInt(event.context.params?.id || '');
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID de usuario inválido',
            });
        }

        const body = await readBody<UpdateRoleBody>(event);
        if (!body.role) {
            throw createError({
                statusCode: 400,
                statusMessage: 'El rol es obligatorio',
            });
        }

        const db = useDrizzle();

        await db.update(users)
            .set({
                role: body.role,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(users.id, id));

        return {
            success: true,
            message: `Rol de usuario actualizado a ${body.role}`,
        };

    } catch (error: any) {
        console.error('Update Role Error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al actualizar el rol del usuario',
        });
    }
});
