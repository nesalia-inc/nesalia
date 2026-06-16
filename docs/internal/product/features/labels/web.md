---
title: Labels Web Interface
description: Web pages, components, and interactions for label management
status: draft
version: 0.1.0
category: web
tags: [labels, web, pages, structure, chips, filter]
author: Product Team
created: 2026-06-15
updated: 2026-06-15
reviewers: [eng-lead, design-lead]
related:
  - features/labels/labels.md
  - features/labels/cli.md
  - features/labels/sdk.md
  - features/documents/web.md
priority: high
stability: experimental
requires:
  - features/labels/labels.md
impact:
  users: all
  complexity: medium
---

# Labels — Web Interface

## Overview

Web surface for the Labels feature. Covers the per-organization label management page, the label picker component, label chips on documents, and the label-based search/filter integration.

---

## Pages

### Organization Labels Page

**Route:** `/{orgSlug}/labels`

**Purpose:** Manage the org's label library (CRUD).

**Visible to:** Org Owner, Org Admin. Org Members see a read-only view with a link to ask an admin for new labels.

**Contains:**
- Page title: "Labels"
- "New label" button (top right)
- Search input (filter the visible labels)
- Sort dropdown: by title (default), by document count, by date created
- List of labels, each row showing:
  - Color swatch
  - Title
  - Description (truncated, full on hover)
  - Document count (e.g., "12 documents")
  - Kebab menu: Edit, Delete
- Empty state (first time):
  ```
  🏷️
  No labels yet
  Labels help your team share a common vocabulary.
  [Create your first label]
  ```

**Actions:**
- Create label (opens "New label" modal)
- Edit label (inline or modal)
- Delete label (with confirmation; "N documents will be un-labeled")

### New / Edit Label Modal

**Trigger:** "New label" button or "Edit" action on a label row.

**Contains:**
- Title input (1-50 chars, required; uniqueness validated against other labels in the org)
- Color picker (12 fixed swatches, single-select)
- Description textarea (optional, 0-500 chars)
- Cancel / Save buttons
- Inline validation:
  - Title empty → "Title is required"
  - Title too long → "Title must be 50 characters or fewer"
  - Title collision → "A label with this title already exists"
- On Save, optimistically update the row, then reconcile with the API response

### Document Detail — Label Section

**Mounted on:** the existing Document Detail page (see `features/documents/web.md`).

**Where:** in the right sidebar, alongside "Related documents" and "Document info".

**Contains:**
- "Labels" header
- A list of label chips (colored, with title)
- A "+ Label" button (opens the label picker)
- A small "✕" on each chip to remove (with confirm if it's the last label)
- Empty state: "No labels — add one to categorize this document"

### Label Picker (reusable component)

**Trigger:** the "+ Label" button on a document detail, or the "Apply label" action in a document row's context menu.

**Contains:**
- Search input ("Search labels…")
- List of available labels (filtered to the org's library), with the currently-applied ones pre-checked
- A "Create new label" link at the bottom (admins only; opens the New Label modal inline)
- Cancel / Apply buttons

**Behavior:**
- Multi-select: clicking a label toggles its selection
- The Apply button is enabled only if the selection differs from the current state
- The picker is keyboard-navigable (arrow keys, space to toggle, enter to apply)

### Document List — Label Chips

**Mounted on:** the existing organization and project Documents pages (see `features/documents/web.md`).

**Behavior:**
- Each document row shows up to **3 label chips** (colored, with title); if the document has more, a "+N more" pill appears
- The chips are clickable: clicking a chip filters the list to documents carrying that label
- Hover on a chip shows a tooltip with the label's description (if any)
- Chips are sorted by `title` (consistent with the document detail view)

### Document Search — Label Filter

**Mounted on:** the existing Document Search Results page (see `features/documents/web.md`).

**Behavior:**
- The filter sidebar gains a "Labels" group
- The group shows all labels in the org as checkboxes
- Selecting a label narrows results to documents carrying that label
- Multiple selected labels are AND'd
- A "Clear" link in the group clears the selection

---

## Components

### `<LabelChip>`

A reusable chip component used in lists, detail views, and pickers.

**Props:**
- `label: Label`
- `size?: 'sm' | 'md'` (default `md`)
- `onRemove?: () => void` (when present, renders the ✕ button)
- `href?: string` (when present, the chip is a link)
- `onClick?: () => void` (when present, the chip is a button)

**Visual:**
- Background: the label's color at 12% opacity
- Border: the label's color at 100%
- Text: the label's title in the label's color
- Padding: 4px 8px, border-radius 4px
- Font size: 12px (sm) or 13px (md)

### `<LabelPicker>`

See "Label Picker (reusable component)" above.

### `<LabelFilter>`

See "Document Search — Label Filter" above. Renders the checkbox group.

---

## Empty / Error States

| State | UI |
|-------|----|
| No labels in org | Empty state on the Labels page (see above) |
| No labels on a document | "No labels — add one to categorize this document" |
| Title collision on save | Inline form error |
| Delete label with documents | Confirm dialog: "12 documents will lose this label. Continue?" |
| Delete label force | Same as above with a "Force" option for admins |
| Network error on save | Toast: "Could not save label — try again" |

---

## Accessibility

- All label chips have `aria-label="Label: <title>"` for screen readers
- The color swatches in the picker have accessible names ("Red", "Blue", etc.)
- The label picker is keyboard-navigable; selection state is announced
- The delete confirmation is a proper dialog (`role="dialog"`, focus trap, escape to close)
- Color is **never** the only signal: every chip also displays the title text. Color-blind users can still distinguish labels by name.

---

## Navigation Updates

The existing sidebar (see `features/documents/web.md`) gains a "Labels" entry under the Documents section:

```
Documents
├── All Documents
├── Org Documents
├── Recent
├── Archived
├── Folders
└── Labels        ← new, deep-links to /labels (org-level)
```

For project-level documents, the same picker is available on the document detail; the org-level Labels page is the canonical place to manage the library.

---

## Related Documents

- [Labels Spec](./labels.md) — main feature spec, data model, API
- [Labels CLI](./cli.md) — CLI commands
- [Labels SDK](./sdk.md) — TypeScript SDK surface
- [Documents Web](../documents/web.md) — parent feature web interface (where most of the integration lives)
