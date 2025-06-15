import {drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { users } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
   try {
      // Realizar una consulta simple a la tabla 'users'
      const result = await db.select().from(users).where(eq(users.id, 1));
      console.log('Consulta exitosa:', result);
   } catch (error) {
      console.error('Error al realizar la consulta:', error);
   }
}