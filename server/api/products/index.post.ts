// // server/api/products/index.post.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { products } from '~/src/db/schema';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  try {
    //await requireAuth(event);
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
      pot_size: z.enum(['Sin especificar','pequeña', 'mediana', 'grande','3 Lts','4 Lts','7 Lts','10 Lts']).optional(),
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

// server/api/products/index.post.ts
// import { PrismaClient } from '@prisma/client';
// import { createError, defineEventHandler, H3Event, readBody } from 'h3';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();

// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET no está definido en las variables de entorno');
// }
// const JWT_SECRET = process.env.JWT_SECRET;

// export default defineEventHandler(async (event: H3Event) => {
//   try {
//     // Validar token JWT
//     const authHeader = event.node.req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Token de autenticación faltante o inválido',
//       });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, JWT_SECRET);

//     // Leer datos del cuerpo de la solicitud
//     const body = await readBody(event);
//     const { name, category, description, image_url, precio_venta, stock, pot_size, precio_compra, publicado, sku } = body;

//     // Validar campos requeridos
//     if (!name || !category || !precio_venta || stock === undefined) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Faltan campos obligatorios: name, category, precio_venta, stock',
//       });
//     }

//     // Crear el producto
//     const product = await prisma.products.create({
//       data: {
//         name,
//         category,
//         description: description || null,
//         image_url: image_url || null,
//         precio_venta: Number(precio_venta),
//         stock: Number(stock),
//         pot_size: pot_size || null,
//         precio_compra: Number(precio_compra) || 0,
//         publicado: publicado !== undefined ? Boolean(publicado) : true,
//         sku: sku || null,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       select: {
//         id: true,
//         name: true,
//         precio_venta: true,
//         stock: true,
//       },
//     });

//     return {
//       success: true,
//       data: {
//         id: product.id,
//         name: product.name,
//         unit_price: Number(product.precio_venta),
//         stock: product.stock,
//       },
//     };
//   } catch (error) {
//     console.error('Error en POST /api/products:', error);
//     const err = error as { statusCode?: number; statusMessage?: string };
//     throw createError({
//       statusCode: err.statusCode || 500,
//       statusMessage: err.statusMessage || 'Error en el servidor',
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// });