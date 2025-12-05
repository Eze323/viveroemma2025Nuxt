// server/api/sales-by-seller.get.ts

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default defineEventHandler(async (event) => {
//   try {
//     const salesBySeller = await prisma.users.findMany({
//       // 1. Asegúrate de solo seleccionar usuarios que tienen ventas, si es necesario.
//       // 2. El 'include' se traduce a 'select' con las relaciones en este caso.
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         sales: {
//           orderBy: {
//             date: 'desc',
//           },
//           select: {
//             id: true,
//             date: true,
//             total_price: true,
//             seller: true, // Ya tienes este campo redundante, pero lo mantengo
//             // Incluye el nombre del cliente si no usas 'customer_ref'
//             customer: true,
//             // Si quieres la referencia al cliente del modelo 'customers', usa:
//             // customer_ref: { select: { name: true, last_name: true } }, 

//             sale_items: {
//               select: {
//                 quantity: true,
//                 unit_price: true,
//                 subtotal: true,
//                 product: {
//                   select: {
//                     id: true,
//                     name: true,
//                     sku: true,
//                     precio_venta: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       // Ordenar por nombre del vendedor para una mejor visualización
//       orderBy: {
//         name: 'asc', 
//       }
//     });

//     return {
//       success: true,
//       data: salesBySeller,
//     };
//   } catch (error) {
//     console.error('Error al obtener ventas por vendedor:', error);
//     // Manejo de errores
//     return {
//       success: false,
//       error: 'Error interno del servidor',
//     };
//   }
// });

// ¡Importante!: Cierra la conexión de Prisma si no estás usando un patrón
// de conexión global (aunque el patrón de Nuxt/serverless tiende a manejar esto)
// Si usas un patrón global, esto no sería necesario.
// process.on('beforeExit', () => prisma.$disconnect())


// server/api/sales/index.get.ts
import { useDrizzle } from '~/server/utils/drizzle';
import { sales, sale_items, products, customers } from '~/src/db/schema';  // Sin customers/users
import { eq, sql } from 'drizzle-orm';
import client from '~/src/generated/prisma/client';
import { customType } from 'drizzle-orm/mysql-core';

export default defineEventHandler(async (event) => {
  try {
    // await requireAuth(event);  // Comentado para público
    console.log('GET /api/sales: Iniciando fetch...');

    const db = useDrizzle();
    if (!db) {
      throw new Error('DB connection failed');
    }

    // Paso 1: Fetch ventas básicas (sin joins a customer/user)
    const baseSales = await db
      .select({
        id: sales.id,
        customer: sales.customerId,
        clientName: sales.customer,
        email: sales.email,
        seller: sales.seller,
        time: sql`DATE_FORMAT(${sales.date}, '%H:%i %p')`.as('time'),
        date: sql`DATE(${sales.date})`.as('date'),
        amount: sales.totalPrice,
        address: customers.address,
      })
      .from(sales)
      .leftJoin(customers, eq(sales.customerId, customers.id))
      .orderBy(sql`${sales.date} DESC`); // Ordena por fecha más reciente primero

    // Paso 2: Para cada venta, fetch sus items con join a products
    const salesWithItems = await Promise.all(
      baseSales.map(async (baseSale) => {
        const items = await db
          .select({
            id: sale_items.id,
            productId: sale_items.product_id,
            productName: sql`COALESCE(${products.name}, 'Producto eliminado')`.as('productName'),
            quantity: sale_items.quantity,
            unitPrice: sale_items.unit_price,
            subtotal: sql`${sale_items.quantity} * ${sale_items.unit_price}`.as('subtotal'),
          })
          .from(sale_items)
          .leftJoin(products, eq(sale_items.product_id, products.id))
          .where(eq(sale_items.sale_id, baseSale.id));

        if (items.length === 0) {
          console.log(`No items found for sale ${baseSale.id}`);
        } else {
          console.log(`Found ${items.length} items for sale ${baseSale.id}`);
        }

        return {
          ...baseSale,
          amount: Number(baseSale.amount),  // Convierte decimal a number
          items: items.map(item => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            subtotal: Number(item.subtotal),
          })),
        };
      })
    );

    console.log(`GET /api/sales: Retornando ${salesWithItems.length} ventas con items`);

    return {
      success: true,
      data: salesWithItems
    };
  } catch (error) {
    console.error('Error in /api/sales:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
});