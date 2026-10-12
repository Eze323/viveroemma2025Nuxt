import 'dotenv/config'
import postgres from 'postgres'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Falta configurar DIRECT_URL o DATABASE_URL.')
}

const sql = postgres(connectionString, { prepare: false })

const statements = [
  'ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "tax_id" varchar(20)',
  'ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "iva_condition" varchar(50) DEFAULT \'Consumidor Final\'',
  'ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "fiscal_address" text',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "invoice_type" integer DEFAULT 99',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "point_of_sale" integer DEFAULT 1',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "invoice_number" bigint',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "customer_iva_condition" varchar(50)',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "doc_type" integer',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "doc_number" varchar(20)',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "net_amount" numeric(12, 2)',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "vat_amount" numeric(12, 2)',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "cae" varchar(20)',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "cae_expiration" date',
  'ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "billing_status" varchar(20) DEFAULT \'unbilled\'',
]

try {
  await sql.begin(async (transaction) => {
    for (const statement of statements) {
      await transaction.unsafe(statement)
    }
  })
  console.info('Esquema de ventas actualizado correctamente.')
} finally {
  await sql.end()
}