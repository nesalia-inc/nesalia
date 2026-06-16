-- Migration: Remove legacy metadata.tags column from documents
-- This is a destructive change — old tag data is discarded.
-- A backup column is held temporarily for rollback safety.
-- The backup will be dropped at the end of v1.x (see migration 0010).

BEGIN;

-- Step 1: Create backup column and copy data
ALTER TABLE "documents" ADD COLUMN "tags_backup" jsonb;
UPDATE "documents" SET "tags_backup" = to_jsonb("tags");

-- Step 2: Drop the original column (cascade not needed — tags has no FKs)
ALTER TABLE "documents" DROP COLUMN "tags";

COMMIT;