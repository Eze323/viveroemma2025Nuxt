// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
  // Agregamos 'plant_pot_prices' y el resto de tablas del sistema
  tablesFilter: [
    'users',
    'customers',
    'sales',
    'sale_items',
    'products',
    'categories',
    'plant_pot_prices'
  ],
});