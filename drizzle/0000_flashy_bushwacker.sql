CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`profile_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`session_id` text,
	`title` text NOT NULL,
	`due_at` text,
	`status` text DEFAULT 'assigned' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `learner_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `assignments_owner_idx` ON `assignments` (`owner_email`);--> statement-breakpoint
CREATE INDEX `assignments_profile_idx` ON `assignments` (`profile_id`);--> statement-breakpoint
CREATE TABLE `content_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`lesson_id` text NOT NULL,
	`review_type` text NOT NULL,
	`reviewer_name` text DEFAULT '' NOT NULL,
	`reviewer_email` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'not-started' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`reviewed_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_review_lesson_type_unique` ON `content_reviews` (`owner_email`,`lesson_id`,`review_type`);--> statement-breakpoint
CREATE INDEX `content_reviews_lesson_idx` ON `content_reviews` (`lesson_id`);--> statement-breakpoint
CREATE TABLE `curriculum_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`lesson_id` text,
	`title` text NOT NULL,
	`level` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`data_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `curriculum_drafts_owner_idx` ON `curriculum_drafts` (`owner_email`);--> statement-breakpoint
CREATE TABLE `learner_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`display_name` text NOT NULL,
	`age_band` text DEFAULT 'not-specified' NOT NULL,
	`home_languages` text DEFAULT '[]' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `learner_profiles_owner_idx` ON `learner_profiles` (`owner_email`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`lesson_id` text NOT NULL,
	`slot` text NOT NULL,
	`object_key` text NOT NULL,
	`original_name` text NOT NULL,
	`content_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`speaker_name` text DEFAULT '' NOT NULL,
	`dialect` text DEFAULT 'Bangladesh standard' NOT NULL,
	`consent_confirmed` integer DEFAULT false NOT NULL,
	`review_status` text DEFAULT 'pending' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_assets_object_key_unique` ON `media_assets` (`object_key`);--> statement-breakpoint
CREATE INDEX `media_assets_slot_idx` ON `media_assets` (`lesson_id`,`slot`);--> statement-breakpoint
CREATE INDEX `media_assets_owner_idx` ON `media_assets` (`owner_email`);--> statement-breakpoint
CREATE TABLE `skill_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`session_id` text NOT NULL,
	`skill` text NOT NULL,
	`status` text DEFAULT 'complete' NOT NULL,
	`score` integer,
	`evidence` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `learner_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_progress_profile_session_unique` ON `skill_progress` (`profile_id`,`session_id`);--> statement-breakpoint
CREATE INDEX `skill_progress_profile_idx` ON `skill_progress` (`profile_id`);--> statement-breakpoint
CREATE INDEX `skill_progress_lesson_idx` ON `skill_progress` (`lesson_id`);--> statement-breakpoint
CREATE TABLE `video_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`lesson_id` text NOT NULL,
	`video_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`captions_status` text DEFAULT 'unchecked' NOT NULL,
	`suitability_status` text DEFAULT 'unchecked' NOT NULL,
	`replacement_url` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`checked_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `video_reviews_lesson_unique` ON `video_reviews` (`owner_email`,`lesson_id`);--> statement-breakpoint
CREATE INDEX `video_reviews_owner_idx` ON `video_reviews` (`owner_email`);