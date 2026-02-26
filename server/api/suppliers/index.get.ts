import { useDrizzle } from '~/server/utils/drizzle';
import { suppliers } from '~/server/db/schema';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        const allSuppliers = await db.select().from(suppliers).orderBy(asc(suppliers.name));
        return allSuppliers;
    } catch (error) {
        console.error('Error in GET /api/suppliers:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
