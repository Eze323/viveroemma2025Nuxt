import { relations } from "drizzle-orm/relations";
import { customers, sales, users, products, saleItems } from "./schema";

export const salesRelations = relations(sales, ({one, many}) => ({
	customer: one(customers, {
		fields: [sales.customerId],
		references: [customers.id]
	}),
	user: one(users, {
		fields: [sales.userId],
		references: [users.id]
	}),
	saleItems: many(saleItems),
}));

export const customersRelations = relations(customers, ({many}) => ({
	sales: many(sales),
}));

export const usersRelations = relations(users, ({many}) => ({
	sales: many(sales),
}));

export const saleItemsRelations = relations(saleItems, ({one}) => ({
	product: one(products, {
		fields: [saleItems.productId],
		references: [products.id]
	}),
	sale: one(sales, {
		fields: [saleItems.saleId],
		references: [sales.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	saleItems: many(saleItems),
}));