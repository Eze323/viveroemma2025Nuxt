// server/api/products/[id].put.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    //await requireAuth(event);
    const db = useDrizzle();

    const bodySchema = z.object({
      name: z.string().max(255),
      category: z.enum(['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta']),
      description: z.string().max(255),
      precio_venta: z.number().min(1),
      precio_compra: z.number().min(1).optional(), // Si necesitas precio_compra, descomentar esta línea
      publicado: z.boolean().optional(), // Si necesitas el campo publicado, descomentar esta línea
      sku: z.string().max(50).nullable().optional(), // SKU opcional
      stock: z.number().int().min(0),
      pot_size: z.enum(['pequeña', 'mediana', 'grande']).optional(),
      image_url: z.string().url().optional(),
    });

    const idParam = event.context.params?.id;
    if (!idParam) {
    }
    const id = parseInt(idParam);
    const body = await readBody(event);
    const validated = bodySchema.parse(body);

    const [product] = await db
      .update(products)
      .set({
        name: validated.name,
        category: validated.category,
        description: validated.description,
        precio_compra: validated.precio_compra.toFixed(2),
        precio_venta: validated.precio_venta.toFixed(2),
        publicado: validated.publicado !== undefined ? validated.publicado : true,
        sku: validated.sku || null,
        stock: validated.stock,
        pot_size: validated.pot_size,
        image_url: validated.image_url,
      })
      .where(eq(products.id, id))
      ;

    if (!product) {
    }

    return { 
      success: true, 
      data: { message: 'Producto actualizado', product } 
    };
  } catch (error) {
    console.error('Error in /api/products/[id] PUT:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
});