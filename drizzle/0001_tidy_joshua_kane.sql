CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) DEFAULT 'info',
	`is_read` tinyint NOT NULL DEFAULT 0,
	`link` varchar(255) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reseller_order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reseller_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total` decimal(10,2) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending_payment',
	`payment_proof_url` varchar(255) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
ALTER TABLE `sales` DROP FOREIGN KEY `sales_customer_id_fkey`;
--> statement-breakpoint
ALTER TABLE `sales` DROP FOREIGN KEY `sales_user_id_fkey`;
--> statement-breakpoint
ALTER TABLE `sale_items` DROP FOREIGN KEY `sale_items_product_id_fkey`;
--> statement-breakpoint
ALTER TABLE `sale_items` DROP FOREIGN KEY `sale_items_sale_id_fkey`;
--> statement-breakpoint
ALTER TABLE `cache` MODIFY COLUMN `expiration` int NOT NULL;--> statement-breakpoint
ALTER TABLE `cache_locks` MODIFY COLUMN `expiration` int NOT NULL;--> statement-breakpoint
ALTER TABLE `customers` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `customers` MODIFY COLUMN `is_regular` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `embazado_records` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `embazado_records` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `embazado_records` MODIFY COLUMN `product_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `embazado_records` MODIFY COLUMN `quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `failed_jobs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `supplier_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `attempts` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `reserved_at` int;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `reserved_at` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `available_at` int NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `created_at` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `total_jobs` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `pending_jobs` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `failed_jobs` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `cancelled_at` int;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `cancelled_at` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `created_at` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `finished_at` int;--> statement-breakpoint
ALTER TABLE `job_batches` MODIFY COLUMN `finished_at` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `migrations` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `migrations` MODIFY COLUMN `batch` int NOT NULL;--> statement-breakpoint
ALTER TABLE `personal_access_tokens` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `personal_access_tokens` MODIFY COLUMN `tokenable_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `personal_access_tokens` MODIFY COLUMN `abilities` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `plant_pot_prices` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `plant_pot_prices` MODIFY COLUMN `product_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `stock` int NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `publicado` tinyint NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `purchases` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` MODIFY COLUMN `supplier_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` MODIFY COLUMN `quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` MODIFY COLUMN `invoice_id` int;--> statement-breakpoint
ALTER TABLE `purchases` MODIFY COLUMN `invoice_id` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `rewards` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `rewards` MODIFY COLUMN `customer_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sales` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `sales` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sales` MODIFY COLUMN `customer_id` int;--> statement-breakpoint
ALTER TABLE `sales` MODIFY COLUMN `customer_id` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `sale_items` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `sale_items` MODIFY COLUMN `sale_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sale_items` MODIFY COLUMN `product_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sale_items` MODIFY COLUMN `quantity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `user_id` int;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `user_id` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `user_agent` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `last_activity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `suppliers` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `supplier_prices` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `supplier_prices` MODIFY COLUMN `product_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `supplier_prices` MODIFY COLUMN `supplier_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `precio_cantidad` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `stock_minimo` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `points` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reseller_order_items` ADD CONSTRAINT `reseller_order_items_order_id_reseller_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `reseller_orders`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `reseller_order_items` ADD CONSTRAINT `reseller_order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `reseller_orders` ADD CONSTRAINT `reseller_orders_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `notifications_user_id_index` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `reseller_order_items_order_id_foreign` ON `reseller_order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `reseller_order_items_product_id_foreign` ON `reseller_order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `reseller_orders_user_id_foreign` ON `reseller_orders` (`user_id`);--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_sale_id_sales_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE cascade;