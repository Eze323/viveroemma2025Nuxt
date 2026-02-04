import { useDrizzle } from '~/server/utils/drizzle';
import { resellerOrders } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';
// import { uploadToStorage } from '~/utils/storage'; // fake utility

export default defineEventHandler(async (event) => {
    try {
        // const user = await requireAuth(event);
        // Parse multipart form data
        // For now, we'll assume a simplifed JSON body with a base64 string or pre-signed URL
        // In a real app, use formidable or similar for multipart

        // MOCK IMPLEMENTATION: Expecting { orderId, proofUrl } from client (who might have uploaded to S3/Cloudinary directly)
        // OR we receive a base64 string and save it.

        const body = await readBody(event);
        const { orderId, proofUrl } = body;

        if (!orderId || !proofUrl) {
            throw new Error('Order ID and Proof URL required');
        }

        const db = useDrizzle();

        await db.update(resellerOrders)
            .set({
                paymentProofUrl: proofUrl,
                status: 'paid', // Mark as paid, waiting for approval
                updatedAt: sql`NOW()`
            })
            .where(eq(resellerOrders.id, Number(orderId)));

        return {
            success: true,
            message: 'Proof uploaded successfully'
        };

    } catch (error) {
        console.error('Error uploading proof:', error);
        return {
            success: false,
            error: 'Failed to upload proof'
        };
    }
});
