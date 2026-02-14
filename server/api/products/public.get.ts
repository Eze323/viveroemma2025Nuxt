import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        if (!db) {
            throw new Error('DB connection failed');
        }

        // Fetch solo los productos publicados
        const productRecords = await db
            .select()
            .from(products)
            .where(eq(products.publicado, true))
            .orderBy(asc(products.name));

        return {
            success: true,
            data: productRecords
        };
    } catch (error) {
        console.error('Error in /api/products/public:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            details: error
        };
    }
});
