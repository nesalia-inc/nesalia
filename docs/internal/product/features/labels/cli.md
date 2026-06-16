---
title: Labels CLI Reference
description: CLI commands for label management and document-label assignment
status: draft
version: 0.1.0
category: cli
tags: [cli, labels, commands, documents]
author: Product Team
created: 2026-06-15
updated: 2026-06-16
reviewers: [eng-lead]
related:
  - features/labels/labels.md
  - features/labels/web.md
  - features/labels/sdk.md
  - features/documents/cli.md
priority: high
stability: experimental
requires:
  - features/labels/labels.md
impact:
  users: all
  complexity: low
---

# Labels CLI Reference

CLI commands for managing the per-organization label library and applying labels to documents. Sits under a new top-level `nesalia labels ...` namespace, plus document-label operations under `nesalia docs ...`.

> **Note:** The legacy `--tags` flag on `nesalia docs create/update` and the `--tags` filter on `nesalia docs list` are removed in v1. The old `metadata.tags: string[]` field on documents is dropped on rollout; old data is discarded. Use the commands in this document instead.

---

## Label Management

### List Labels

```bash
# List all labels in the current org
nesalia labels list

# List in a specific org
nesalia labels list --org my-org

# Output as JSON
nesalia labels list --json
```

> Labels are listed in **case-insensitive alphabetical order by title** (the same order used everywhere labels render). There is no `--sort` or `--color` filter — keep the list output simple and predictable.

### Get Label

```bash
# Get by title or ID
nesalia labels get "Legal"

# Get with document count
nesalia labels get "Legal" --include-count

# Output as JSON
nesalia labels get "Legal" --json
```

### Create Label

```bash
# Minimal
nesalia labels create "Legal" --color red

# With description
nesalia labels create "Finance" --color green --description "Documents related to financial planning and budgets"

# Skip confirmation if a collision would occur
nesalia labels create "Onboarding" --color blue --force
```

### Update Label

```bash
# Rename
nesalia labels update "Legal" --to "Legal Review"

# Change color
nesalia labels update "Legal" --color orange

# Set description
nesalia labels update "Legal" --description "Apply to documents that need legal sign-off"

# Update multiple fields at once
nesalia labels update "Legal" --to "Legal Review" --color orange --description "..."
```

### Delete Label

```bash
# Delete a label that is not in use (fails if documents carry it)
nesalia labels delete "Old Label"

# Force delete — detaches from all documents, then deletes
nesalia labels delete "Old Label" --force

# Skip confirmation
nesalia labels delete "Old Label" --force --yes
```

---

## Document-Label Assignment

These commands update the labels on a document. They replace the legacy `--tags` flag on `nesalia docs create/update`.

### Set Labels on a Document

```bash
# Replace the full label set
nesalia docs labels set handbook-team --labels "Legal,Onboarding"

# Clear all labels
nesalia docs labels set handbook-team --labels ""

# Shorthand: pass a comma-separated list
nesalia docs labels set contract-123 --labels "Legal,Finance"
```

### Add a Single Label

```bash
# By label title
nesalia docs labels add handbook-team --label "Legal"

# By label ID
nesalia docs labels add handbook-team --label-id lbl_abc123
```

### Remove a Single Label

```bash
nesalia docs labels remove handbook-team --label "Legal"
```

### List Labels on a Document

```bash
nesalia docs labels list handbook-team

# JSON output
nesalia docs labels list handbook-team --json
```

---

## Filtering and Search

The existing `nesalia docs list` and `nesalia docs search` commands gain `--label` as a first-class filter, replacing `--tags`.

```bash
# Filter by a single label
nesalia docs list --label "Legal"

# Filter by multiple labels (AND'd)
nesalia docs list --label "Legal" --label "Finance"

# Search within a label
nesalia docs search "contract" --label "Legal"

# Combine with other filters
nesalia docs list --org my-org --type handbook --label "Onboarding"
```

