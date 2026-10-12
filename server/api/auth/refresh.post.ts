import { createError, defineEventHandler, getCookie, setCookie } from 'h3'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { users } from '~/src/db/schema'
import { db } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const jwtSecret = config.jwtSecret || process.env.JWT_SECRET

  if (!jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Error de configuración del servidor.' })
  }

  const refreshToken = getCookie(event, 'refresh_token')
  if (!refreshToken) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión expirada.' })
  }

  let payload: jwt.JwtPayload
  try {
    const verified = jwt.verify(refreshToken, jwtSecret)
    if (typeof verified === 'string' || verified.type !== 'refresh' || typeof verified.userId !== 'number') {
      throw new Error('Invalid refresh token')
    }
    payload = verified
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Sesión expirada.' })
  }

  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no encontrado.' })
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, name: user.name, type: 'access' },
    jwtSecret,
    { expiresIn: '15m' }
  )
  const nextRefreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    jwtSecret,
    { expiresIn: '7d' }
  )

  setCookie(event, 'token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 15 * 60,
  })
  setCookie(event, 'refresh_token', nextRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60,
  })

  return {
    success: true,
    user,
    token,
  }
})