# Labels Technical Plan

## Overview

Labels are a global, per-organization categorization primitive. Each organization owns a single library of labels (a small, curated set with `title`, `color`, and optional `description`), and that library is available to every project in the org.

**Product Spec:** `docs/internal/product/features/labels/labels.md`
**Status:** Draft — pending Head of Product review

---

## Current State

### Existing Components

| Component | Status | Notes |
|-----------|--------|-------|
| **DB Schema** | ✅ | `organizations`, `documents`, `organizationDocuments` tables |
| **API (tRPC)** | ✅ | `organizations`, `documents` routers |
| **SDK** | ✅ | `organizations`, `documents` operations |
| **CLI** | ✅ | `nesalia docs *` commands (with `--tags` flag) |
| **Web UI** | ✅ | Document detail page, document list |

### What Needs to Change

| Component | Change Required |
|-----------|----------------|
| **DB Schema** | Add `labels`, `document_labels` tables; remove `metadata.tags` column |
| **API (tRPC)** | Add `labels` router; update `documents` router for label assignment |
| **SDK** | Add `labels` operations; add `documents.setLabels/addLabel/removeLabel` |
| **CLI** | Add `nesalia labels *` commands; update `nesalia docs labels *`; remove `--tags` |
| **Web UI** | Add `/[orgSlug]/labels` page; add `<LabelChip>`, `<LabelPicker>`, `<LabelFilter>` components |

---

## Data Model

### New Tables

#### labels

```typescript
export const labels = pgTable(
  "labels",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 50 }).notNull(),
    color: varchar("color", { length: 16 }).notNull(), // LabelColor union
    description: varchar("description", { length: 500 }),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
    archivedAt: timestamp("archived_at"), // soft delete (reserved for v2)
  },
  (table) => [
    uniqueIndex("labels_org_id_title_idx").on(table.organizationId, table.title),
    index("labels_organization_id_idx").on(table.organizationId),
    index("labels_archived_idx").on(table.archivedAt),
  ],
);
```

**Uniqueness constraint:** `title` is unique **per organization** via the composite index on `(organizationId, title)`. Two labels with the same title may exist in different organizations.

#### document_labels (join table)

```typescript
export const documentLabels = pgTable(
  "document_labels",
  {
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
    appliedAt: timestamp("applied_at").$defaultFn(() => new Date()).notNull(),
    appliedBy: text("applied_by")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    primaryKey({ columns: [table.documentId, table.labelId] }),
    index("document_labels_label_id_idx").on(table.labelId),
    index("document_labels_document_id_idx").on(table.documentId),
  ],
);
```

**Cascade behavior (locked 2026-06-16):**

| Foreign key | On delete | Rationale |
|-------------|-----------|-----------|
| `document_labels.labelId → labels.id` | `ON DELETE CASCADE` | Deleting a label detaches it from all documents atomically at the DB level |
| `document_labels.documentId → documents.id` | `ON DELETE CASCADE` | When a document is hard-deleted, its join rows go with it |

The `?force=true` flag in the API is a **UX/business check** in the tRPC procedure, not a DB operation.

### Relations

```typescript
// Labels relations
export const labelRelations = relations(labels, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [labels.organizationId],
    references: [organizations.id],
  }),
  creator: one(user, {
    fields: [labels.createdBy],
    references: [user.id],
  }),
  documentLabels: many(documentLabels),
}));

// Document labels relations
export const documentLabelRelations = relations(documentLabels, ({ one }) => ({
  document: one(documents, {
    fields: [documentLabels.documentId],
    references: [documents.id],
  }),
  label: one(labels, {
    fields: [documentLabels.labelId],
    references: [labels.id],
  }),
  applicator: one(user, {
    fields: [documentLabels.appliedBy],
    references: [user.id],
  }),
}));

// Extend existing relations
documentRelations: add `labels: many(labels)` via `documentLabels`
```

### Document Schema Change

```typescript
// REMOVED from documents table
metadata: {
  tags: string[]  // <-- removed, replaced by document_labels join
}

// ADDED: documents can be fetched with labels hydrated
// DocumentWithLabels extends BaseDocument {
labels: Label[]  // hydrated, sorted by title (case-insensitive)
```

