// server/api/auth/user.get.ts


import { eq } from 'drizzle-orm';


import { PrismaClient } from '@prisma/client';
import { createError, defineEventHandler, H3Event } from 'h3';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

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