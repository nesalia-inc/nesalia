DROP INDEX "invitation_status_idx";--> statement-breakpoint
DROP INDEX "organization_slug_idx";--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "updated_at";