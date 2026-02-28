import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateStatusBody {
    status: 'pending' | 'active' | 'suspended';
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

        const body = await readBody<UpdateStatusBody>(event);
        if (!body.status) {
            throw createError({
                statusCode: 400,
                statusMessage: 'El estado es obligatorio',
            });
        }

        const db = useDrizzle();

        await db.update(users)
            .set({
                status: body.status,
                // updatedAt is handled by the DB if defined with onUpdateNow, 
                // but our schema.ts doesn't have onUpdateNow for this one.
                // We'll skip manual update for now or use sql`now()`
            })
            .where(eq(users.id, id));

        return {
            success: true,
            message: `Estado de usuario actualizado a ${body.status}`,
        };

    } catch (error: any) {
        console.error('Update Status Error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al actualizar el estado del usuario',
        });
    }
});