### Migration: Remove `metadata.tags`

```sql
-- Step 1 (pre-launch): backup and drop the column
ALTER TABLE documents ADD COLUMN metadata_tags_backup JSONB;
UPDATE documents SET metadata_tags_backup = to_jsonb(metadata->'tags');
ALTER TABLE documents DROP COLUMN metadata;
-- Step 2 (end of v1.x): drop the backup
ALTER TABLE documents DROP COLUMN metadata_tags_backup;
```

The backup is held for one release for rollback safety. The backup is **not** exposed to users.

---

## LabelColor Type

```typescript
export const LABEL_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
  "gray",
  "black",
] as const;

export type LabelColor = (typeof LABEL_COLORS)[number];
```

Stored as `varchar(16)` in the DB; the Zod enum in the API validates against the union.

---

## API Design

### Router Structure

```typescript
// packages/api/src/routers/labels.ts
export const labelsRouter = createTRPCRouter({
  // Core CRUD
  list: protectedProcedure,
  get: protectedProcedure,
  create: protectedProcedure,
  update: protectedProcedure,
  delete: protectedProcedure,
});

// packages/api/src/routers/documents.ts
documentsRouter.extend({
  labels: createTRPCRouter({
    list: protectedProcedure,      // GET /documents/:id/labels
    set: protectedProcedure,       // PUT  /documents/:id/labels
    add: protectedProcedure,       // POST /documents/:id/labels/:labelId
    remove: protectedProcedure,    // DELETE /documents/:id/labels/:labelId
  }),
  // documents.list filter update stays flat (not nested)
  list: protectedProcedure,        // with labelIds filter
});
```

### Procedures

| Procedure | Auth | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `labels.list` | protected | `{ orgId, color?, sort?, page?, perPage? }` | `LabelList` | Sorted by title (case-insensitive) |
| `labels.get` | protected | `{ orgId, labelId, includeCount? }` | `LabelWithCount` | |
| `labels.create` | org admin | `{ orgId, title, color, description? }` | `Label` | Enforces org-level title uniqueness |
| `labels.update` | org admin | `{ orgId, labelId, title?, color?, description? }` | `Label` | Re-checks title uniqueness |
| `labels.delete` | org admin | `{ orgId, labelId, force? }` | `{ success }` | `force=true` skips LABEL_IN_USE check |
| `documents.labels.list` | protected | `{ documentId }` | `Label[]` | Sorted by title |
| `documents.labels.set` | document owner/admin | `{ documentId, labelIds }` | `DocumentWithLabels` | Full replacement (atomic) |
| `documents.labels.add` | document owner/admin | `{ documentId, labelId }` | `DocumentWithLabels` | Idempotent if already applied |
| `documents.labels.remove` | document owner/admin | `{ documentId, labelId }` | `DocumentWithLabels` | Idempotent if not applied |
| `documents.list` | protected | `{ orgId, labelIds?, ... }` | `DocumentList` | `labelIds` filter is AND'd |

### Zod Input Schemas

```typescript
// labels.list
z.object({
  orgId: z.string(),
  color: z.enum(LABEL_COLORS).optional(),
  sort: z.enum(["title", "document-count", "createdAt"]).optional(),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(50),
})

// labels.create
z.object({
  orgId: z.string(),
  title: z.string().min(1).max(50),
  color: z.enum(LABEL_COLORS),
  description: z.string().max(500).optional(),
})

// labels.update
z.object({
  orgId: z.string(),
  labelId: z.string(),
  title: z.string().min(1).max(50).optional(),
  color: z.enum(LABEL_COLORS).optional(),
  description: z.string().max(500).optional().nullable(),
})

// labels.delete
z.object({
  orgId: z.string(),
  labelId: z.string(),
  force: z.boolean().default(false),
})

// documents.setLabels
z.object({
  documentId: z.string(),
  labelIds: z.array(z.string()),
})

// documents.addLabel / removeLabel
z.object({
  documentId: z.string(),
  labelId: z.string(),
})
```

### Error Codes

