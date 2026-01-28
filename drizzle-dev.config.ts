// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { useRuntimeConfig } from 'nuxt/app';
const config = useRuntimeConfig();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    host: config.public.dbHost as string,
    port: Number(config.public.dbPort),
    database: config.public.dbDatabase as string,
    user: config.public.dbUsername as string,
    password: config.public.dbPassword as string,
  },
  verbose: true,
  strict: true


})