// // server/api/auth/login.post.ts
// import { db } from '~/server/utils/drizzle';
// import { users } from '~/src/db/schema';
// import { eq } from 'drizzle-orm';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { H3Event } from 'h3';

// // Interfaz para el cuerpo de la solicitud
// interface LoginBody {
//   email: string;
//   password: string;
// }

// // Validar JWT_SECRET
// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET no está definido en las variables de entorno');
// }
// const JWT_SECRET = process.env.JWT_SECRET;

// export default defineEventHandler(async (event: H3Event) => {
//   try {
//     // Leer y tipar el cuerpo de la solicitud
//     const body = await readBody<LoginBody>(event);
//     const { email, password } = body;

//     // Validar entrada
//     if (!email || !password) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Faltan email o contraseña',
//       });
//     }

//     // Buscar usuario en la base de datos
//     const [user] = await db
//       .select({
//         id: users.id,
//         name: users.name,
//         email: users.email,
//         password: users.password,
//         role: users.role,
//       })
//       .from(users)
//       .where(eq(users.email, email))
//       .limit(1);

//     if (!user) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Credenciales inválidas',
//       });
//     }

//     // Verificar contraseña
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Credenciales inválidas',
//       });
//     }

//     // Generar token JWT
//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     return {
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     };
//   } catch (error) {
//     console.error('Error en /api/auth/login:', error);
//     const err = error as { statusCode?: number; statusMessage?: string };
//     throw createError({
//       statusCode: err.statusCode || 500,
//       statusMessage: err.statusMessage || 'Error en el servidor',
//     });
//   }
// });

// server/api/auth/login.post.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createError, defineEventHandler, readBody, H3Event } from 'h3';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Interface for request body
interface LoginBody {
  email: string;
  password: string;
}

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read and type request body
    const body = await readBody<LoginBody>(event);
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan email o contraseña',
      });
    }

    // Find user in database
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas',
      });
    }

    // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email, role: user.role },
    //   JWT_SECRET,
    //   { expiresIn: '1h' }
    // );
    const token = jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{
      algorithm: 'HS256',
      expiresIn: '1h',
    })
console.log('Generated JWT Token:', token);
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
    console.error('Error en /api/auth/login:', error);
    const err = error as { statusCode?: number; statusMessage?: string };
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error en el servidor',
    });
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
});