| Code | HTTP | When |
|------|------|------|
| `LABEL_TITLE_INVALID` | 400 | Empty, too long, or contains forbidden characters |
| `LABEL_COLOR_INVALID` | 400 | Color not in the 12-color palette |
| `LABEL_TITLE_COLLISION` | 409 | Another label with the same title exists in this org |
| `LABEL_NOT_FOUND` | 404 | labelId does not exist |
| `LABEL_FORBIDDEN` | 403 | Caller cannot manage labels in this org |
| `LABEL_IN_USE` | 409 | Delete rejected; label still attached to documents |
| `DOCUMENT_NOT_FOUND` | 404 | documentId does not exist |

---

## SDK Surface

```typescript
// packages/sdk/src/client.ts (representative additions)

export interface Label { /* ... */ }
export interface LabelWithCount extends Label { documentCount: number }
export type LabelColor = /* 12-color union */
export interface LabelList { data: LabelWithCount[]; pagination: Pagination }

// Labels namespace
nesalia.labels.list(params: ListLabelsParams): Promise<LabelList>
nesalia.labels.get(params: GetLabelParams): Promise<LabelWithCount>
nesalia.labels.create(params: CreateLabelParams): Promise<Label>
nesalia.labels.update(params: UpdateLabelParams): Promise<Label>
nesalia.labels.delete(params: DeleteLabelParams): Promise<void>

// Document-label namespace (nested under documents)
nesalia.documents.labels.list(params: GetDocumentLabelsParams): Promise<Label[]>
nesalia.documents.labels.set(params: SetDocumentLabelsParams): Promise<DocumentWithLabels>
nesalia.documents.labels.add(params: AddDocumentLabelParams): Promise<DocumentWithLabels>
nesalia.documents.labels.remove(params: RemoveDocumentLabelParams): Promise<DocumentWithLabels>

// Documents list filter
nesalia.documents.list({ organizationId, labelIds?, ... }): Promise<DocumentList>
// labelIds filters to documents carrying ALL listed labels (AND)
```

---

## Implementation Phases

### Phase 1: Database
- [ ] Add `LabelColor` constant array to schema
- [ ] Add `labels` table to schema
- [ ] Add `document_labels` table to schema
- [ ] Add `labelRelations`, `documentLabelRelations`
- [ ] Extend `documentRelations` to include labels
- [ ] Generate migration `0010_add_labels.sql` (labels + document_labels)
- [ ] Generate migration `0011_remove_metadata_tags.sql` (backup + drop `metadata.tags`)
- [ ] Test migrations
- [ ] (End of v1.x) Generate migration `0012_drop_metadata_tags_backup.sql` (drop backup column)

### Phase 2: API
- [ ] Create `packages/api/src/routers/labels.ts`
- [ ] Implement `labels.list` procedure
- [ ] Implement `labels.get` procedure
- [ ] Implement `labels.create` procedure (enforce org-level title uniqueness)
- [ ] Implement `labels.update` procedure (re-check title uniqueness)
- [ ] Implement `labels.delete` procedure (check LABEL_IN_USE, cascade handles cleanup)
- [ ] Add `documents.setLabels` procedure
- [ ] Add `documents.addLabel` procedure
- [ ] Add `documents.removeLabel` procedure
- [ ] Add `documents.getLabels` procedure
- [ ] Update `documents.list` to support `labelIds` filter
- [ ] Add permission checks (org admin for label CRUD, document owner/admin for assignment)
- [ ] Add all error codes to `TRPCError` map
- [ ] Test all procedures

### Phase 3: SDK
- [ ] Add `Label`, `LabelWithCount`, `LabelColor`, `LabelList` types
- [ ] Add `labels.*` operations to SDK client
- [ ] Add `documents.setLabels/addLabel/removeLabel/getLabels` operations
- [ ] Update `documents.list` params to include `labelIds`
- [ ] Test SDK integration

### Phase 4: CLI
- [ ] Add `nesalia labels` command group
- [ ] Add `nesalia labels list` subcommand
- [ ] Add `nesalia labels get` subcommand
- [ ] Add `nesalia labels create` subcommand
- [ ] Add `nesalia labels update` subcommand
- [ ] Add `nesalia labels delete` subcommand
- [ ] Add `nesalia docs labels set` subcommand
- [ ] Add `nesalia docs labels add` subcommand
- [ ] Add `nesalia docs labels remove` subcommand
- [ ] Add `nesalia docs labels list` subcommand
- [ ] Update `nesalia docs list` to support `--label` filter
- [ ] Update `nesalia docs search` to support `--label` filter
- [ ] Remove legacy `--tags` flag from `nesalia docs create/update`
- [ ] Remove legacy `--tags` filter from `nesalia docs list/search`
- [ ] Test all commands

