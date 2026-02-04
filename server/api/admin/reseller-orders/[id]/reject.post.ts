import { defineEventHandler, getRouterParam, readBody } from 'h3';
import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    // await requireAdmin(event); // TODO: Add admin check
    const idStr = getRouterParam(event, 'id');
    const id = parseInt(idStr as string);

    if (isNaN(id)) {
        return { success: false, error: 'Invalid ID' };
    }

    const { reason } = await readBody(event).catch(() => ({ reason: 'Comprobante rechazado' }));
    const db = useDrizzle();

    try {
        await db.update(resellerOrders)
            .set({
                status: 'pending_payment', // Reset to pending
                paymentProofUrl: null, // Clear proof
                // We might want to add a 'rejectReason' column later for better UX
            })
            .where(eq(resellerOrders.id, id));

        return { success: true, message: 'Pago rechazado correctamente' };
    } catch (error) {
        console.error('Error rejecting payment:', error);
        return { success: false, error: 'Error al rechazar el pago' };
    }
});
