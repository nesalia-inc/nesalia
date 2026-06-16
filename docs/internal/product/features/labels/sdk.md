---
title: Labels SDK Reference
description: TypeScript SDK surface for label management and document-label assignment
status: draft
version: 0.1.0
category: sdk
tags: [sdk, labels, typescript, api]
author: Product Team
created: 2026-06-15
updated: 2026-06-15
reviewers: [eng-lead]
related:
  - features/labels/labels.md
  - features/labels/cli.md
  - features/labels/web.md
priority: high
stability: experimental
requires:
  - features/labels/labels.md
impact:
  users: developers
  complexity: low
---

# Labels — SDK Reference

TypeScript SDK surface for the Labels feature. Consumed by `apps/web` and `apps/cli`; the SDK is the single source of truth for label operations.

---

## Public API

```typescript
// Top-level namespace
nesalia.labels

// Methods
nesalia.labels.list(params)
nesalia.labels.get(params)
nesalia.labels.create(params)
nesalia.labels.update(params)
nesalia.labels.delete(params)

// Document-label assignment (lives under the documents namespace, mirrored here for completeness)
nesalia.documents.setLabels(params)
nesalia.documents.addLabel(params)
nesalia.documents.removeLabel(params)
nesalia.documents.getLabels(params)
```

---

## Types

```typescript
// A label
export interface Label {
  id: string
  organizationId: string
  title: string                 // 1-50 chars, unique per org
  color: LabelColor
  description: string | null
  createdBy: string
  createdAt: string             // ISO 8601
  updatedAt: string
  archivedAt: string | null
}

// A label with computed fields
export interface LabelWithCount extends Label {
  documentCount: number
}

// Fixed color palette
export type LabelColor =
  | 'red' | 'orange' | 'yellow' | 'green'
  | 'teal' | 'blue'  | 'indigo' | 'purple'
  | 'pink' | 'brown' | 'gray'   | 'black'

// Paginated list
export interface LabelList {
  data: LabelWithCount[]
  pagination: { page: number; perPage: number; total: number }
}

// Params
export interface ListLabelsParams {
  organizationId: string
  color?: LabelColor
  sort?: 'title' | 'document-count' | 'createdAt'
  page?: number                 // default 1
  perPage?: number              // default 50
}

export interface GetLabelParams {
  organizationId: string
  labelId: string
  includeCount?: boolean
}

export interface CreateLabelParams {
  organizationId: string
  title: string
  color: LabelColor
  description?: string
}

export interface UpdateLabelParams {
  organizationId: string
  labelId: string
  title?: string
  color?: LabelColor
  description?: string | null
}

export interface DeleteLabelParams {
  organizationId: string
  labelId: string
  force?: boolean               // detach from all documents
}

// Document-label params
export interface SetDocumentLabelsParams {
  documentId: string
  labelIds: string[]            // full replacement; empty = clear
}

export interface AddDocumentLabelParams {
  documentId: string
  labelId: string
}

export interface RemoveDocumentLabelParams {
  documentId: string
  labelId: string
}

export interface GetDocumentLabelsParams {
  documentId: string
}
```

---

## Errors

The SDK throws a discriminated `NesaliaLabelError`. Catch and narrow with the `code` field.

```typescript
export class NesaliaLabelError extends Error {
  code: LabelErrorCode
  status: number
  details?: Record<string, unknown>
}

export type LabelErrorCode =
  | 'LABEL_TITLE_INVALID'        // empty, too long, bad chars
  | 'LABEL_TITLE_COLLISION'      // sibling with same title in the org
  | 'LABEL_COLOR_INVALID'        // not in the 12-color palette
  | 'LABEL_FORBIDDEN'            // no permission to manage labels
  | 'LABEL_NOT_FOUND'            // labelId does not exist
  | 'LABEL_IN_USE'               // delete rejected (use force)
  | 'DOCUMENT_NOT_FOUND'         // documentId does not exist (for assignment)
  | 'UNAUTHORIZED'               // bad or missing auth
  | 'UNKNOWN'
```

---

## Examples

### Bootstrap a new org's label library

```typescript
import { nesalia, NesaliaLabelError } from '@nesalia/sdk'

const orgId = 'org_abc'

const legal = await nesalia.labels.create({
  organizationId: orgId,
  title: 'Legal',
  color: 'red',
  description: 'Needs legal review',
})

const finance = await nesalia.labels.create({
  organizationId: orgId,
  title: 'Finance',
  color: 'green',
  description: 'Budget and planning',
})
```

### Apply labels to a document

```typescript
// Replace the full label set
await nesalia.documents.setLabels({
  documentId: 'doc_123',
  labelIds: [legal.id, finance.id],
})

// Add a single label
await nesalia.documents.addLabel({
  documentId: 'doc_123',
  labelId: legal.id,
})

// Remove a single label
await nesalia.documents.removeLabel({
  documentId: 'doc_123',
  labelId: finance.id,
})

// Read back
const { data: labels } = await nesalia.documents.getLabels({ documentId: 'doc_123' })
console.log(labels.map((l) => l.title))   // ['Legal']
```

### Filter documents by label

```typescript
// Single label
const { data: docs } = await nesalia.documents.list({
  organizationId: orgId,
  labelIds: [legal.id],
})

// Multiple labels (AND'd)
const { data: docs } = await nesalia.documents.list({
  organizationId: orgId,
  labelIds: [legal.id, finance.id],
})
```

### Handle a title collision

```typescript
try {
  await nesalia.labels.create({
    organizationId: orgId,
    title: 'Legal',
    color: 'red',
  })
} catch (err) {
  if (err instanceof NesaliaLabelError && err.code === 'LABEL_TITLE_COLLISION') {
    // show "A label with this title already exists"
  } else {
    throw err
  }
}
```

### Update label color / description

```typescript
await nesalia.labels.update({
  organizationId: orgId,
  labelId: legal.id,
  color: 'orange',
  description: 'Apply to documents that need legal sign-off',
})
```

### Force-delete a label

```typescript
await nesalia.labels.delete({
  organizationId: orgId,
  labelId: 'lbl_old',
  force: true,   // detach from all documents first
})
```

---

## Versioning and Stability

- The SDK surface above is the v1 contract. Breaking changes require a major version bump of `@nesalia/sdk`.
- New optional fields may be added to response types in minor versions. New methods may be added in minor versions.
- Adding a new color to the `LabelColor` union is **not** considered a breaking change in a minor version (callers that switch on the union should add a default branch).
- Renaming or removing a color **is** a breaking change.

---

## Related Documents

- [Labels Spec](./labels.md) — main feature spec, data model, API
- [Labels CLI](./cli.md) — CLI commands
- [Labels Web](./web.md) — web surface
