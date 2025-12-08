-- Grassland Migration Script
-- Only creates grassland tables without affecting existing tables

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "name" text NOT NULL,
  "email" text UNIQUE,
  "image" text
);

-- Create plants table
CREATE TABLE IF NOT EXISTS "plants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "image_url" text NOT NULL,
  "width" integer NOT NULL,
  "height" integer NOT NULL,
  "xp" integer DEFAULT 0 NOT NULL,
  "level" integer DEFAULT 1 NOT NULL,
  "water_count" integer DEFAULT 0 NOT NULL,
  "position_x" real NOT NULL,
  "position_y" real NOT NULL,
  "radius" real DEFAULT 50 NOT NULL,
  "author_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create waterings table  
CREATE TABLE IF NOT EXISTS "waterings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "plant_id" uuid NOT NULL REFERENCES "plants"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "xp_gained" integer DEFAULT 10 NOT NULL
);

-- Create indexes for plants
CREATE INDEX IF NOT EXISTS "plants_author_id_idx" ON "plants"("author_id");
CREATE INDEX IF NOT EXISTS "plants_level_idx" ON "plants"("level");
CREATE INDEX IF NOT EXISTS "plants_created_at_idx" ON "plants"("created_at");
CREATE INDEX IF NOT EXISTS "plants_position_idx" ON "plants"("position_x", "position_y");

-- Create indexes for waterings
CREATE INDEX IF NOT EXISTS "waterings_plant_id_idx" ON "waterings"("plant_id");
CREATE INDEX IF NOT EXISTS "waterings_user_id_idx" ON "waterings"("user_id");
CREATE INDEX IF NOT EXISTS "waterings_created_at_idx" ON "waterings"("created_at");

