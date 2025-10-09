// server/api/auth/user.get.ts
import { db } from '~/server/utils/drizzle';
import { users } from '~/src/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { H3Event } from 'h3';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
    const authHeader = getHeader(event, 'Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token no proporcionado',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

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

    return user;
  } catch (error) {
    const err = error as { name?: string };
    throw createError({
      statusCode: err.name === 'JsonWebTokenError' ? 401 : 500,
      statusMessage: err.name === 'JsonWebTokenError' ? 'Token inválido' : 'Error en el servidor',
    });
  }
});