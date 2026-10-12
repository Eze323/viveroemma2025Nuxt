// server/api/auth/login.post.ts
import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { db } from '~/server/utils/drizzle'
import { users } from '~/src/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface LoginBody {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginBody>(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Faltan email o contraseña.' })
    }

    const config = useRuntimeConfig()
    const JWT_SECRET = config.jwtSecret || process.env.JWT_SECRET
    if (!JWT_SECRET) {
      throw createError({ statusCode: 500, statusMessage: 'Error de configuración del servidor.' })
    }

    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, password: users.password, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas.' })
    }

    const userId = Number(user.id)
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw createError({ statusCode: 500, statusMessage: 'ID de usuario inválido.' })
    }

    const compatiblePasswordHash = user.password.replace(/^\$2y\$/, '$2b$')
    const isPasswordValid = await bcrypt.compare(password, compatiblePasswordHash)
    if (!isPasswordValid) {
      throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas.' })
    }

    // Access Token (15 minutos)
    const accessToken = jwt.sign(
      { userId, email: user.email, role: user.role, name: user.name, type: 'access' },
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    // Refresh Token (7 días)
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Refresh token como cookie HttpOnly
    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    })

    // Access token como cookie accesible por JS (para SSR)
    setCookie(event, 'token', accessToken, {
      httpOnly: false,
      path: '/',
      maxAge: 15 * 60,
    })

    return {
      success: true,
      user: { id: userId, name: user.name, email: user.email, role: user.role },
      token: accessToken,
    }
  } catch (error: any) {
    console.error('Error en POST /api/auth/login:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Error en el servidor.' })
  }
})
