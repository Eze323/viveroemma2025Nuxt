CREATE TABLE `product_suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`supplier_id` int NOT NULL,
	`cost_price` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`min_order_qty` int DEFAULT 0,
	`last_purchase_date` timestamp DEFAULT 'NULL',
	`notes` text DEFAULT ('NULL'),
	CONSTRAINT `product_suppliers_product_id_supplier_id_unique` UNIQUE(`product_id`,`supplier_id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255);--> statement-breakpoint
ALTER TABLE `suppliers` ADD `contact` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `suppliers` ADD `notes` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `users` ADD `firebase_uid` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('pending','active','suspended') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_firebase_uid_unique` UNIQUE(`firebase_uid`);--> statement-breakpoint
ALTER TABLE `product_suppliers` ADD CONSTRAINT `product_suppliers_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_suppliers` ADD CONSTRAINT `product_suppliers_supplier_id_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `product_suppliers_product_id_index` ON `product_suppliers` (`product_id`);--> statement-breakpoint
CREATE INDEX `product_suppliers_supplier_id_index` ON `product_suppliers` (`supplier_id`);