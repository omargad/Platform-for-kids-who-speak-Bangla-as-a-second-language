import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const learnerProfiles = sqliteTable(
  "learner_profiles",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    displayName: text("display_name").notNull(),
    ageBand: text("age_band").notNull().default("not-specified"),
    homeLanguages: text("home_languages").notNull().default("[]"),
    notes: text("notes").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("learner_profiles_owner_idx").on(table.ownerEmail)],
);
export const skillProgress = sqliteTable(
  "skill_progress",
  {
    id: text("id").primaryKey(),
    profileId: text("profile_id").notNull().references(() => learnerProfiles.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    sessionId: text("session_id").notNull(),
    skill: text("skill").notNull(),
    status: text("status").notNull().default("complete"),
    score: integer("score"),
    evidence: text("evidence").notNull().default(""),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("skill_progress_profile_session_unique").on(table.profileId, table.sessionId),
    index("skill_progress_profile_idx").on(table.profileId),
    index("skill_progress_lesson_idx").on(table.lessonId),
  ],
);

export const assignments = sqliteTable(
  "assignments",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    profileId: text("profile_id").notNull().references(() => learnerProfiles.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    sessionId: text("session_id"),
    title: text("title").notNull(),
    dueAt: text("due_at"),
    status: text("status").notNull().default("assigned"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("assignments_owner_idx").on(table.ownerEmail),
    index("assignments_profile_idx").on(table.profileId),
  ],
);

export const curriculumDrafts = sqliteTable(
  "curriculum_drafts",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    lessonId: text("lesson_id"),
    title: text("title").notNull(),
    level: text("level").notNull(),
    status: text("status").notNull().default("draft"),
    dataJson: text("data_json").notNull().default("{}"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("curriculum_drafts_owner_idx").on(table.ownerEmail)],
);

export const contentReviews = sqliteTable(
  "content_reviews",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    lessonId: text("lesson_id").notNull(),
    reviewType: text("review_type").notNull(),
    reviewerName: text("reviewer_name").notNull().default(""),
    reviewerEmail: text("reviewer_email").notNull().default(""),
    status: text("status").notNull().default("not-started"),
    notes: text("notes").notNull().default(""),
    reviewedAt: text("reviewed_at"),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("content_review_lesson_type_unique").on(table.ownerEmail, table.lessonId, table.reviewType),
    index("content_reviews_lesson_idx").on(table.lessonId),
  ],
);

export const mediaAssets = sqliteTable(
  "media_assets",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    lessonId: text("lesson_id").notNull(),
    slot: text("slot").notNull(),
    objectKey: text("object_key").notNull(),
    originalName: text("original_name").notNull(),
    contentType: text("content_type").notNull(),
    byteSize: integer("byte_size").notNull(),
    speakerName: text("speaker_name").notNull().default(""),
    dialect: text("dialect").notNull().default("Bangladesh standard"),
    consentConfirmed: integer("consent_confirmed", { mode: "boolean" }).notNull().default(false),
    reviewStatus: text("review_status").notNull().default("pending"),
    notes: text("notes").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("media_assets_object_key_unique").on(table.objectKey),
    index("media_assets_slot_idx").on(table.lessonId, table.slot),
    index("media_assets_owner_idx").on(table.ownerEmail),
  ],
);

export const videoReviews = sqliteTable(
  "video_reviews",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    lessonId: text("lesson_id").notNull(),
    videoId: text("video_id").notNull(),
    status: text("status").notNull().default("pending"),
    captionsStatus: text("captions_status").notNull().default("unchecked"),
    suitabilityStatus: text("suitability_status").notNull().default("unchecked"),
    replacementUrl: text("replacement_url").notNull().default(""),
    notes: text("notes").notNull().default(""),
    checkedAt: text("checked_at"),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("video_reviews_lesson_unique").on(table.ownerEmail, table.lessonId),
    index("video_reviews_owner_idx").on(table.ownerEmail),
  ],
);

export const adults = sqliteTable(
  "adults",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("adults_email_unique").on(table.email)],
);

export const adultSessions = sqliteTable(
  "adult_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    adultId: text("adult_id").notNull().references(() => adults.id, { onDelete: "cascade" }),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("adult_sessions_adult_idx").on(table.adultId)],
);
