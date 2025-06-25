// server/utils/db.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '~/src/db/schema';
import { sql, eq, and, or } from 'drizzle-orm';

// Configuración de la conexión a MySQL
const connectionConfig = {
  uri: process.env.DATABASE_URL , // Usar la URL de la base de datos
};



// Crear un pool de conexiones
const pool = mysql.createPool({
  ...connectionConfig,
  connectionLimit: 10,
});

// Inicializar Drizzle
export const db = drizzle(pool, { schema, mode: 'default' });

// Exportar utilidades de Drizzle
export { sql, eq, and, or };

// Exportar tablas
export const tables = schema;

// Tipos inferidos
export type Product = typeof schema.products.$inferSelect;
export type PlantPotPrice = typeof schema.plantPotPrices.$inferSelect;
export type User = typeof schema.users.$inferSelect;
// Composable para endpoints
export function useDrizzle() {
  return db;
}