### Phase 5: Web UI
- [ ] Add `/[orgSlug]/labels` page
- [ ] Add `/[orgSlug]/labels/new` page (or modal)
- [ ] Add `/[orgSlug]/labels/[labelId]/edit` page (or modal)
- [ ] Create `<LabelChip>` component
- [ ] Create `<LabelPicker>` component
- [ ] Create `<LabelFilter>` component (checkbox group for search)
- [ ] Add Labels section to Document Detail sidebar
- [ ] Add label chips to Document List rows
- [ ] Add label filter to Document Search sidebar
- [ ] Add "Labels" link to sidebar navigation
- [ ] Test full flow

---

## Effort Estimate

| Phase | Complexity | Time |
|-------|------------|------|
| Database | Low | 2-3h |
| API | Medium | 5-7h |
| SDK | Low | 2h |
| CLI | Medium | 4-5h |
| Web UI | Medium | 5-7h |
| **Total** | | **18-24h** |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Title uniqueness race condition | Low | Medium | Use `ON CONFLICT` with the unique index; catch DB constraint violations and map to `LABEL_TITLE_COLLISION` |
| `?force` check timing window | Low | Low | The count check and delete are in the same transaction; DB cascade is atomic |
| `metadata.tags` backup grows large | Low | Medium | Backup is held temporarily; schedule cleanup migration for end of v1.x |
| Label picker performance on large orgs | Medium | Low | Paginate label list; debounce search input |
| Soft-deleted labels still appear on docs | Low | High | Filter `archivedAt IS NULL` in all label queries |

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Composite unique index on `(organizationId, title)` | Two labels with the same title can exist in different orgs, not within the same one |
| `ON DELETE CASCADE` on both FKs in `document_labels` | Atomic cleanup; `?force` flag is a business check in the procedure, not a DB operation |
| Join table over `labelIds[]` array | Index-friendly for "find docs with label X"; clean cascade on delete; avoids deep Postgres arrays |
| `PUT /documents/:id/labels` is a full replacement | Simpler mental model; `POST`/`DELETE` for single-label add/remove |
| Sort labels by title (case-insensitive) everywhere | Consistent ordering across all surfaces |
| `archivedAt` column added but not used in v1 | Forward-compatible for v2 soft-delete feature |
| `metadata.tags` backup held for one release | Rollback safety net; not exposed to users |

---

## Dependencies

- **Depends on:** Organizations, Documents (both ✅ done)
- **Blocks:** None directly, but other features may consume labels in the future

---

## Related Documents

- Product Spec: `docs/internal/product/features/labels/labels.md`
- SDK Spec: `docs/internal/product/features/labels/sdk.md`
- CLI Spec: `docs/internal/product/features/labels/cli.md`
- Web Spec: `docs/internal/product/features/labels/web.md`

---

## Appendix: Document-Label Hydration Query

When fetching a document with its labels hydrated:

```typescript
const docsWithLabels = await db
  .select({
    document: documents,
  })
  .from(documents)
  .leftJoin(
    documentLabels,
    eq(documents.id, documentLabels.documentId)
  )
  .leftJoin(
    labels,
    and(
      eq(documentLabels.labelId, labels.id),
      isNull(labels.archivedAt)
    )
  )
  .where(and(
    eq(documents.id, docId),
    isNull(documents.deletedAt)
  ));

// Group by document, sort labels by title
const grouped = groupBy(docsWithLabels, (row) => row.document.id);
const result = Object.entries(grouped).map(([id, rows]) => ({
  ...rows[0].document,
  labels: rows
    .map((r) => r.label)
    .filter(Boolean)
    .sort((a, b) => a!.title.toLowerCase().localeCompare(b!.title.toLowerCase())),
}));
```

---

_Plan created: 2026-06-16_
_Last updated: 2026-06-16_
_Status: Draft — pending Head of Product review_