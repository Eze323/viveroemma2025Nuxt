// server/api/sales-by-seller.get.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const salesBySeller = await prisma.users.findMany({
      // 1. Asegúrate de solo seleccionar usuarios que tienen ventas, si es necesario.
      // 2. El 'include' se traduce a 'select' con las relaciones en este caso.
      select: {
        id: true,
        name: true,
        email: true,
        sales: {
          orderBy: {
            date: 'desc',
          },
          select: {
            id: true,
            date: true,
            total_price: true,
            seller: true, // Ya tienes este campo redundante, pero lo mantengo
            // Incluye el nombre del cliente si no usas 'customer_ref'
            customer: true,
            // Si quieres la referencia al cliente del modelo 'customers', usa:
            // customer_ref: { select: { name: true, last_name: true } }, 

            sale_items: {
              select: {
                quantity: true,
                unit_price: true,
                subtotal: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    precio_venta: true,
                  },
                },
              },
            },
          },
        },
      },
      // Ordenar por nombre del vendedor para una mejor visualización
      orderBy: {
        name: 'asc', 
      }
    });

    return {
      success: true,
      data: salesBySeller,
    };
  } catch (error) {
    console.error('Error al obtener ventas por vendedor:', error);
    // Manejo de errores
    return {
      success: false,
      error: 'Error interno del servidor',
    };
  }
});

// ¡Importante!: Cierra la conexión de Prisma si no estás usando un patrón
// de conexión global (aunque el patrón de Nuxt/serverless tiende a manejar esto)
// Si usas un patrón global, esto no sería necesario.
// process.on('beforeExit', () => prisma.$disconnect())