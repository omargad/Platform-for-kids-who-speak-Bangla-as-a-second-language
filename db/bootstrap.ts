/**
 * Idempotent schema bootstrap executed when the SQLite database is opened.
 * Mirrors db/schema.ts; keep both in sync when adding tables.
 */
export const bootstrapSql = `
CREATE TABLE IF NOT EXISTS learner_profiles (
  id text PRIMARY KEY NOT NULL,
  owner_email text NOT NULL,
  display_name text NOT NULL,
  age_band text DEFAULT 'not-specified' NOT NULL,
  home_languages text DEFAULT '[]' NOT NULL,
  notes text DEFAULT '' NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS learner_profiles_owner_idx ON learner_profiles (owner_email);

CREATE TABLE IF NOT EXISTS skill_progress (
  id text PRIMARY KEY NOT NULL,
  profile_id text NOT NULL,
  lesson_id text NOT NULL,
  session_id text NOT NULL,
  skill text NOT NULL,
  status text DEFAULT 'complete' NOT NULL,
  score integer,
  evidence text DEFAULT '' NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES learner_profiles(id) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS skill_progress_profile_session_unique ON skill_progress (profile_id, session_id);
CREATE INDEX IF NOT EXISTS skill_progress_profile_idx ON skill_progress (profile_id);
CREATE INDEX IF NOT EXISTS skill_progress_lesson_idx ON skill_progress (lesson_id);

CREATE TABLE IF NOT EXISTS assignments (
  id text PRIMARY KEY NOT NULL,
  owner_email text NOT NULL,
  profile_id text NOT NULL,
  lesson_id text NOT NULL,
  session_id text,
  title text NOT NULL,
  due_at text,
  status text DEFAULT 'assigned' NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES learner_profiles(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS assignments_owner_idx ON assignments (owner_email);
CREATE INDEX IF NOT EXISTS assignments_profile_idx ON assignments (profile_id);

CREATE TABLE IF NOT EXISTS curriculum_drafts (
  id text PRIMARY KEY NOT NULL,
  owner_email text NOT NULL,
  lesson_id text,
  title text NOT NULL,
  level text NOT NULL,
  status text DEFAULT 'draft' NOT NULL,
  data_json text DEFAULT '{}' NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS curriculum_drafts_owner_idx ON curriculum_drafts (owner_email);

CREATE TABLE IF NOT EXISTS content_reviews (
  id text PRIMARY KEY NOT NULL,
  owner_email text NOT NULL,
  lesson_id text NOT NULL,
  review_type text NOT NULL,
  reviewer_name text DEFAULT '' NOT NULL,
  reviewer_email text DEFAULT '' NOT NULL,
  status text DEFAULT 'not-started' NOT NULL,
  notes text DEFAULT '' NOT NULL,
  reviewed_at text,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS content_review_lesson_type_unique ON content_reviews (owner_email, lesson_id, review_type);
CREATE INDEX IF NOT EXISTS content_reviews_lesson_idx ON content_reviews (lesson_id);

CREATE TABLE IF NOT EXISTS media_assets (
  id text PRIMARY KEY NOT NULL,
  owner_email text NOT NULL,
  lesson_id text NOT NULL,
  slot text NOT NULL,
  object_key text NOT NULL,
  original_name text NOT NULL,
  content_type text NOT NULL,
  byte_size integer NOT NULL,
  speaker_name text DEFAULT '' NOT NULL,
  dialect text DEFAULT 'Bangladesh standard' NOT NULL,
  consent_confirmed integer DEFAULT false NOT NULL,
  review_status text DEFAULT 'pending' NOT NULL,
  notes text DEFAULT '' NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS media_assets_object_key_unique ON media_assets (object_key);
CREATE INDEX IF NOT EXISTS media_assets_slot_idx ON media_assets (lesson_id, slot);
CREATE INDEX IF NOT EXISTS media_assets_owner_idx ON media_assets (owner_email);

CREATE TABLE IF NOT EXISTS video_reviews (
  id text PRIMARY KEY NOT NULL,
  owner_email text NOT NULL,
  lesson_id text NOT NULL,
  video_id text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  captions_status text DEFAULT 'unchecked' NOT NULL,
  suitability_status text DEFAULT 'unchecked' NOT NULL,
  replacement_url text DEFAULT '' NOT NULL,
  notes text DEFAULT '' NOT NULL,
  checked_at text,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS video_reviews_lesson_unique ON video_reviews (owner_email, lesson_id);
CREATE INDEX IF NOT EXISTS video_reviews_owner_idx ON video_reviews (owner_email);

CREATE TABLE IF NOT EXISTS adults (
  id text PRIMARY KEY NOT NULL,
  email text NOT NULL,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS adults_email_unique ON adults (email);

CREATE TABLE IF NOT EXISTS adult_sessions (
  token_hash text PRIMARY KEY NOT NULL,
  adult_id text NOT NULL,
  expires_at text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (adult_id) REFERENCES adults(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS adult_sessions_adult_idx ON adult_sessions (adult_id);

CREATE TABLE IF NOT EXISTS classes (
  id text PRIMARY KEY NOT NULL,
  teacher_id text NOT NULL,
  name text NOT NULL,
  join_code text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES adults(id) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS classes_join_code_unique ON classes (join_code);
CREATE INDEX IF NOT EXISTS classes_teacher_idx ON classes (teacher_id);

CREATE TABLE IF NOT EXISTS class_students (
  id text PRIMARY KEY NOT NULL,
  class_id text NOT NULL,
  display_name text NOT NULL,
  token_hash text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS class_students_token_unique ON class_students (token_hash);
CREATE INDEX IF NOT EXISTS class_students_class_idx ON class_students (class_id);

CREATE TABLE IF NOT EXISTS class_activities (
  id text PRIMARY KEY NOT NULL,
  class_id text NOT NULL,
  title text NOT NULL,
  instructions text DEFAULT '' NOT NULL,
  topic_id text,
  questions_json text DEFAULT '[]' NOT NULL,
  status text DEFAULT 'open' NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS class_activities_class_idx ON class_activities (class_id);

CREATE TABLE IF NOT EXISTS activity_submissions (
  id text PRIMARY KEY NOT NULL,
  activity_id text NOT NULL,
  student_id text NOT NULL,
  answers_json text DEFAULT '[]' NOT NULL,
  score integer DEFAULT 0 NOT NULL,
  total integer DEFAULT 0 NOT NULL,
  submitted_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES class_activities(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (student_id) REFERENCES class_students(id) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS activity_submissions_unique ON activity_submissions (activity_id, student_id);
CREATE INDEX IF NOT EXISTS activity_submissions_activity_idx ON activity_submissions (activity_id);

CREATE TABLE IF NOT EXISTS class_announcements (
  id text PRIMARY KEY NOT NULL,
  class_id text NOT NULL,
  body text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS class_announcements_class_idx ON class_announcements (class_id);

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id text PRIMARY KEY NOT NULL,
  updated_by text DEFAULT '' NOT NULL,
  data_json text DEFAULT '{}' NOT NULL,
  active integer DEFAULT true NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS recovery_codes (
  id text PRIMARY KEY NOT NULL,
  adult_id text NOT NULL,
  code_hash text NOT NULL,
  used_at text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (adult_id) REFERENCES adults(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS recovery_codes_adult_idx ON recovery_codes (adult_id);
CREATE UNIQUE INDEX IF NOT EXISTS recovery_codes_hash_unique ON recovery_codes (code_hash);
`;
