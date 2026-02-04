// server/api/products/index.get.ts
// import { useDrizzle } from '~/server/utils/drizzle';
// import { products } from '~/src/db/schema';

// export default defineEventHandler(async (event) => {
//   try {
//     //await requireAuth(event);
//     const db = useDrizzle();
//     const productRecords = await db.select().from(products);
//     return { success: true, data: productRecords };
//   } catch (error) {
//     console.error('Error in /api/products:', error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : String(error) 
//     };
//   }
// });

import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    // await requireAuth(event);  // Mantenelo comentado para público
    // console.log('GET /api/products: Iniciando fetch...');  // Log para debug en Netlify Functions logs

    const db = useDrizzle();
    if (!db) {
      throw new Error('DB connection failed');
    }

    // Fetch todos los productos (o filtra por publicado: true si querés solo visibles)
    const productRecords = await db
      .select()
      .from(products)
      //.where(eq(products.publicado, true))  // Opcional: solo publicados; quita si querés todos
      //.where(eq(products.publicado, true))  // Opcional: solo publicados; quita si querés todos
      .orderBy(asc(products.name));  // Ordena por nombre para consistencia

    // console.log(`GET /api/products: Retornando ${productRecords.length} productos`);  // Log de salida

    return {
      success: true,
      data: productRecords
    };
  } catch (error) {
    console.error('Error in /api/products:', error);  // Ya lo tenías
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error // Include full error for debugging
    };
  }
});