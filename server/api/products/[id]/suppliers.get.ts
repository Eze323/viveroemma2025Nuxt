import { useDrizzle } from '~/server/utils/drizzle';
//import { suppliers } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const results = [];
        //arma una estructura ficticia para que no falle
        results.push({
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
        // const db = useDrizzle();

        // const results = await db.select({
        //     id: productSuppliers.id,
        //     supplierId: productSuppliers.supplierId,
        //     productId: productSuppliers.productId,
        //     costPrice: productSuppliers.costPrice,
        //     quantity: productSuppliers.quantity,
        //     minOrderQty: productSuppliers.minOrderQty,
        //     lastPurchaseDate: productSuppliers.lastPurchaseDate,
        //     notes: productSuppliers.notes,
        //     supplierName: suppliers.name,
        //     supplierLastName: suppliers.lastName,
        // })
        //     .from(productSuppliers)
        //     .innerJoin(suppliers, eq(productSuppliers.supplierId, suppliers.id))
        //     .where(eq(productSuppliers.productId, productId));

        return results;
    } catch (error) {
        console.error(`Error in GET /api/products/${getRouterParam(event, 'id')}/suppliers:`, error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
