import { useDrizzle } from '~/server/utils/drizzle';
import { suppliers } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const id = Number(getRouterParam(event, 'id'));
        const db = useDrizzle();

        await db.delete(suppliers).where(eq(suppliers.id, id));

        return { success: true, message: 'Supplier deleted successfully' };
    } catch (error) {
        console.error('Error in DELETE /api/suppliers/[id]:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
