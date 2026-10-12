// server/api/products/[id].get.ts
import { defineEventHandler, createError } from 'h3'
import { useDrizzle } from '~/server/utils/drizzle'
import { products } from '~/src/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle()
    const id = parseInt(event.context.params?.id || '')

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
    }

    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1)

    if (!product) {
      throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' })
    }

    return { success: true, data: product }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Error interno.' })
  }
})
