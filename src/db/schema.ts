// schema/index.ts
import { mysqlTable, int, varchar, decimal, boolean, timestamp, serial, mysqlEnum, datetime, date, time, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Tabla: users
export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: mysqlEnum('role', ['admin','encargado','operario', 'user']).default('user'),
    createdAt: datetime('created_at').notNull().default(new Date()),
  }
);

// Tabla: products
export const products = mysqlTable(
  'products',
  {
    id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  description: varchar('description', { length: 500 }),
  precio_compra: decimal('precio_compra', { precision: 10, scale: 2 }).notNull().default('0.00'),
  precio_venta: decimal('precio_venta', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').notNull(),
  pot_size: varchar('pot_size', { length: 50 }),
  image_url: varchar('image_url', { length: 255 }),
  publicado: boolean('publicado').notNull().default(true),
  sku: varchar('sku', { length: 50 }).unique(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  }
);

// Tabla: customers
export const customers = mysqlTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  address: varchar('address', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
});

// Tabla: sales
export const sales = mysqlTable('sales', {
  id: serial('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  customerId: int('customer_id').references(() => customers.id, { onDelete: 'set null' }),
  //customer:varchar('name').references(() => customers.name), 
  customer: varchar('customer', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  seller: varchar('seller', { length: 255 }).notNull(),
  date: date('date').notNull(),  // @db.Date -> date
  time: time('time'),  // @db.Time(0) -> time
  status: varchar('status', { length: 255 }).notNull().default('Pendiente'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull().default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Index definitions for sales table
export const salesCustomerIdIdx = index('sales_customer_id_foreign').on(sales.customerId);
export const salesUserIdIdx = index('sales_user_id_foreign').on(sales.userId);

export const plantPotPrices = mysqlTable('plant_pot_prices', {
  id: serial('id').primaryKey(),
  product_id: int('product_id').references(() => products.id).notNull(),
  pot_size: varchar('pot_size', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Precio de venta
});

export const suppliers = mysqlTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const supplierPrices = mysqlTable('supplier_prices', {
  id: serial('id').primaryKey(),
  product_id: int('product_id').references(() => products.id).notNull(),
  supplier_id: int('supplier_id').references(() => suppliers.id).notNull(),
  purchase_price: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  valid_from: datetime('valid_from'),
  valid_to: datetime('valid_to'),
});

export const purchases = mysqlTable('purchases', {
  id: serial('id').primaryKey(),
  product_id: int('product_id').references(() => products.id).notNull(),
  supplier_id: int('supplier_id').references(() => suppliers.id).notNull(),
  quantity: int('quantity').notNull(),
  purchase_price: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  purchase_date: datetime('purchase_date').notNull(),
});

export const sale_items = mysqlTable('sale_items', {
  id: serial('id').primaryKey(),
  sale_id: int('sale_id').references(() => sales.id).notNull(),
  product_id: int('product_id').references(() => products.id).notNull(),
  quantity: int('quantity').notNull(),
  unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
});

// Definir relaciones
// export const usersRelations = relations(users, ({ many }) => ({
//   sales: many(sales),
// }));

// export const customersRelations = relations(customers, ({ many }) => ({
//   sales: many(sales),
// }));

// export const salesRelations = relations(sales, ({ one }) => ({
//   customer: one(customers, {
//     fields: [sales.customerId],
//     references: [customers.id],
//   }),
//   user: one(users, {
//     fields: [sales.userId],
//     references: [users.id],
//   }),
// }));