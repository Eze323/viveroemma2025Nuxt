// server/api/products/index.post.ts
import { useDrizzle } from '~/server/utils/drizzle'
import { requireAuth } from '~/server/utils/auth'
import { products } from '~/src/db/schema'
import { eq } from 'drizzle-orm'
import { defineEventHandler, readBody, createError } from 'h3'
import { validateProductData, ValidationError } from '~/server/utils/validation'

/**
 * @api {post} /api/products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiDescription Create a new product in the database with validation
 * @apiPermission admin, encargado
 */

const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret'
export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)
    const db = useDrizzle()

    const body = await readBody(event)

    // Validate product data
    try {
      validateProductData(body)
    } catch (error) {
      if (error instanceof ValidationError) {
        throw createError({
          statusCode: 400,
          statusMessage: error.message,
        })
      }
      throw error
    }

    // Check for duplicate SKU if provided
    if (body.sku) {
      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.sku, body.sku))
        .limit(1)

      if (existing) {
        throw createError({
          statusCode: 400,
          statusMessage: `Ya existe un producto con el SKU: ${body.sku}`,
        })
      }
    }

    // Insert product
    const [product] = await db
      .insert(products)
      .values({
        name: body.name,
        category: body.category,
        description: body.description || null,
        precio_venta: Number(body.precio_venta).toFixed(2),
        precio_compra: body.precio_compra ? Number(body.precio_compra).toFixed(2) : '0.00',
        publicado: body.publicado !== undefined ? body.publicado : true,
        sku: body.sku || null,
        stock: body.stock,
        pot_size: body.pot_size || 'Sin especificar',
        image_url: body.image_url || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .$returningId()

    return {
      success: true,
      data: {
        id: product.id,
        name: body.name,
        category: body.category,
        precio_venta: body.precio_venta,
        stock: body.stock,
      },
    }
  } catch (error) {
    console.error('Error in /api/products POST:', error)

    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
      }
    }

    const err = error as { statusCode?: number; statusMessage?: string }
    return {
      success: false,
      error: err.statusMessage || 'Error al crear producto',
    }
  }
})
