// // // server/api/products/[id].put.ts
// import { useDrizzle } from '~/server/utils/drizzle';
// import { products } from '~/src/db/schema';
// import { z } from 'zod';
// import { eq } from 'drizzle-orm';
// import { requireAuth } from '~/server/utils/auth';
// import { readBody } from 'h3';

// export default defineEventHandler(async (event) => {
//   try {
//     await requireAuth(event);
//     const db = useDrizzle();

//     const bodySchema = z.object({
//       name: z.string().max(255),
//       category: z.enum(['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta']),
//       description: z.string().max(255),
//       precio_venta: z.number().min(1),
//       precio_compra: z.number().min(1).optional(), // Si necesitas precio_compra, descomentar esta línea
//       publicado: z.boolean().optional(), // Si necesitas el campo publicado, descomentar esta línea
//       sku: z.string().max(50).nullable().optional(), // SKU opcional
//       stock: z.number().int().min(0),
//       pot_size: z.string().max(50).optional(),
//       image_url: z.string().url().optional(),
//     });

//     const idParam = event.context.params?.id;
//     if (!idParam) {
//     }
//     const id = parseInt(idParam);
//     const body = await readBody(event);
//     const validated = bodySchema.parse(body);

//     // Prepare update data
//     const updateData: any = {
//       name: validated.name,
//       category: validated.category,
//       description: validated.description,
//       precio_venta: validated.precio_venta.toFixed(2),
//       stock: validated.stock,
//       pot_size: validated.pot_size,
//       image_url: validated.image_url,
//     };

//     if (validated.precio_compra !== undefined) {
//       updateData.precio_compra = validated.precio_compra.toFixed(2);
//     }

//     if (validated.publicado !== undefined) {
//       updateData.publicado = validated.publicado;
//     }

//     if (validated.sku !== undefined) {
//       updateData.sku = validated.sku;
//     }

//     await db
//       .update(products)
//       .set(updateData)
//       .where(eq(products.id, id));

//     // Fetch updated product
//     const [product] = await db
//       .select()
//       .from(products)
//       .where(eq(products.id, id))
//       .limit(1);

//     if (!product) {
//       throw createError({
//         statusCode: 404,
//         statusMessage: 'Producto no encontrado',
//       });
//     }

//     return {
//       success: true,
//       data: { message: 'Producto actualizado', product }
//     };
//   } catch (error) {
//     console.error('Error in /api/products/[id] PUT:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error)
//     };
//   }
// });

// // server/api/products/[id].put.ts
// // import { PrismaClient } from '@prisma/client';
// // import { createError, defineEventHandler, H3Event, readBody } from 'h3';
// // import jwt from 'jsonwebtoken';

// // const prisma = new PrismaClient();

// // if (!process.env.JWT_SECRET) {
// //   throw new Error('JWT_SECRET no está definido en las variables de entorno');
// // }
// // const JWT_SECRET = process.env.JWT_SECRET;

// // export default defineEventHandler(async (event: H3Event) => {
// //   try {
// //     Validar token JWT
// //     const authHeader = event.node.req.headers.authorization;
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       throw createError({
// //         statusCode: 401,
// //         statusMessage: 'Token de autenticación faltante o inválido',
// //       });
// //     }
// //     const token = authHeader.split(' ')[1];
// //     jwt.verify(token, JWT_SECRET);

// //     Obtener ID del producto
// //     const productId = parseInt(event.context.params?.id || '');
// //     if (isNaN(productId)) {
// //       throw createError({
// //         statusCode: 400,
// //         statusMessage: 'ID de producto inválido',
// //       });
// //     }

// //     Leer datos del cuerpo de la solicitud
// //     const body = await readBody(event);
// //     const { name, category, description, image_url, precio_venta, stock, pot_size, precio_compra, publicado, sku } = body;

// //     Validar campos requeridos
// //     if (!name || !category || precio_venta === undefined || stock === undefined) {
// //       throw createError({
// //         statusCode: 400,
// //         statusMessage: 'Faltan campos obligatorios: name, category, precio_venta, stock',
// //       });
// //     }

// //     Verificar si el producto existe
// //     const existingProduct = await prisma.products.findUnique({
// //       where: { id: productId },
// //     });
// //     if (!existingProduct) {
// //       throw createError({
// //         statusCode: 404,
// //         statusMessage: 'Producto no encontrado',
// //       });
// //     }

// //     Verificar unicidad del SKU (si se proporciona y es diferente)
// //     if (sku && sku !== existingProduct.sku) {
// //       const skuExists = await prisma.products.findFirst({
// //         where: { sku, id: { not: productId } },
// //       });
// //       if (skuExists) {
// //         throw createError({
// //           statusCode: 400,
// //           statusMessage: 'El SKU ya está en uso',
// //         });
// //       }
// //     }

// //     Actualizar el producto
// //     const product = await prisma.products.update({
// //       where: { id: productId },
// //       data: {
// //         name,
// //         category,
// //         description: description || null,
// //         image_url: image_url || null,
// //         precio_venta: Number(precio_venta),
// //         stock: Number(stock),
// //         pot_size: pot_size || null,
// //         precio_compra: Number(precio_compra) || 0,
// //         publicado: publicado !== undefined ? Boolean(publicado) : existingProduct.publicado,
// //         sku: sku || null,
// //         updated_at: new Date(),
// //       },
// //       select: {
// //         id: true,
// //         name: true,
// //         precio_venta: true,
// //         stock: true,
// //       },
// //     });

// //     return {
// //       success: true,
// //       data: {
// //         id: product.id,
// //         name: product.name,
// //         unit_price: Number(product.precio_venta),
// //         stock: product.stock,
// //       },
// //     };
// //   } catch (error) {
// //     console.error('Error en PUT /api/products/[id]:', error);
// //     const err = error as { statusCode?: number; statusMessage?: string };
// //     throw createError({
// //       statusCode: err.statusCode || 500,
// //       statusMessage: err.statusMessage || 'Error en el servidor',
// //     });
// //   } finally {
// //     await prisma.$disconnect();
// //   }
// // });

// server/api/sales/[id].put.ts
import { actualizarSale } from '~~/server/services/salesService';

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const body = await readBody(event);

  // Llama directamente al servicio que ya arreglamos antes
  return await actualizarSale(id, body);
});