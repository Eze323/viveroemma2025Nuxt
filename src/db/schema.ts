// src/db/schema.ts
import {
  pgTable,
  serial,
  integer,
  varchar,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  date,
  time,
  index,
  text,
  bigint,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum: role
export const roleEnum = pgEnum('role', ['admin', 'encargado', 'operario', 'user']);

// Tabla: users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Tabla: products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  description: varchar('description', { length: 500 }),
  precio_compra: decimal('precio_compra', { precision: 10, scale: 2 }).notNull().default('0.00'),
  precio_venta: decimal('precio_venta', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  pot_size: varchar('pot_size', { length: 50 }),
  image_url: varchar('image_url', { length: 255 }),
  publicado: boolean('publicado').notNull().default(true),
  sku: varchar('sku', { length: 50 }).unique(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// Tabla: customers
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  address: varchar('address', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  // Campos para Facturación Electrónica (ARCA / AFIP)
  taxId: varchar('tax_id', { length: 20 }),
  ivaCondition: varchar('iva_condition', { length: 50 }).default('Consumidor Final'),
  fiscalAddress: text('fiscal_address'),
});

// Tabla: sales
export const sales = pgTable(
  'sales',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    customer: varchar('customer', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    seller: varchar('seller', { length: 255 }).notNull(),
    date: date('date').notNull(),
    time: time('time'),
    status: varchar('status', { length: 255 }).notNull().default('Pendiente'),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull().default('0.00'),

    // Campos para Facturación Electrónica (ARCA / AFIP)
    invoiceType: integer('invoice_type').default(99), // 1=Factura A, 6=Factura B, 11=Factura C, 99=Ticket/Presupuesto
    pointOfSale: integer('point_of_sale').default(1),
    invoiceNumber: bigint('invoice_number', { mode: 'number' }),
    customerIvaCondition: varchar('customer_iva_condition', { length: 50 }),
    docType: integer('doc_type'), // 96=DNI, 80=CUIT, 99=Consumidor Final
    docNumber: varchar('doc_number', { length: 20 }),
    netAmount: decimal('net_amount', { precision: 12, scale: 2 }),
    vatAmount: decimal('vat_amount', { precision: 12, scale: 2 }),
    cae: varchar('cae', { length: 20 }),
    caeExpiration: date('cae_expiration'),
    billingStatus: varchar('billing_status', { length: 20 }).default('unbilled'), // 'unbilled', 'pending', 'billed', 'error'

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('sales_customer_id_foreign').on(table.customerId),
    index('sales_user_id_foreign').on(table.userId),
  ]
);

// Tabla: plant_pot_prices
export const plantPotPrices = pgTable('plant_pot_prices', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  pot_size: varchar('pot_size', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Precio de venta
});

// Tabla: suppliers
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

// Tabla: supplier_prices
export const supplierPrices = pgTable('supplier_prices', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  supplier_id: integer('supplier_id').references(() => suppliers.id).notNull(),
  purchase_price: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  valid_from: timestamp('valid_from'),
  valid_to: timestamp('valid_to'),
});

// Tabla: purchases
export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  supplier_id: integer('supplier_id').references(() => suppliers.id).notNull(),
  quantity: integer('quantity').notNull(),
  purchase_price: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  purchase_date: timestamp('purchase_date').notNull(),
});

// Tabla: sale_items
export const sale_items = pgTable('sale_items', {
  id: serial('id').primaryKey(),
  sale_id: integer('sale_id').references(() => sales.id).notNull(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
});

// Inferred TypeScript Types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;
export type SaleItem = typeof sale_items.$inferSelect;
export type NewSaleItem = typeof sale_items.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;