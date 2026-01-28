// server/api/sales/[id].delete.ts
import { defineEventHandler, H3Event, createError } from 'h3';
import * as salesApplications from '~/server/applications/salesApplications';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Validar token JWT
    const authHeader = event.node.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autenticación faltante o inválido',
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };

    // Validar permisos (solo admin)
    if (decoded.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para eliminar ventas',
      });
    }

    return await salesApplications.eliminar(event);
  } catch (error: any) {
    // If it's already an H3 error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    // Otherwise wrap it
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor',
    });
  }
});