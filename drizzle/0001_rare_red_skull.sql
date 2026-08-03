CREATE TABLE `adult_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`adult_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`adult_id`) REFERENCES `adults`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `adult_sessions_adult_idx` ON `adult_sessions` (`adult_id`);--> statement-breakpoint
CREATE TABLE `adults` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `adults_email_unique` ON `adults` (`email`);