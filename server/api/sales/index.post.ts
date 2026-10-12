// server/api/sales/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { useDrizzle } from '~/server/utils/drizzle'
import { sales, sale_items, customers, products } from '~/src/db/schema'
import { eq, sql } from 'drizzle-orm'

interface SaleItem {
  productId: number
  quantity: number
  unitPrice: number
}

interface SaleBody {
  customerId?: number | null
  customer?: string
  clientName?: string
  email?: string | null
  address?: string | null
  clientAddress?: string | null
  items: SaleItem[]
  subtotal?: number
  iva?: number
  total?: number
  invoiceType?: number
  pointOfSale?: number
  invoiceNumber?: number | null
  customerIvaCondition?: string
  docType?: number
  docNumber?: string | null
  fiscalAddress?: string | null
  netAmount?: number
  vatAmount?: number
  billingStatus?: string
  ivaRate?: number
}

function calculateTotals(items: SaleItem[], ivaRate = 0.21) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const iva = subtotal * ivaRate
  const total = subtotal + iva
  return { subtotal, iva, total }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<SaleBody>(event)

    const items = body.items
    if (!items || items.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Debe incluir al menos un producto.' })
    }

    // Normalizar nombre del cliente
    const customerName = (body.clientName || body.customer || '').trim() || 'Consumidor Final'
    const customerAddress = body.clientAddress || body.address || null

    const db = useDrizzle()
    if (!db) {
      throw createError({ statusCode: 500, statusMessage: 'Error de conexión a la base de datos.' })
    }

    const totals = calculateTotals(items, body.ivaRate ?? 0.21)

    const newSale = await db.transaction(async (tx) => {
      // 1. Validar stock de todos los productos
      await Promise.all(
        items.map(async (item) => {
          const [product] = await tx
            .select({ id: products.id, name: products.name, stock: products.stock })
            .from(products)
            .where(eq(products.id, Number(item.productId)))
            .limit(1)

          if (!product) {
            throw createError({ statusCode: 404, statusMessage: `Producto ID ${item.productId} no encontrado.` })
          }
          if (product.stock < item.quantity) {
            throw createError({
              statusCode: 400,
              statusMessage: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}.`,
            })
          }
        })
      )

      // 2. Resolver o crear cliente
      let finalCustomerId: number | null = body.customerId ? Number(body.customerId) : null

      if (!finalCustomerId) {
        const [existing] = await tx
          .select({ id: customers.id })
          .from(customers)
          .where(eq(customers.name, customerName))
          .limit(1)

        if (existing) {
          finalCustomerId = existing.id
        } else {
          const [newCustomer] = await tx
            .insert(customers)
            .values({
              name: customerName,
              address: customerAddress,
              email: body.email || null,
              taxId: body.docNumber || null,
              ivaCondition: body.customerIvaCondition || 'Consumidor Final',
              fiscalAddress: body.fiscalAddress || null,
            })
            .returning({ id: customers.id })
          finalCustomerId = newCustomer.id
        }
      }

      // 3. Crear la venta
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const timeStr = now.toTimeString().split(' ')[0] // HH:MM:SS

      const [sale] = await tx
        .insert(sales)
        .values({
          userId: 1, // TODO: reemplazar con el userId del token JWT cuando esté implementado
          customerId: finalCustomerId,
          customer: customerName,
          email: body.email || null,
          seller: 'Admin', // TODO: reemplazar con el nombre del usuario autenticado
          date: dateStr,
          time: timeStr,
          status: 'Completada',
          totalPrice: (body.total ?? totals.total).toString(),
          invoiceType: body.invoiceType ?? 99,
          pointOfSale: body.pointOfSale ?? 1,
          invoiceNumber: body.invoiceNumber ?? null,
          customerIvaCondition: body.customerIvaCondition || 'Consumidor Final',
          docType: body.docType ?? 99,
          docNumber: body.docNumber || null,
          netAmount: (body.netAmount ?? totals.subtotal).toString(),
          vatAmount: (body.vatAmount ?? totals.iva).toString(),
          billingStatus: body.billingStatus || 'unbilled',
        })
        .returning({ id: sales.id })

      // 4. Crear sale_items y descontar stock
      for (const item of items) {
        await tx.insert(sale_items).values({
          sale_id: sale.id,
          product_id: Number(item.productId),
          quantity: Number(item.quantity),
          unit_price: Number(item.unitPrice).toString(),
        })

        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            updated_at: now,
          })
          .where(eq(products.id, Number(item.productId)))
      }

      return { id: sale.id, customerId: finalCustomerId }
    })

    return {
      success: true,
      data: {
        id: newSale.id,
        customer: customerName,
        customerId: newSale.customerId,
        subtotal: totals.subtotal,
        iva: totals.iva,
        total: totals.total,
        date: new Date().toISOString().split('T')[0],
        status: 'Completada',
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
      },
    }
  } catch (error: any) {
    console.error('Error en POST /api/sales:', error)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno al procesar la venta.',
    })
  }
})
