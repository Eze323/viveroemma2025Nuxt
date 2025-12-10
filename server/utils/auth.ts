import { H3Event, createError, getRequestHeaders } from 'h3'
import jwt from 'jsonwebtoken'

export async function requireAuth(event: H3Event) {
    const headers = getRequestHeaders(event)

    // Aceptamos ambos formatos: authorization y Authorization
    const authHeader =
        headers.authorization ||
        headers.Authorization ||
        headers.AUTHORIZATION

    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        // Try to get token from cookie
        token = getCookie(event, 'token');
    }

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'No token provided',
        })
    }

    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || process.env.JWT_SECRET

    if (!jwtSecret) {
        console.error('JWT_SECRET missing in runtime config')
        throw createError({
            statusCode: 500,
            statusMessage: 'Server configuration error',
        })
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as {
            userId: number
            role: string
        }

        // Guardamos el usuario en el contexto de Nitro
        event.context.user = {
            id: payload.userId,
            role: payload.role,
        }

        return event.context.user
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired token',
        })
    }
}
