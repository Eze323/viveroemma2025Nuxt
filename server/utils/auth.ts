import { H3Event, createError, getRequestHeaders } from 'h3';
import jwt from 'jsonwebtoken';

export async function requireAuth(event: H3Event) {
    const headers = getRequestHeaders(event);
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
            statusCode: 401,
            statusMessage: 'No token provided',
        });
    }

    const token = authHeader.split(' ')[1];
    const config = useRuntimeConfig();
    const jwtSecret = config.jwtSecret || process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error('JWT_SECRET missing in runtime config');
        throw createError({
            statusCode: 500,
            statusMessage: 'Server configuration error',
        });
    }

    try {
        const payload = jwt.verify(token, jwtSecret as string) as { userId: number, role: string };
        event.context.user = payload;
        return payload;
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired token',
        });
    }
}
