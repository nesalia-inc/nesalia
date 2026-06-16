CREATE TABLE "document_labels" (
	"document_id" text NOT NULL,
	"label_id" text NOT NULL,
	"applied_at" timestamp NOT NULL,
	"applied_by" text NOT NULL,
	CONSTRAINT "document_labels_document_id_label_id_pk" PRIMARY KEY("document_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "labels" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"title" varchar(50) NOT NULL,
	"color" varchar(16) NOT NULL,
	"description" varchar(500),
	"created_by" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"archived_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "document_labels" ADD CONSTRAINT "document_labels_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_labels" ADD CONSTRAINT "document_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_labels" ADD CONSTRAINT "document_labels_applied_by_user_id_fk" FOREIGN KEY ("applied_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labels" ADD CONSTRAINT "labels_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labels" ADD CONSTRAINT "labels_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "document_labels_label_id_idx" ON "document_labels" USING btree ("label_id");--> statement-breakpoint
CREATE INDEX "document_labels_document_id_idx" ON "document_labels" USING btree ("document_id");--> statement-breakpoint
CREATE UNIQUE INDEX "labels_org_id_title_idx" ON "labels" USING btree ("organization_id","title");--> statement-breakpoint
CREATE INDEX "labels_organization_id_idx" ON "labels" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "labels_archived_idx" ON "labels" USING btree ("archived_at");