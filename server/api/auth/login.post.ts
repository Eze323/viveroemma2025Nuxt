// server/api/auth/login.post.ts
import { db } from '~/server/utils/drizzle';
import { users } from '~/src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { H3Event } from 'h3';

// Clave secreta para JWT (guárdala en .env en producción)
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan email o contraseña',
      });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  }
});