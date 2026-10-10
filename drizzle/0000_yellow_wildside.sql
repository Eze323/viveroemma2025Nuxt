CREATE TYPE "public"."role" AS ENUM('admin', 'encargado', 'operario', 'user');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"address" varchar(500),
	"phone" varchar(20),
	"tax_id" varchar(20),
	"iva_condition" varchar(50) DEFAULT 'Consumidor Final',
	"fiscal_address" text,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "plant_pot_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"pot_size" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" varchar(500),
	"precio_compra" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"precio_venta" numeric(10, 2) NOT NULL,
	"stock" integer NOT NULL,
	"pot_size" varchar(50),
	"image_url" varchar(255),
	"publicado" boolean DEFAULT true NOT NULL,
	"sku" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"purchase_price" numeric(10, 2) NOT NULL,
	"purchase_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sale_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"customer_id" integer,
	"customer" varchar(255) NOT NULL,
	"email" varchar(255),
	"seller" varchar(255) NOT NULL,
	"date" date NOT NULL,
	"time" time,
	"status" varchar(255) DEFAULT 'Pendiente' NOT NULL,
	"total_price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"invoice_type" integer DEFAULT 99,
	"point_of_sale" integer DEFAULT 1,
	"invoice_number" bigint,
	"customer_iva_condition" varchar(50),
	"doc_type" integer,
	"doc_number" varchar(20),
	"net_amount" numeric(12, 2),
	"vat_amount" numeric(12, 2),
	"cae" varchar(20),
	"cae_expiration" date,
	"billing_status" varchar(20) DEFAULT 'unbilled',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"purchase_price" numeric(10, 2) NOT NULL,
	"valid_from" timestamp,
	"valid_to" timestamp
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "plant_pot_prices" ADD CONSTRAINT "plant_pot_prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_prices" ADD CONSTRAINT "supplier_prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_prices" ADD CONSTRAINT "supplier_prices_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sales_customer_id_foreign" ON "sales" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "sales_user_id_foreign" ON "sales" USING btree ("user_id");