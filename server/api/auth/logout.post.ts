// server/api/auth/logout.post.ts
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  try {
    // En JWT, el logout se maneja en el cliente eliminando el token
    // Opcionalmente, puedes implementar una lista negra de tokens en el servidor
    return { message: 'Sesión cerrada' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al cerrar sesión',
    });
  }
});