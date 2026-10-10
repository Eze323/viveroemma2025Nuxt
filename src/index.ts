import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { users } from './db/schema';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function main() {
  try {
    const result = await db.select().from(users).where(eq(users.id, 1));
    console.log('Consulta exitosa:', result);
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
  } finally {
    await client.end();
  }
}

if (process.env.NODE_ENV !== 'test') {
  main();
}