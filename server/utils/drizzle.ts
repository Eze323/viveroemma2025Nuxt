// import { drizzle } from 'drizzle-orm/mysql2';
// import mysql from 'mysql2/promise';
// import * as schema from '../db/schema';
// import * as relations from '../db/relations';

// // Create a connection pool (better for performance)
// const connectionPool = mysql.createPool(process.env.DATABASE_URL!);

// export const db = drizzle(connectionPool, {
//   schema: { ...schema, ...relations },
//   mode: "default"
// });

// // Exportar tablas
// export const tables = schema;

// // Tipos inferidos
// export type Product = typeof schema.products.$inferSelect;
// export type PlantPotPrice = typeof schema.plantPotPrices.$inferSelect;
// export type User = typeof schema.users.$inferSelect;
// export type Sale = typeof schema.sales.$inferSelect;
// export type SaleItem = typeof schema.saleItems.$inferSelect;

// // Composable para endpoints
// export function useDrizzle() {
//   return db;
// }

import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../db/schema';
import * as relations from '../db/relations';

// Definimos el tipo de nuestra base de datos para Typescript
type DbClient = MySql2Database<typeof schema & typeof relations>;

// Usamos una variable global para persistir la conexión entre recargas de Nuxt (HMR)
// Usamos globalThis para mantener la conexión viva durante recargas en desarrollo (HMR)
// Esto evita el error "Too many connections" y "ECONNRESET"
const globalState = globalThis as unknown as {
  _mysqlPool: mysql.Pool | undefined;
  _drizzle: DbClient | undefined;
};

export const useDrizzle = () => {
  if (globalState._drizzle) return globalState._drizzle;

  if (!globalState._mysqlPool) {
    globalState._mysqlPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      // Límites estrictos para evitar saturar el servidor (especialmente Hostinger)
      connectionLimit: 5,
      maxIdle: 2,
      idleTimeout: 15000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  globalState._drizzle = drizzle(globalState._mysqlPool, {
    schema: { ...schema, ...relations },
    mode: "default"
  });

  return globalState._drizzle;
};

// Exportamos las tablas para usarlas fácilmente
export const tables = schema;
export const db = useDrizzle();

// Tipos inferidos (se mantienen igual)
export type Product = typeof schema.products.$inferSelect;
export type PlantPotPrice = typeof schema.plantPotPrices.$inferSelect;
export type User = typeof schema.users.$inferSelect;
export type Sale = typeof schema.sales.$inferSelect;
export type SaleItem = typeof schema.saleItems.$inferSelect;