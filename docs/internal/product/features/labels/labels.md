---
title: Labels
description: Global per-organization labels for cross-cutting categorization, replacing the legacy tags system
status: draft
version: 0.1.0
category: core
tags: [labels, organization, categorization, taxonomy, rename]
author: Product Team
created: 2026-06-15
updated: 2026-06-16
reviewers: [eng-lead, design-lead]
related:
  - features/documents/documents.md
  - features/labels/web.md
  - features/labels/cli.md
  - features/labels/sdk.md
priority: high
stability: experimental
requires:
  - features/documents/documents.md
impact:
  users: all
  complexity: medium
---

# Labels

> **Status:** Draft. **Replaces the legacy `metadata.tags: string[]` field on documents** with a first-class, per-organization label library. The legacy field is **removed** in v1 — there is no deprecation window. Old tag data is discarded on rollout.

## Overview

Labels are a global, per-organization categorization primitive. Each organization owns a single library of labels (a small, curated set with `title`, `color`, and optional `description`), and that library is available to **every project in the org**.

A label is **not** a free-form string. It is a managed entity that an org admin creates, names, colors, and curates. Documents then carry references to that library.

**Strategic framing:** this feature is the **rename + promotion** of the existing `tags` system. The free-form `string[]` on documents is replaced by a managed `Label` entity. The terminology shifts from "tag" to "label" everywhere (DB, API, CLI, UI, docs). The mental model aligns with Linear, Notion, and Gmail.

## Problem Statement

Today, "tags" on a document are just a `string[]` of free-form text. The pain shows up in three places:

- **Typo tax.** "Onboarding" vs "on-boarding" vs "onboarding-doc" silently fragment the same concept across three buckets. No merge, no warning.
- **Inconsistent color.** Every document's tags render in the same neutral color. There's no way to make "Legal" pop visually, so the categorization primitive loses its purpose.
- **Unmanaged library.** Anyone with edit rights can add any string. There's no canonical list, no description, no ownership. A new joiner has no way to know which labels even exist.

The first generation ("tags") was a way to ship the feature fast. The second generation ("labels") is a way to make the feature actually useful.

## User Stories

- As an **org admin**, I want to define a small, named, colored set of labels (e.g., "Legal", "Finance", "Onboarding") so that the team has a shared vocabulary.
- As a **team member**, I want to filter the document list by label so that I see only "Legal" docs.
- As a **reader**, I want to see colored label chips on a document so that I understand its category at a glance.
- As a **CLI user**, I want `nesalia labels list` and `nesalia labels create` so that I can script the label library.
- As a **developer**, I want a typed `nesalia.labels.*` API in the SDK so that I can integrate the label library into my own tools.

## Scope

### In Scope (v1)

| Capability | Notes |
|------------|-------|
| Per-organization label library | One library per org, shared across all projects |
| Label CRUD | Create, list, get, update, delete |
| Label properties | `title` (unique per org), `color` (fixed 12-color palette), `description` (optional) |
| Apply / unapply to documents | A document can carry many labels |
| Document-label many-to-many | A document can have 0, 1, or many labels |
| Web UI for label management | Per-org `/labels` page |
| CLI parity | `nesalia labels ...` for management, `nesalia docs label add/remove` for assignment |
| SDK parity | `nesalia.labels.*` and `nesalia.documents.setLabels(...)` |
| Search / filter by label | Existing tag-based filter becomes label-based |
| Removal of legacy `metadata.tags: string[]` | The field is removed in v1; old data is discarded (no auto-migration, no deprecation window) |

### Out of Scope (v1)

