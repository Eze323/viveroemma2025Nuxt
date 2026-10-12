// server/api/products/[id].delete.ts
import { defineEventHandler, createError } from 'h3'
import { useDrizzle } from '~/server/utils/drizzle'
import { products, sale_items } from '~/src/db/schema'
import { eq, count } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle()
    const id = parseInt(event.context.params?.id || '')

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
    }

    // Verificar si el producto existe
    const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.id, id)).limit(1)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' })
    }

    // Verificar si tiene sale_items asociados
    const [{ value: relatedCount }] = await db
      .select({ value: count() })
      .from(sale_items)
      .where(eq(sale_items.product_id, id))

    if (relatedCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se puede eliminar el producto porque está asociado a una o más ventas.',
      })
    }

    await db.delete(products).where(eq(products.id, id))

    return { success: true, data: { message: 'Producto eliminado exitosamente.' } }
  } catch (error: any) {
    console.error('Error en DELETE /api/products/[id]:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Error interno.' })
  }
})
