ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "remember_token" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp;