// drizzle-dev.config.ts
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});