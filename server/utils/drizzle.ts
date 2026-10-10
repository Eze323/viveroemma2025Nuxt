// server/utils/drizzle.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '~/src/db/schema';

// Helper para obtener la URL de conexión de base de datos
// Soporta runtimeConfig y fallback a process.env para compatibilidad con CLI y tests
function getDatabaseUrl(): string {
  try {
    const config = useRuntimeConfig();
    return (config.dbBaseURL as string) || process.env.DATABASE_URL || '';
  } catch {
    return process.env.DATABASE_URL || '';
  }
}

const connectionString = getDatabaseUrl();

// Cliente Postgres.js optimizado para Supabase (PgBouncer pooler en puerto 6543)
// `prepare: false` es obligatorio cuando se conecta a través del Transaction Pooler
export const client = postgres(connectionString, {
  prepare: false,
});

// Inicializar Drizzle con el driver postgres-js y el esquema de PostgreSQL
export const db = drizzle(client, { schema });

// Exportar tablas
export const tables = schema;

// Tipos inferidos
export type Product = typeof schema.products.$inferSelect;
export type PlantPotPrice = typeof schema.plantPotPrices.$inferSelect;
export type User = typeof schema.users.$inferSelect;
export type Sale = typeof schema.sales.$inferSelect;
export type SaleItem = typeof schema.sale_items.$inferSelect;

// Composable / Helper para endpoints de Nitro
export function useDrizzle() {
  return db;
}