> **Open question:** the multi-label filter is AND-only in v1 (see [Open Questions](./labels.md#open-questions) #3). An `--any` flag for OR is a v2 enhancement.

---

## Color Reference

The 12 fixed colors:

| Color | CLI value | Suggested use |
|-------|-----------|---------------|
| 🔴 Red | `red` | Legal, urgent, blocked |
| 🟠 Orange | `orange` | Review, attention |
| 🟡 Yellow | `yellow` | Draft, in progress |
| 🟢 Green | `green` | Approved, done |
| 🟦 Teal | `teal` | Info, FYI |
| 🔵 Blue | `blue` | Default, generic |
| 🟣 Indigo | `indigo` | Internal, team-only |
| 🟪 Purple | `purple` | Strategy, planning |
| 🌸 Pink | `pink` | Personal, optional |
| 🟫 Brown | `brown` | Archive, deprecated |
| ⚫ Gray | `gray` | Neutral, default |
| ⚫ Black | `black` | Restricted, confidential |

> Colors are mapped to fixed CSS variables; the CLI accepts the CLI value (e.g., `--color red`).

---

## Flags Reference

### Label Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--color <name>` | Color from the 12-color palette (used by `create` and `update`) | `--color red` |
| `--description <text>` | Description text (0-500 chars) | `--description "..."` |
| `--to <title>` | New title (for `update`) | `--to "Legal Review"` |
| `--force` | Force delete (detach from documents) | `--force` |
| `--yes` / `--confirm` | Skip confirmation prompts | `--yes` |
| `--include-count` | Include document count in `get` | `--include-count` |

### Document-Label Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--labels <list>` | Comma-separated list of label titles | `--labels "Legal,Finance"` |
| `--label <title>` | A single label title (for `add`/`remove`/`filter`) | `--label "Legal"` |
| `--label-id <id>` | A single label ID | `--label-id lbl_abc123` |

---

## Examples

### Onboarding a New Org

```bash
# 1. Create the canonical label library
nesalia labels create "Legal"     --color red    --description "Needs legal review"
nesalia labels create "Finance"   --color green  --description "Budget and planning"
nesalia labels create "Onboarding" --color blue  --description "New joiner docs"
nesalia labels create "Archive"   --color brown  --description "Deprecated content"

# 2. Apply labels to existing documents
nesalia docs labels set contract-123    --labels "Legal"
nesalia docs labels set budget-2026     --labels "Finance"
nesalia docs labels set welcome-guide   --labels "Onboarding"

# 3. Verify
nesalia labels list
nesalia docs list --label "Legal"
```

### Reorganizing Labels

```bash
# Rename a label (preserves all its document assignments)
nesalia labels update "Legal" --to "Legal Review"

# Recolor
nesalia labels update "Archive" --color gray

# Add a description retroactively
nesalia labels update "Finance" --description "Budget and planning docs"
```

### Cleanup

```bash
# Delete a label no longer used
nesalia labels delete "Old Label"

# Force-delete a label still in use (detaches from all documents)
nesalia labels delete "Deprecated" --force
```

---

## Error Output

When a command fails, the CLI writes a structured error to **stderr**, exits with a non-zero code, and writes nothing to **stdout** (unless `--json` is set, in which case the JSON error object is written to **stdout** so it can be piped to `jq`).

### Default (human-readable)

```
$ nesalia labels create "Legal" --color red
✗ Error: A label with this title already exists
  Code: LABEL_TITLE_COLLISION
  Status: 409
  Suggestion: Use a different title, or update the existing label with `nesalia labels update "Legal" --color red`.
```

- The first line is the human-readable message.
- `Code` is a stable identifier (use it for scripting).
- `Status` mirrors the HTTP status code returned by the API.
- `Suggestion` is an actionable hint, when one is available.

### JSON (with `--json`)

```json
{
  "error": {
    "code": "LABEL_TITLE_COLLISION",
    "message": "A label with this title already exists",
    "status": 409,
    "details": {
      "organizationId": "org_abc",
      "title": "Legal"
    },
    "suggestion": "Use a different title, or update the existing label with `nesalia labels update \"Legal\" --color red`."
  }
}
```

The shape is stable: `error.code`, `error.message`, and `error.status` are always present; `error.details` and `error.suggestion` are optional.

### Exit Codes

| Code | Meaning | Example errors |
|------|---------|----------------|
| 0 | Success | — |
| 1 | Generic / unexpected error | Network failure, server 500, JSON parse error |
| 2 | Invalid usage | Missing flag, unknown subcommand, malformed input |
| 3 | Resource not found | `LABEL_NOT_FOUND`, `DOCUMENT_NOT_FOUND` |
| 4 | Label title collision | `LABEL_TITLE_COLLISION` |
| 5 | Label in use | `LABEL_IN_USE` (use `--force`) |
| 6 | Permission denied | `LABEL_FORBIDDEN`, `UNAUTHORIZED` |
| 7 | Invalid color | `LABEL_COLOR_INVALID` (color not in the 12-color palette) |

### Examples by Error Code

#### `LABEL_TITLE_INVALID` (exit 2)

```
$ nesalia labels create "" --color red
✗ Error: Label title is required
  Code: LABEL_TITLE_INVALID
  Status: 400
