import { mysqlTable, mysqlSchema, varchar, mediumtext, int, unique, timestamp, index, text, longtext, date, decimal, foreignKey, time, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"
//import { mysqlTable, mysqlSchema, varchar, mediumtext, int, unique, timestamp, index, text, longtext, date, decimal, foreignKey, time, tinyint } from "drizzle-orm/mysql-core";
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core";


export const cache = mysqlTable("cache", {
	key: varchar({ length: 255 }).notNull(),
	value: mediumtext().notNull(),
	expiration: int().notNull(),
});

export const cacheLocks = mysqlTable("cache_locks", {
	key: varchar({ length: 255 }).notNull(),
	owner: varchar({ length: 255 }).notNull(),
	expiration: int().notNull(),
});

export const customers = mysqlTable("customers", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).default('NULL'),
	address: varchar({ length: 255 }).default('NULL'),
	email: varchar({ length: 255 }).default('NULL'),
	phone: varchar({ length: 255 }).default('NULL'),
	isRegular: tinyint("is_regular").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		unique("customers_email_unique").on(table.email),
	]);

export const embazadoRecords = mysqlTable("embazado_records", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	productId: int("product_id").notNull(),
	quantity: int().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("embazado_records_user_id_foreign").on(table.userId),
		index("embazado_records_product_id_foreign").on(table.id),
	]);

export const failedJobs = mysqlTable("failed_jobs", {
	id: int().autoincrement().notNull(),
	uuid: varchar({ length: 255 }).notNull(),
	connection: text().notNull(),
	queue: text().notNull(),
	payload: longtext().notNull(),
	exception: longtext().notNull(),
	failedAt: timestamp("failed_at", { mode: 'string' }).default('current_timestamp()').notNull(),
},
	(table) => [
		unique("failed_jobs_uuid_unique").on(table.uuid),
	]);

export const invoices = mysqlTable("invoices", {
	id: int().autoincrement().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	supplierId: int("supplier_id").notNull(),
	invoiceNumber: varchar("invoice_number", { length: 255 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	issueDate: date("issue_date", { mode: 'string' }).notNull(),
	totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
	status: varchar({ length: 255 }).default('\'pending\'').notNull(),
},
	(table) => [
		index("invoices_supplier_id_foreign").on(table.supplierId),
		unique("invoices_invoice_number_unique").on(table.invoiceNumber),
	]);

export const jobs = mysqlTable("jobs", {
	id: int().autoincrement().notNull(),
	queue: varchar({ length: 255 }).notNull(),
	payload: longtext().notNull(),
	attempts: tinyint().notNull(),
	reservedAt: int("reserved_at").default(0),
	availableAt: int("available_at").notNull(),
	createdAt: int("created_at").notNull(),
},
	(table) => [
		index("jobs_queue_index").on(table.queue),
	]);

export const jobBatches = mysqlTable("job_batches", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	totalJobs: int("total_jobs").notNull(),
	pendingJobs: int("pending_jobs").notNull(),
	failedJobs: int("failed_jobs").notNull(),
	failedJobIds: longtext("failed_job_ids").notNull(),
	options: mediumtext().default('NULL'),
	cancelledAt: int("cancelled_at").default(0),
	createdAt: int("created_at").notNull(),
	finishedAt: int("finished_at").default(0),
});

export const migrations = mysqlTable("migrations", {
	id: int().autoincrement().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	batch: int().notNull(),
});

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
	email: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
});

export const personalAccessTokens = mysqlTable("personal_access_tokens", {
	id: int().autoincrement().notNull(),
	tokenableType: varchar("tokenable_type", { length: 255 }).notNull(),
	tokenableId: int("tokenable_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 64 }).notNull(),
	abilities: text().default('NULL'),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }).default('NULL'),
	expiresAt: timestamp("expires_at", { mode: 'string' }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("personal_access_tokens_tokenable_type_tokenable_id_index").on(table.tokenableType, table.tokenableId),
		unique("personal_access_tokens_token_unique").on(table.token),
	]);

