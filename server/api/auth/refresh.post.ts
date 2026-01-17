import { db } from '~/server/utils/drizzle';
import { users } from '~/src/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { H3Event } from 'h3';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
    const refreshToken = getCookie(event, 'refresh_token');

    if (!refreshToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Refresh token no proporcionado',
        });
    }

    try {
        // Verificar el Refresh Token
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: number; type: string };

        if (decoded.type !== 'refresh') {
            throw createError({ statusCode: 401, statusMessage: 'Token inválido' });
        }

        // Verificar que el usuario sigue existiendo
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
            })
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);

        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Usuario no encontrado',
            });
        }

        // Generar nuevo Access Token (15 minutos)
        const newAccessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role, type: 'access' },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Actualizar cookie de Access Token
        setCookie(event, 'token', newAccessToken, {
            httpOnly: false,
            path: '/',
            maxAge: 15 * 60, // 15 minutos
        });

        return {
            token: newAccessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        };

    } catch (error) {
        // Si el refresh token es inválido, limpiar cookies
        deleteCookie(event, 'refresh_token');
        deleteCookie(event, 'token');

        throw createError({
            statusCode: 401,
            statusMessage: 'Sesión expirada, por favor inicie sesión nuevamente',
        });
    }
});
