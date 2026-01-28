// server/middleware/auth.ts
// import { db } from '~/server/utils/drizzle';
// import { users } from '~/src/db/schema';
// import { eq } from 'drizzle-orm';
import { db } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  // const headers = getRequestHeaders(event);
  // const authHeader = headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'No token provided',
  //   });
  // }

  // const token = authHeader.split(' ')[1];
  // const jwtSecret = process.env.JWT_SECRET;
  // if (!jwtSecret) {
  //   throw createError({
  //     statusCode: 500,
  //     statusMessage: 'JWT secret is not defined in environment variables',
  //   });
  // }
  // try {
  //   const payload = jwt.verify(token, jwtSecret) as unknown as { userId: number, role: string };
  //   if (!['admin', 'encargado'].includes(payload.role)) {
  //     throw createError({
  //       statusCode: 403,
  //       statusMessage: 'Access denied. Requires admin or encargado role',
  //     });
  //   }

  //   const [user] = await db
  //     .select({ id: users.id })
  //     .from(users)
  //     .where(eq(users.id, payload.userId))
  //     .limit(1);

  //   if (!user) {
  //     throw createError({
  //       statusCode: 401,
  //       statusMessage: 'User not found',
  //     });
  //   }

  //   // Agregar el usuario al contexto del evento para uso posterior
  //   event.context.user = payload;
  // } catch (error) {
  //   console.error('Error verifying token:', error);
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Invalid or expired token',
  //   });
  //}
});