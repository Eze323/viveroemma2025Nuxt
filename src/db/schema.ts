// schema/index.ts
import { mysqlTable, serial, varchar, int, decimal, datetime, index, unique, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Tabla: users
export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: mysqlEnum('role', ['admin', 'user']).default('user'),
    createdAt: datetime('created_at').notNull().default(new Date()),
  }
);

// Tabla: products
export const products = mysqlTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 500 }),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stock: int('stock').notNull().default(0),
  }
);

// Tabla: customers
export const customers = mysqlTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }),
});

// Tabla: sales
export const sales = mysqlTable(
  'sales',
  {
    id: serial('id').primaryKey(),
    customerId: int('customer_id').notNull().references(() => customers.id),
    userId: int('user_id').notNull().references(() => users.id),
    saleDate: datetime('sale_date').notNull().default(new Date()),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  }
);

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