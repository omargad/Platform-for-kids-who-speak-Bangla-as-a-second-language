CREATE TABLE `recovery_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`adult_id` text NOT NULL,
	`code_hash` text NOT NULL,
	`used_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`adult_id`) REFERENCES `adults`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `recovery_codes_adult_idx` ON `recovery_codes` (`adult_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_codes_hash_unique` ON `recovery_codes` (`code_hash`);