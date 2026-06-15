CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"content" text,
	"tags" text[],
	"created_by" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"visibility" varchar(20) DEFAULT 'all' NOT NULL,
	"archived_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_documents" ADD CONSTRAINT "organization_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_documents" ADD CONSTRAINT "organization_documents_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_docs_document_idx" ON "organization_documents" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "org_docs_organization_idx" ON "organization_documents" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "org_docs_type_idx" ON "organization_documents" USING btree ("type");--> statement-breakpoint
CREATE INDEX "org_docs_archived_idx" ON "organization_documents" USING btree ("archived_at");