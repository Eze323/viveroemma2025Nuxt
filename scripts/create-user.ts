// script/create-user.ts
import { db } from '~/server/utils/drizzle';
import { users } from '~/src/db/schema';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  try {
    // Hashear la contraseña con bcrypt (similar a Hash::make en Laravel)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insertar el usuario administrador en la tabla users
    await db.insert(users).values({
      name: 'Ezequiel',
      email: 'administrador@vivero.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });
    //crear 3 usuario admin, encargado y operario
    await db.insert(users).values({
      name: 'Encargado',
      email: 'r',
      password: hashedPassword,
      role: 'encargado',
      createdAt: new Date(),
    });

    console.log('Usuario administrador creado exitosamente');
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await db.$client.end();
  }
}

createAdminUser();