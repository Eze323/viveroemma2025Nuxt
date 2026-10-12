// server/api/sales/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { useDrizzle } from '~/server/utils/drizzle'
import { sales, sale_items, products, customers } from '~/src/db/schema'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle()
    if (!db) {
      throw createError({ statusCode: 500, statusMessage: 'Error de conexión a la base de datos.' })
    }

    // Fetch ventas con join a clientes
    const baseSales = await db
      .select({
        id: sales.id,
        customerId: sales.customerId,
        customer: sales.customer,
        clientName: sales.customer,
        email: sales.email,
        seller: sales.seller,
        time: sales.time,
        date: sales.date,
        amount: sales.totalPrice,
        total_price: sales.totalPrice,
        status: sales.status,
        address: customers.address,
        invoiceType: sales.invoiceType,
        pointOfSale: sales.pointOfSale,
        invoiceNumber: sales.invoiceNumber,
        customerIvaCondition: sales.customerIvaCondition,
        docType: sales.docType,
        docNumber: sales.docNumber,
        netAmount: sales.netAmount,
        vatAmount: sales.vatAmount,
        cae: sales.cae,
        caeExpiration: sales.caeExpiration,
        billingStatus: sales.billingStatus,
        createdAt: sales.createdAt,
        updatedAt: sales.updatedAt,
      })
      .from(sales)
      .leftJoin(customers, eq(sales.customerId, customers.id))
      .orderBy(sql`${sales.date} DESC, ${sales.createdAt} DESC`)

    // Para cada venta, fetch sus items con join a productos
    const salesWithItems = await Promise.all(
      baseSales.map(async (baseSale) => {
        const items = await db
          .select({
            id: sale_items.id,
            product_id: sale_items.product_id,
            productId: sale_items.product_id,
            product: {
              id: products.id,
              name: products.name,
              image_url: products.image_url,
            },
            productName: sql`COALESCE(${products.name}, 'Producto eliminado')`.as('productName'),
            product_name: sql`COALESCE(${products.name}, 'Producto eliminado')`.as('product_name'),
            quantity: sale_items.quantity,
            unit_price: sale_items.unit_price,
            unitPrice: sale_items.unit_price,
            subtotal: sql`${sale_items.quantity} * ${sale_items.unit_price}`.as('subtotal'),
          })
          .from(sale_items)
          .leftJoin(products, eq(sale_items.product_id, products.id))
          .where(eq(sale_items.sale_id, baseSale.id))

        return {
          ...baseSale,
          amount: Number(baseSale.amount),
          total_price: Number(baseSale.total_price),
          items: items.map(item => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            unit_price: Number(item.unit_price),
            subtotal: Number(item.subtotal),
          })),
        }
      })
    )

    return {
      success: true,
      data: salesWithItems,
    }
  } catch (error: any) {
    console.error('Error en GET /api/sales:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Error interno.' })
  }
})
