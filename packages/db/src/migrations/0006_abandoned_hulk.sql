ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
ALTER TABLE "device_code" DROP CONSTRAINT "device_code_device_code_unique";--> statement-breakpoint
ALTER TABLE "device_code" DROP CONSTRAINT "device_code_user_code_unique";--> statement-breakpoint
ALTER TABLE "device_code" DROP CONSTRAINT "device_code_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "device_code_userCode_idx";--> statement-breakpoint
DROP INDEX "device_code_status_idx";--> statement-breakpoint
ALTER TABLE "device_code" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "device_code" DROP COLUMN "created_at";--> statement-breakpoint
DROP TYPE "public"."roles";