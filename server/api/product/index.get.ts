// server/api/products/index.get.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';

export default defineEventHandler(async (event) => {
  try {
    //await requireAuth(event);
    const db = useDrizzle();
    const productRecords = await db.select().from(products);
    return { success: true, data: productRecords };
  } catch (error) {
    console.error('Error in /api/products:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
});