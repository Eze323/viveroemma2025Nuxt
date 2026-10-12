// server/api/auth/user.get.ts
import { defineEventHandler, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { db } from '~/server/utils/drizzle'
import { users } from '~/src/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const authUser = await requireAuth(event)

    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1)

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Usuario no encontrado.' })
    }

    return { success: true, user }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Error interno.' })
  }
})