- ❌ Per-label permissions (anyone with access to the org can apply any label)
- ❌ Label-scoped document permissions (a label doesn't grant/deny access)
- ❌ Label hierarchy / parent-child (flat only)
- ❌ Auto-apply rules (no "if title contains X, apply label Y")
- ❌ Label analytics dashboards
- ❌ Label templates or marketplace
- ❌ Smart labels / AI-suggested labels
- ❌ Label versioning / history (only the current state is stored)
- ❌ Cross-org label sharing
- ❌ Per-project label libraries (labels are org-global only)
- ❌ Free-form hex colors (fixed palette only)
- ❌ Labels on resources other than documents (in v1, labels are documents-only; the data model is forward-compatible)

## Data Model

### `Label` entity (new)

```typescript
type LabelColor =
  | 'red' | 'orange' | 'yellow' | 'green'
  | 'teal' | 'blue'  | 'indigo' | 'purple'
  | 'pink' | 'brown' | 'gray'   | 'black'

interface Label {
  id: string                    // UUID
  organizationId: string        // Owner org
  title: string                 // 1-50 chars, unique per organizationId
  color: LabelColor             // from fixed palette
  description: string | null    // optional, 0-500 chars
  createdBy: string             // userId
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null       // soft delete (reserved for v2)
}
```

**Uniqueness:** the title is unique **per organization** via a composite unique index on `(organizationId, title)`. Two labels with the same title may exist in *different* organizations, but not within the same one.

```typescript
// Drizzle (representative)
export const labels = pgTable('labels', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid().notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  title: varchar({ length: 50 }).notNull(),
  color: varchar({ length: 16 }).notNull(),   // one of LabelColor
  description: varchar({ length: 500 }),
  createdBy: uuid().notNull().references(() => users.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  archivedAt: timestamp(),
}, (table) => [
  uniqueIndex('labels_org_id_title_idx').on(table.organizationId, table.title),
  index('labels_organization_id_idx').on(table.organizationId),  // for "list labels in org"
])
```

### Document-label join (replaces `metadata.tags: string[]`)

```typescript
interface DocumentLabel {
  documentId: string
  labelId: string
  appliedAt: Date
  appliedBy: string
}
```

Storage choice: a `document_labels` join table is preferred over `labelIds: string[]` on the document row, because:
- Index-friendly for "find all docs with label X"
- Clean cascade on document or label delete
- Avoids deep Postgres arrays in the documents table

**Cascade behavior** (locked 2026-06-16 with tech lead):

| Foreign key | On delete | Rationale |
|-------------|-----------|-----------|
| `document_labels.labelId → labels.id` | `ON DELETE CASCADE` | Deleting a label detaches it from all documents. Atomic at the DB level; the `?force=true` flag in the API is a UX/business check, not a DB operation. |
| `document_labels.documentId → documents.id` | `ON DELETE CASCADE` | When a document is hard-deleted, its join rows go with it. (Soft-deleted documents keep their join rows, which is harmless because the document is filtered out of normal reads via `deletedAt`.) |

```typescript
// Drizzle (representative)
export const documentLabels = pgTable('document_labels', {
  documentId: uuid().notNull().references(() => documents.id, { onDelete: 'cascade' }),
  labelId: uuid().notNull().references(() => labels.id, { onDelete: 'cascade' }),
  appliedAt: timestamp().notNull().defaultNow(),
  appliedBy: uuid().notNull().references(() => users.id),
}, (table) => [
  primaryKey({ columns: [table.documentId, table.labelId] }),
  index('document_labels_label_id_idx').on(table.labelId),  // for "find docs with label X"
  index('document_labels_document_id_idx').on(table.documentId),  // for "find labels on doc Y"
])
```

**The `?force=true` decision in the API:**

```typescript
// Representative tRPC procedure shape
async deleteLabel({ labelId, force }: { labelId: string; force: boolean }) {
  // 1. Count current document-label rows for this label
  const [{ n }] = await db
    .select({ n: count() })
    .from(documentLabels)
    .where(eq(documentLabels.labelId, labelId))

  // 2. If in use and not forced, reject
  if (n > 0 && !force) {
    throw new TRPCError({ code: 'CONFLICT', message: 'LABEL_IN_USE' })
  }

  // 3. Delete the label; CASCADE removes the join rows
  await db.delete(labels).where(eq(labels.id, labelId))
}
```

The complexity lives in the procedure (the count check), not in the schema.

### Document changes

```typescript
// Removed
interface BaseDocument {
  // ...
  metadata: {
    // tags: string[]   <-- removed
  }
}

// Added: a Document can be fetched with its labels hydrated
interface DocumentWithLabels extends BaseDocument {
  labels: Label[]   // hydrated, sorted by title
}
```

## Removal of Legacy Tags

The existing `metadata.tags: string[]` field on documents contains free-form strings, possibly with typos and near-duplicates. We are **not** carrying this data forward.

### Strategy: Discard the old data

| Step | What happens |
|------|--------------|
| 1. Pre-launch | A migration script drops the `metadata.tags` column on `documents`. A backup of the raw column is taken first (held for one release in case of rollback). |
| 2. Launch | Documents expose `labels` (the new canonical source). The `metadata.tags` field no longer exists. |
| 3. End of v1.x | The raw backup is dropped. |

### Why discard, not migrate?

- **Simplicity.** No auto-migration logic, no audit table, no deprecation window. The schema is clean on day one.
- **Predictability.** Users re-apply labels deliberately from the new library, rather than inheriting a mess of typos and near-duplicates.
- **Decisiveness.** The product team has called it: the old data is not worth carrying.

### Rollback safety

The pre-launch backup is held for one release. If we need to roll back the labels release, we restore the `metadata.tags` column from the backup. The backup is **not** exposed to users; it's an internal safety net.

## API Design

All endpoints under the existing `/api/v1` prefix.

### Label CRUD

```bash
# List labels in an organization
GET    /api/v1/organizations/:orgId/labels
GET    /api/v1/organizations/:orgId/labels/:labelId
POST   /api/v1/organizations/:orgId/labels
PATCH  /api/v1/organizations/:orgId/labels/:labelId
DELETE /api/v1/organizations/:orgId/labels/:labelId
```

### Document-label assignment

```bash
# Set the full label set on a document (replaces existing)
PUT    /api/v1/documents/:docId/labels          # body: { labelIds: string[] }

# Add a single label
POST   /api/v1/documents/:docId/labels/:labelId

# Remove a single label
DELETE /api/v1/documents/:docId/labels/:labelId
```

### Request / Response shapes

```typescript
interface CreateLabelRequest {
  title: string
  color: LabelColor
  description?: string
}

interface UpdateLabelRequest {
  title?: string
  color?: LabelColor
  description?: string | null
}

interface LabelResponse {
  data: Label
  documentCount: number      // number of documents currently carrying this label
}

interface ListLabelsResponse {
  data: Label[]
  pagination: { page: number; perPage: number; total: number }
}

interface SetDocumentLabelsRequest {
  labelIds: string[]         // full replacement, empty array = no labels
}
```

### Errors

| Code | When |
|------|------|
| `400 LABEL_TITLE_INVALID` | Empty, too long, or contains forbidden characters |
| `400 LABEL_COLOR_INVALID` | Color not in the fixed palette |
| `409 LABEL_TITLE_COLLISION` | Another label with the same title exists in this org |
| `404 LABEL_NOT_FOUND` | labelId does not exist |
| `403 LABEL_FORBIDDEN` | Caller cannot manage labels in this org |
| `409 LABEL_IN_USE` | Delete a label that still has documents (use `?force=true` to detach from all) |

## Acceptance Criteria

A label operation is "done" when:

1. **Create** returns the new label with a unique id and the chosen `title`/`color`/`description`. Title uniqueness is enforced within the org.
2. **List** returns all non-archived labels for the org, sorted by `title` (case-insensitive), with `documentCount` populated.
3. **Get** returns a single label with hydrated `documentCount`.
4. **Update** patches the provided fields; `title` uniqueness is re-checked.
5. **Delete** removes the label and detaches it from all documents. With `?force=false` (default), returns 409 if the label is in use. With `?force=true`, the join rows are removed and the label is deleted.
6. **Document assignment** (`PUT /documents/:id/labels`) replaces the full label set atomically. `POST` and `DELETE` add/remove a single label.
7. **Document detail** returns `labels: Label[]` sorted by `title`.
8. **Search** by label works the same way tag-based search worked: `?label=<id>` filters to documents carrying that label. Multiple labels are AND'd by default; a future enhancement could add OR.
9. **CLI parity** for all the above.
10. **SDK parity** for all the above.
11. **Removal** of the legacy `metadata.tags` column is performed as part of the v1 launch. A backup of the raw column is held for one release for rollback safety.

## Success Metrics

| Metric | Target | Window |
|--------|--------|--------|
| Avg. labels per active org | ≥ 4 | 60 days post-launch |
| Avg. labels per document | ≥ 1.5 | 60 days post-launch |
| % of new documents created with ≥ 1 label | ≥ 70% | 30 / 60 / 90 days |
| Label-related support tickets | < 3 per 100 active orgs | 90 days post-launch |

## Permissions

| Action | Org Owner | Org Admin | Org Member |
|--------|-----------|-----------|------------|
| View labels | ✓ | ✓ | ✓ |
| Create label | ✓ | ✓ | ✗ |
| Update label | ✓ | ✓ | ✗ |
| Delete label | ✓ | ✓ | ✗ |
| Apply label to document | ✓ | ✓ | ✓ |
| Remove label from document | ✓ | ✓ | ✓ (own docs only) |

> "Own docs only" mirrors the existing document edit/delete pattern. Org Owner/Admin always win.

## Non-Goals (recap)

- Per-label permissions, per-label access control
- Label hierarchy, smart labels, auto-apply rules
- Label analytics, templates, marketplace
- Label versioning, audit log of label changes
- Cross-org label sharing
- Per-project label libraries
- Free-form hex colors
- Labels on resources other than documents (v1 is documents-only; the model is forward-compatible)

## Open Questions

1. ~~**Color assignment during auto-migration.**~~ **Resolved** — moot, no migration.
2. ~~**Audit table retention.**~~ **Resolved** — moot, no audit.
3. **Search multi-label filter.** **Resolved** — AND only in v1.
4. **Empty label library empty-state UX.** **Resolved** — blank canvas with "Create your first label" CTA.
5. **Label ordering on document.** **Resolved** — sorted by `title` (case-insensitive), everywhere labels are rendered.

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-06-15 | Head of Product (agent) | Initial draft. Promoted the `metadata.tags: string[]` model to a first-class `Label` entity, per-org, with title/color/description. |
| 2026-06-16 | Head of Product (agent) | Removed the migration plan. Legacy `metadata.tags` is discarded in v1; a backup is held for one release for rollback safety. Resolved open questions #3 (multi-label search = AND only), #4 (empty state = blank canvas), #5 (label ordering = sorted by title). |
| 2026-06-16 | Head of Product (agent) + Tech Lead | Locked two implementation decisions raised by the Tech Lead: (1) Title uniqueness is a **composite unique index on `(organizationId, title)`** — two labels with the same title can exist in different orgs, not within the same one. (2) `?force=true` on `DELETE` uses **`ON DELETE CASCADE`** on both `document_labels.labelId → labels.id` and `document_labels.documentId → documents.id`; the `?force` flag is a UX/business check in the tRPC procedure, not a DB operation. |
