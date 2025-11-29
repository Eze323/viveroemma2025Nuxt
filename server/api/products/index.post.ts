// // server/api/products/index.post.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { requireAuth } from '~/server/utils/auth';
import { products } from '~/src/db/schema';
import { z } from 'zod';
import { defineEventHandler, readBody, createError } from 'h3';

/**
 * @api {post} /api/products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiDescription Create a new product in the database.
 * @apiPermission admin, encargado
 * @apiHeader {String} Authorization Bearer token
 * @apiBody {String} name Product name
 * @apiBody {String} category Product category
 * @apiBody {Number} precio_venta Selling price
 * @apiBody {Number} stock Stock quantity
 */
export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event);
    const db = useDrizzle();

    const bodySchema = z.object({
      name: z.string().max(255),
      category: z.string().max(50),
      description: z.string().max(500).optional(),
      precio_venta: z.number().min(1),
      precio_compra: z.number().min(1).optional(), // Si necesitas precio_compra, descomentar esta línea
      publicado: z.boolean().optional(), // Si necesitas el campo publicado, descomentar esta línea
      sku: z.string().max(50).nullable().optional(), // SKU opc
      stock: z.number().int().min(1),
      pot_size: z.enum(['Sin especificar', 'pequeña', 'mediana', 'grande', '3 Lts', '4 Lts', '7 Lts', '10 Lts']).optional(),
      image_url: z.string().nullable().optional(),
    });

    const body = await readBody(event);
    const validated = bodySchema.parse(body);

    const [product] = await db
      .insert(products)
      .values({
        name: validated.name,
        category: validated.category,
        description: validated.description || null, // Asegurarse de que sea null si no se proporciona
        precio_venta: Number(validated.precio_venta).toFixed(2), // Convertir a string con 2 decimales
        precio_compra: validated.precio_compra ? Number(validated.precio_compra).toFixed(2) : '0.00', // Convertir a string con 2 decimales
        publicado: validated.publicado !== undefined ? validated.publicado : true, // Por defecto true
        sku: validated.sku || null, // Asegurarse de que sea null si
        stock: validated.stock,
        pot_size: validated.pot_size,
        image_url: validated.image_url,
      })
      ;

    return {
      success: true,
      data: { message: 'Producto creado', product }
    };
  } catch (error) {
    console.error('Error in /api/product POST:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
});
