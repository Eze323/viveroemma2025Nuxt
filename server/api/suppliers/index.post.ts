import { useDrizzle } from '~/server/utils/drizzle';
import { suppliers } from '~/server/db/schema';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const db = useDrizzle();

        const result = await db.insert(suppliers).values({
            name: body.name,
            lastName: body.last_name || '',
            phone: body.phone || null,
            address: body.address || null,
            companyName: body.company_name || null,
            contact: body.contact || null,
            notes: body.notes || null,
        });

        const [inserted] = await db.select().from(suppliers).where(eq(suppliers.id, result[0].insertId));
        return inserted;
    } catch (error) {
        console.error('Error in POST /api/suppliers:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});

import { eq } from 'drizzle-orm';
