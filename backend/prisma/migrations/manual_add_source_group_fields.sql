-- Add new fields to sources table for tracking Telegram submission details
-- Run this migration on your database before deploying

-- Add groupName field to store the Telegram group name
ALTER TABLE sources ADD COLUMN IF NOT EXISTS "groupName" VARCHAR(255);

-- Add tgUsername field to store the submitter's Telegram username
ALTER TABLE sources ADD COLUMN IF NOT EXISTS "tgUsername" VARCHAR(255);

-- Add index on tgUser for better query performance
CREATE INDEX IF NOT EXISTS sources_tgUser_idx ON sources("tgUser");

-- Update existing records to have a default groupName if tgChannel exists
UPDATE sources
SET "groupName" = 'Telegram Grubu'
WHERE "tgChannel" IS NOT NULL AND "groupName" IS NULL;
