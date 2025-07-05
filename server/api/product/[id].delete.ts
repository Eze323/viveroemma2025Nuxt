// server/api/products/[id].delete.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
   // await requireAuth(event);
    const db = useDrizzle();

    const idParam = event.context.params?.id;
    if (!idParam) {
    }
    const id = parseInt(idParam);
    const [product] = await db.delete(products).where(eq(products.id, id));

    if (!product) {
    }

    return { success: true, data: { message: 'Producto eliminado' } };
  } catch (error) {
    console.error('Error in /api/products/[id] DELETE:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
});