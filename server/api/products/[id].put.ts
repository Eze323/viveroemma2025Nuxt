import { defineEventHandler, readBody, createError } from 'h3'
import { and, eq, ne } from 'drizzle-orm'
import { useDrizzle } from '~/server/utils/drizzle'
import { requireAuth } from '~/server/utils/auth'
import { products } from '~/src/db/schema'
import { validateProductData, ValidationError } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)

    const id = Number(event.context.params?.id)
    if (!Number.isInteger(id) || id <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
    }

    const db = useDrizzle()
    const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' })
    }

    const body = await readBody<Record<string, any>>(event) || {}
    const productData = {
      ...body,
      name: body.name ?? existing.name,
      category: body.category ?? existing.category,
      description: body.description ?? existing.description,
      precio_venta: Number(body.precio_venta ?? existing.precio_venta),
      precio_compra: Number(body.precio_compra ?? existing.precio_compra),
      stock: Number(body.stock ?? existing.stock),
      pot_size: body.pot_size ?? existing.pot_size,
      image_url: body.image_url ?? existing.image_url,
      sku: body.sku ?? existing.sku,
      publicado: body.publicado ?? existing.publicado,
    }

    validateProductData(productData)

    if (productData.sku && productData.sku !== existing.sku) {
      const [duplicate] = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.sku, productData.sku), ne(products.id, id)))
        .limit(1)

      if (duplicate) {
        throw createError({ statusCode: 400, statusMessage: `Ya existe un producto con el SKU: ${productData.sku}` })
      }
    }

    const [product] = await db
      .update(products)
      .set({
        name: productData.name,
        category: productData.category,
        description: productData.description || null,
        precio_venta: productData.precio_venta.toFixed(2),
        precio_compra: productData.precio_compra.toFixed(2),
        stock: productData.stock,
        pot_size: productData.pot_size || 'Sin especificar',
        image_url: productData.image_url || null,
        sku: productData.sku || null,
        publicado: Boolean(productData.publicado),
        updated_at: new Date(),
      })
      .where(eq(products.id, id))
      .returning()

    return { success: true, message: 'Producto actualizado con éxito', data: product }
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }
    if (error.statusCode) throw error
    console.error('Error en PUT /api/products/[id]:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el producto.' })
  }
})