export const plantPotPrices = mysqlTable("plant_pot_prices", {
	id: int().autoincrement().notNull(),
	productId: int("product_id").notNull(),
	potSize: varchar("pot_size", { length: 255 }).notNull(),
	price: decimal({ precision: 8, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("plant_pot_prices_product_id_foreign").on(table.productId),
	]);

export const products = mysqlTable("products", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 255 }).notNull(),
	description: text().default('NULL'),
	imageUrl: varchar("image_url", { length: 255 }).default('NULL'),
	precioVenta: decimal("precio_venta", { precision: 10, scale: 2 }).notNull(),
	stock: int().default(0).notNull(),
	potSize: varchar("pot_size", { length: 255 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	precioCompra: decimal("precio_compra", { precision: 10, scale: 2 }).default('0.00').notNull(),
	publicado: tinyint().default(1).notNull(),
	sku: varchar({ length: 50 }).default('NULL'),
},
	(table) => [
		unique("products_sku_unique").on(table.sku),
	]);

export const purchases = mysqlTable("purchases", {
	id: int().autoincrement().notNull(),
	supplierId: int("supplier_id").notNull(),
	quantity: int().notNull(),
	purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	purchaseDate: date("purchase_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	invoiceId: int("invoice_id").default(0),
},
	(table) => [
		index("purchases_supplier_id_foreign").on(table.supplierId),
		index("purchases_invoice_id_foreign").on(table.invoiceId),
	]);

export const rewards = mysqlTable("rewards", {
	id: int().autoincrement().notNull(),
	customerId: int("customer_id").notNull(),
	rewardType: varchar("reward_type", { length: 255 }).notNull(),
	rewardValue: decimal("reward_value", { precision: 8, scale: 2 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	weekStartDate: date("week_start_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("rewards_customer_id_foreign").on(table.customerId),
	]);

export const sales = mysqlTable("sales", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
	customerId: int("customer_id").default(0).references(() => customers.id, { onDelete: "set null", onUpdate: "cascade" }),
	customer: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).default('NULL'),
	seller: varchar({ length: 255 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	date: date({ mode: 'string' }).notNull(),
	time: time().default('NULL'),
	status: varchar({ length: 255 }).default('\'Pendiente\'').notNull(),
	totalPrice: decimal("total_price", { precision: 10, scale: 2 }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("sales_user_id_foreign").on(table.userId),
		index("sales_customer_id_foreign").on(table.customerId),
	]);

export const saleItems = mysqlTable("sale_items", {
	id: int().autoincrement().notNull(),
	saleId: int("sale_id").notNull().references(() => sales.id, { onDelete: "cascade", onUpdate: "cascade" }),
	productId: int("product_id").notNull().references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
	quantity: int().notNull(),
	unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
	subtotal: decimal({ precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("sale_items_sale_id_foreign").on(table.saleId),
		index("sale_items_product_id_foreign").on(table.productId),
	]);

export const sessions = mysqlTable("sessions", {
	id: varchar({ length: 255 }).notNull(),
	userId: int("user_id").default(0),
	ipAddress: varchar("ip_address", { length: 45 }).default('NULL'),
	userAgent: text("user_agent").default('NULL'),
	payload: longtext().notNull(),
	lastActivity: int("last_activity").notNull(),
},
	(table) => [
		index("sessions_user_id_index").on(table.userId),
		index("sessions_last_activity_index").on(table.lastActivity),
	]);

export const suppliers = mysqlTable("suppliers", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	phone: varchar({ length: 255 }).default('NULL'),
	address: varchar({ length: 255 }).default('NULL'),
	companyName: varchar("company_name", { length: 255 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const supplierPrices = mysqlTable("supplier_prices", {
	id: int().autoincrement().notNull(),
	productId: int("product_id").notNull(),
	supplierId: int("supplier_id").notNull(),
	purchasePrice: decimal("purchase_price", { precision: 8, scale: 2 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	validFrom: date("valid_from", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	validTo: date("valid_to", { mode: 'string' }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		index("supplier_prices_product_id_foreign").on(table.productId),
		index("supplier_prices_supplier_id_foreign").on(table.supplierId),
	]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }).default('NULL'),
	password: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 255 }).default('\'operario\'').notNull(),
	rememberToken: varchar("remember_token", { length: 100 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
	(table) => [
		unique("users_email_unique").on(table.email),
	]);
