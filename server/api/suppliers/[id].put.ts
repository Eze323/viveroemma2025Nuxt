import { useDrizzle } from '~/server/utils/drizzle';
import { suppliers } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const id = Number(getRouterParam(event, 'id'));
        const body = await readBody(event);
        const db = useDrizzle();

        await db.update(suppliers).set({
            name: body.name,
            lastName: body.last_name,
            phone: body.phone,
            address: body.address,
            companyName: body.company_name,
            contact: body.contact,
            notes: body.notes,
            updatedAt: new Date().toISOString(), // Drizzle handles this if configured, but setting explicitly for now
        }).where(eq(suppliers.id, id));

        const [updated] = await db.select().from(suppliers).where(eq(suppliers.id, id));
        return updated;
    } catch (error) {
        console.error('Error in PUT /api/suppliers/[id]:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
