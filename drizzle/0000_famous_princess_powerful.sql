-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `cache` (
	`key` varchar(255) NOT NULL,
	`value` mediumtext NOT NULL,
	`expiration` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cache_locks` (
	`key` varchar(255) NOT NULL,
	`owner` varchar(255) NOT NULL,
	`expiration` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`last_name` varchar(255) DEFAULT 'NULL',
	`address` varchar(255) DEFAULT 'NULL',
	`email` varchar(255) DEFAULT 'NULL',
	`phone` varchar(255) DEFAULT 'NULL',
	`is_regular` tinyint(1) NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `embazado_records` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`user_id` int(20) NOT NULL,
	`product_id` int(20) NOT NULL,
	`quantity` int(11) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `failed_jobs` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`connection` text NOT NULL,
	`queue` text NOT NULL,
	`payload` longtext NOT NULL,
	`exception` longtext NOT NULL,
	`failed_at` timestamp NOT NULL DEFAULT 'current_timestamp()',
	CONSTRAINT `failed_jobs_uuid_unique` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`supplier_id` int(20) NOT NULL,
	`invoice_number` varchar(255) NOT NULL,
	`issue_date` date NOT NULL,
	`total_amount` decimal(10,2) NOT NULL,
	`status` varchar(255) NOT NULL DEFAULT '''pending''',
	CONSTRAINT `invoices_invoice_number_unique` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`queue` varchar(255) NOT NULL,
	`payload` longtext NOT NULL,
	`attempts` tinyint(3) unsigned NOT NULL,
	`reserved_at` int(10) unsigned DEFAULT 'NULL',
	`available_at` int(10) unsigned NOT NULL,
	`created_at` int(10) unsigned NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_batches` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`total_jobs` int(11) NOT NULL,
	`pending_jobs` int(11) NOT NULL,
	`failed_jobs` int(11) NOT NULL,
	`failed_job_ids` longtext NOT NULL,
	`options` mediumtext DEFAULT 'NULL',
	`cancelled_at` int(11) DEFAULT 'NULL',
	`created_at` int(11) NOT NULL,
	`finished_at` int(11) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `migrations` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`migration` varchar(255) NOT NULL,
	`batch` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `personal_access_tokens` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`tokenable_type` varchar(255) NOT NULL,
	`tokenable_id` int(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`token` varchar(64) NOT NULL,
	`abilities` text DEFAULT 'NULL',
	`last_used_at` timestamp DEFAULT 'NULL',
	`expires_at` timestamp DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `personal_access_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `plant_pot_prices` (
	`id` int(20) unsigned AUTO_INCREMENT NOT NULL,
	`product_id` int(20) NOT NULL,
	`pot_size` varchar(255) NOT NULL,
	`price` decimal(8,2) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`description` text DEFAULT 'NULL',
	`image_url` varchar(255) DEFAULT 'NULL',
	`precio_venta` decimal(10,2) NOT NULL,
	`stock` int(11) NOT NULL DEFAULT 0,
	`pot_size` varchar(255) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`precio_compra` decimal(10,2) NOT NULL DEFAULT '0.00',
	`publicado` tinyint(1) NOT NULL DEFAULT 1,
	`sku` varchar(50) DEFAULT 'NULL',
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`supplier_id` int(20) NOT NULL,
	`quantity` int(11) NOT NULL,
	`purchase_price` decimal(10,2) NOT NULL,
	`purchase_date` date NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`invoice_id` int(20) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`customer_id` int(20) NOT NULL,
	`reward_type` varchar(255) NOT NULL,
	`reward_value` decimal(8,2) NOT NULL,
	`week_start_date` date NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`user_id` int(11) NOT NULL,
	`customer_id` int(11) DEFAULT 'NULL',
	`customer` varchar(255) NOT NULL,
	`email` varchar(255) DEFAULT 'NULL',
	`seller` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`time` time DEFAULT 'NULL',
	`status` varchar(255) NOT NULL DEFAULT '''Pendiente''',
	`total_price` decimal(10,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `sale_items` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`sale_id` int(11) NOT NULL,
	`product_id` int(11) NOT NULL,
	`quantity` int(11) NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(255) NOT NULL,
	`user_id` int(20) DEFAULT 'NULL',
	`ip_address` varchar(45) DEFAULT 'NULL',
	`user_agent` text DEFAULT 'NULL',
	`payload` longtext NOT NULL,
	`last_activity` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`phone` varchar(255) DEFAULT 'NULL',
	`address` varchar(255) DEFAULT 'NULL',
	`company_name` varchar(255) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `supplier_prices` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`product_id` int(20) NOT NULL,
	`supplier_id` int(20) NOT NULL,
	`purchase_price` decimal(8,2) NOT NULL,
	`valid_from` date NOT NULL,
	`valid_to` date DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified_at` timestamp DEFAULT 'NULL',
	`password` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL DEFAULT '''operario''',
	`remember_token` varchar(100) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `embazado_records_user_id_foreign` ON `embazado_records` (`user_id`);--> statement-breakpoint
CREATE INDEX `embazado_records_product_id_foreign` ON `embazado_records` (`id`);--> statement-breakpoint
CREATE INDEX `invoices_supplier_id_foreign` ON `invoices` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `jobs_queue_index` ON `jobs` (`queue`);--> statement-breakpoint
CREATE INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` ON `personal_access_tokens` (`tokenable_type`,`tokenable_id`);--> statement-breakpoint
CREATE INDEX `plant_pot_prices_product_id_foreign` ON `plant_pot_prices` (`product_id`);--> statement-breakpoint
CREATE INDEX `purchases_supplier_id_foreign` ON `purchases` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `purchases_invoice_id_foreign` ON `purchases` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `rewards_customer_id_foreign` ON `rewards` (`customer_id`);--> statement-breakpoint
CREATE INDEX `sales_user_id_foreign` ON `sales` (`user_id`);--> statement-breakpoint
CREATE INDEX `sales_customer_id_foreign` ON `sales` (`customer_id`);--> statement-breakpoint
CREATE INDEX `sale_items_sale_id_foreign` ON `sale_items` (`sale_id`);--> statement-breakpoint
CREATE INDEX `sale_items_product_id_foreign` ON `sale_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_index` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_last_activity_index` ON `sessions` (`last_activity`);--> statement-breakpoint
CREATE INDEX `supplier_prices_product_id_foreign` ON `supplier_prices` (`product_id`);--> statement-breakpoint
CREATE INDEX `supplier_prices_supplier_id_foreign` ON `supplier_prices` (`supplier_id`);
*/