

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { useRuntimeConfig } from 'nuxt/app';
const config = useRuntimeConfig();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out:"./drizzle",
  dbCredentials:{
             host: config.public.dbHost,
     port: Number(config.public.dbPort),
     database: config.public.dbDatabase,
     user: config.public.dbUsername,
     password: config.public.dbPassword,
  },

  })