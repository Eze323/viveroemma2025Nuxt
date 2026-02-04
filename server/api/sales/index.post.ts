// server/api/sales/index.post.ts
import { useDrizzle } from '~/server/utils/drizzle'
import { sales, sale_items, customers, products } from '~/src/db/schema'
import { eq, sql } from 'drizzle-orm'
import { createError, defineEventHandler, readBody, getHeader } from 'h3'
import jwt from 'jsonwebtoken'
import { validateSaleData, calculateSaleTotals, ValidationError } from '~/server/utils/validation'


interface SaleItem {
  productId: number
  quantity: number
  unitPrice: number
}

interface SaleBody {
  customerId?: number
  customer: string
  email?: string
  address?: string
  items: SaleItem[]
  subtotal?: number
  iva?: number
  total?: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret'

export default defineEventHandler(async (event) => {
  try {
    // Auth (temporal bypass)
    const decoded = { userId: 1, email: 'admin@test.com', role: 'admin' }

    // Read and validate body
    const body = await readBody<SaleBody>(event)

    // Validate sale data
    try {
      validateSaleData(body)
    } catch (error) {
      if (error instanceof ValidationError) {
        throw createError({
          statusCode: 400,
          statusMessage: error.message,
        })
      }
      throw error
    }

    const { customerId: providedCustomerId, customer, email, address, items } = body

    const db = useDrizzle()
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error de conexión a la base de datos',
      })
    }

    // Calculate totals server-side (don't trust frontend)
    const totals = calculateSaleTotals(items)
    let finalCustomerId: number | null = null

    // Create sale in transaction
    const newSale = await db.transaction(async (tx) => {
      // 1. Validate stock availability for all products
      const stockChecks = await Promise.all(
        items.map(async (item) => {
          const [product] = await tx
            .select({
              id: products.id,
              name: products.name,
              stock: products.stock
            })
            .from(products)
            .where(eq(products.id, item.productId))
            .limit(1)

          if (!product) {
            throw createError({
              statusCode: 404,
              statusMessage: `Producto con ID ${item.productId} no encontrado`,
            })
          }

          if (product.stock < item.quantity) {
            throw createError({
              statusCode: 400,
              statusMessage: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`,
            })
          }

          return product
        })
      )

      // 2. Resolve or create customer
      finalCustomerId = providedCustomerId || null

      if (!finalCustomerId) {
        // Search for existing customer by name
        const [existingCustomer] = await tx
          .select({ id: customers.id })
          .from(customers)
          .where(eq(customers.name, customer))
          .limit(1)

        if (existingCustomer) {
          finalCustomerId = existingCustomer.id
          // console.log('Cliente existente encontrado, ID:', finalCustomerId)
        } else {
          // Create new customer
          const [newCustomer] = await tx
            .insert(customers)
            .values({
              name: customer,
              address: address || null,
              email: email || null,
            })
            .$returningId()

          finalCustomerId = newCustomer.id
          // console.log('Nuevo cliente creado, ID:', finalCustomerId)
        }
      }

      // 3. Create sale record
      const [sale] = await tx
        .insert(sales)
        .values({
          userId: decoded.userId,
          customerId: finalCustomerId,
          customer,
          email: email || null,
          seller: decoded.email,
          date: new Date(),
          time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          status: 'Completada',
          totalPrice: totals.total.toString(),
          // created_at will be set automatically by defaultNow
        })
        .$returningId()

      // 4. Create sale items and update stock atomically
      for (const item of items) {
        // Insert sale item
        await tx.insert(sale_items).values({
          sale_id: sale.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice.toString(),
        })

        // Update product stock (atomic decrement)
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            updated_at: new Date(),
          })
          .where(eq(products.id, item.productId))
      }

      return sale
    })

    // Return success response
    return {
      success: true,
      data: {
        id: newSale.id,
        customer,
        customerId: finalCustomerId,
        subtotal: totals.subtotal,
        iva: totals.iva,
        total: totals.total,
        date: new Date().toISOString().split('T')[0],
        status: 'Completada',
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    }
  } catch (error) {
    console.error('Error en /api/sales:', error)

    // Handle validation errors
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      })
    }

    // Handle other errors
    const err = error as { statusCode?: number; statusMessage?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    })
  }
})