```

```
$ nesalia labels create "$(printf 'x%.0s' {1..60})" --color red
✗ Error: Label title must be 50 characters or fewer
  Code: LABEL_TITLE_INVALID
  Status: 400
```

#### `LABEL_COLOR_INVALID` (exit 7)

```
$ nesalia labels create "Legal" --color crimson
✗ Error: Color must be one of: red, orange, yellow, green, teal, blue, indigo, purple, pink, brown, gray, black
  Code: LABEL_COLOR_INVALID
  Status: 400
```

#### `LABEL_TITLE_COLLISION` (exit 4)

```
$ nesalia labels create "Legal" --color red
✗ Error: A label with this title already exists
  Code: LABEL_TITLE_COLLISION
  Status: 409
  Suggestion: Use a different title, or update the existing label with `nesalia labels update "Legal" --color red`.
```

#### `LABEL_NOT_FOUND` (exit 3)

```
$ nesalia labels update "NoSuchLabel" --color red
✗ Error: Label not found
  Code: LABEL_NOT_FOUND
  Status: 404
```

#### `LABEL_FORBIDDEN` (exit 6)

```
$ nesalia labels create "Legal" --color red --org other-org
✗ Error: You don't have permission to manage labels in this organization
  Code: LABEL_FORBIDDEN
  Status: 403
```

#### `LABEL_IN_USE` (exit 5)

```
$ nesalia labels delete "Legal"
✗ Error: This label is in use by 12 documents
  Code: LABEL_IN_USE
  Status: 409
  Suggestion: Use --force to detach the label from all documents, then delete.
```

#### `UNAUTHORIZED` (exit 6)

```
$ nesalia labels list
✗ Error: Authentication required
  Code: UNAUTHORIZED
  Status: 401
  Suggestion: Run `nesalia auth login` to authenticate.
```

#### `DOCUMENT_NOT_FOUND` (exit 3)

```
$ nesalia docs labels add nonexistent-doc --label "Legal"
✗ Error: Document not found
  Code: DOCUMENT_NOT_FOUND
  Status: 404
```

### Streams

| Stream | Default mode | `--json` mode |
|--------|--------------|---------------|
| **stdout** | nothing | the JSON error object (so `\| jq` works) |
| **stderr** | the human-readable error block | nothing |
| **Exit code** | non-zero | non-zero |

### TTY vs. Piped Output

When stderr is a TTY (interactive terminal), the error block is colorized:

- `✗` is rendered in red
- `Code:` and `Status:` lines are dimmed
- `Suggestion:` line is rendered in yellow

When output is piped or redirected (e.g., `> file`, `| jq`, `| less`), no ANSI color codes are emitted — the output is clean text or clean JSON. This is determined by whether stderr is a TTY; `--no-color` forces plain output regardless.

---

## Related Documents

- [Labels Spec](./labels.md) — main feature spec
- [Labels Web](./web.md) — web surface
- [Labels SDK](./sdk.md) — TypeScript SDK surface
- [Documents CLI](../documents/cli.md) — parent feature CLI (the legacy `--tags` flag is documented there)
