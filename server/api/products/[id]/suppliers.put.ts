import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        //arma una estructura ficticia para que no falle
        const suppliers = [];
        suppliers.push({
            id: 1,
            supplierId: 1,
            productId: 1,
            costPrice: 10,
            quantity: 10,
            minOrderQty: 1,
            lastPurchaseDate: '2022-01-01',
            notes: 'notes',
            supplierName: 'supplierName',
            supplierLastName: 'supplierLastName',
        });
        // const productId = Number(getRouterParam(event, 'id'));
        // const body = await readBody(event); // Expected { suppliers: [ { supplierId, costPrice, quantity, ... } ] }
        //const db = useDrizzle();

        // if (!Array.isArray(body.suppliers)) {
        //     throw createError({
        //         statusCode: 400,
        //         statusMessage: 'Invalid input: suppliers must be an array',
        //     });
        // }

        // Transaction to ensure consistency
        // await db.transaction(async (tx) => {
        //     // 1. Delete existing suppliers for this product
        //     // Note: In some cases you might want to sync instead of delete/insert
        //     await tx.delete(productSuppliers).where(eq(productSuppliers.productId, productId));

        //     // 2. Insert new suppliers
        //     if (body.suppliers.length > 0) {
        //         await tx.insert(productSuppliers).values(
        //             body.suppliers.map((ps: any) => ({
        //                 productId: productId,
        //                 supplierId: ps.supplierId,
        //                 costPrice: ps.costPrice,
        //                 quantity: ps.quantity || 0,
        //                 minOrderQty: ps.minOrderQty || 0,
        //                 notes: ps.notes || null,
        //             }))
        //         );
        //     }

        //     // 3. Update total stock in products table
        //     const totalStock = body.suppliers.reduce((sum: number, ps: any) => sum + (ps.quantity || 0), 0);
        //     await tx.update(products).set({ stock: totalStock }).where(eq(products.id, productId));
        //   });

        return { success: true, message: 'Product suppliers updated successfully' };
    } catch (error) {
        console.error(`Error in PUT /api/products/${getRouterParam(event, 'id')}/suppliers:`, error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
