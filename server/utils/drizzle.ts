import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../db/schema';
import * as relations from '../db/relations';

// Create a connection pool (better for performance)
const connectionPool = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle(connectionPool, {
  schema: { ...schema, ...relations },
  mode: "default"
});

// Exportar tablas
export const tables = schema;

// Tipos inferidos
export type Product = typeof schema.products.$inferSelect;
export type PlantPotPrice = typeof schema.plantPotPrices.$inferSelect;
export type User = typeof schema.users.$inferSelect;
export type Sale = typeof schema.sales.$inferSelect;
export type SaleItem = typeof schema.saleItems.$inferSelect;

// Composable para endpoints
export function useDrizzle() {
  return db;
}