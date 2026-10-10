-- Migración Idempotente y Segura para Facturación Electrónica (ARCA / AFIP)
-- Compatible con registros existentes en PostgreSQL / Supabase sin pérdida de datos.

-- 1. Campos adicionales en tabla "customers" (Clientes)
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "tax_id" varchar(20);
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "iva_condition" varchar(50) DEFAULT 'Consumidor Final';
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "fiscal_address" text;

-- 2. Campos adicionales en tabla "sales" (Ventas)
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "invoice_type" integer DEFAULT 99;
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "point_of_sale" integer DEFAULT 1;
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "invoice_number" bigint;
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "customer_iva_condition" varchar(50);
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "doc_type" integer;
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "doc_number" varchar(20);
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "net_amount" numeric(12, 2);
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "vat_amount" numeric(12, 2);
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "cae" varchar(20);
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "cae_expiration" date;
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "billing_status" varchar(20) DEFAULT 'unbilled';

-- 3. Índices recomendados para optimización de consultas de facturación
CREATE INDEX IF NOT EXISTS "sales_cae_idx" ON "sales" ("cae");
CREATE INDEX IF NOT EXISTS "sales_invoice_lookup_idx" ON "sales" ("point_of_sale", "invoice_type", "invoice_number");
