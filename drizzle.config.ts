
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

export default defineConfig({
  dialect: "mysql",
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});