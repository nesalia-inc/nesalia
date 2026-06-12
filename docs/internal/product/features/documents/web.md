---
title: Documents Web Interface
description: Page structure and content for document management in the web app
status: in-progress
version: 0.2.0
category: web
tags: [documents, web, pages, structure]
author: Product Team
created: 2026-12
updated: 2026-06-12
reviewers: [eng-lead, design-lead]
related:
  - features/documents/documents.md
  - features/documents/cli.md
  - features/documents/storage-reference.md
priority: high
stability: experimental
requires:
  - features/documents/documents.md
impact:
  users: all
  complexity: medium
---

# Documents Web Interface

## Overview

Web interface for managing organization and project documents. Covers page structure, routing, and content organization.

---

## Pages

### Organization Documents Page

**Route:** `/{orgSlug}/documents`

**Purpose:** Browse and manage org-level documents

**Contains:**
- Page title with org name
- "New Document" button
- Search bar with filters (type, tags, author, date)
- Document list/grid view toggle
- Document table: name, type, author, last modified, actions menu
- Quick access section for recently edited documents
- Folder navigation sidebar
- Pagination or infinite scroll

**Actions:**
- Create new document
- Edit document
- Delete/archive document
- Move document
- Share document
- Filter/search documents
- Upload file

---

### Project Documents Page

**Route:** `/{orgSlug}/projects/[projectSlug]/documents`

**Purpose:** Browse and manage project-level documents

**Contains:**
- Page title with project name
- "New Document" button
- Folder dropdown selector
- Search bar with filters
- Document list: name, type, author, last modified, actions
- Drag & drop upload zone
- File upload progress indicator

**Actions:**
- Create new document
- Edit document
- Delete/archive document
- Move document between projects
- Upload files
- Create/manage folders

---

### Document Detail Page

**Route:** `/{orgSlug}/documents/[documentId]`

**Purpose:** View document content and metadata

**Contains:**
- Back navigation breadcrumb
- Document title (editable inline)
- Document content (markdown rendered or rich text)
- Right sidebar:
  - Related documents list
  - Tags section with add/remove
  - Document info (created date, author, version count, last modified)
  - Sharing settings
- Toolbar: Edit, Share, Download, Move, Archive, More actions

**Actions:**
- Edit document
- Share document
- Download as PDF/Markdown/JSON
- Move document
- Archive document
- View version history
- Add/remove tags
- Copy document link

---

### Document Editor

**Route:** `/{orgSlug}/documents/[documentId]/edit` or inline edit modal

**Purpose:** Edit document content

**Contains:**
- Document title input
- Markdown editor with toolbar:
  - Bold, italic, strikethrough
  - Headings (H1-H3)
  - Bullet list, numbered list
  - Code block, inline code
  - Link
- Auto-save indicator
- Preview mode toggle
- Cancel and Save buttons

**Actions:**
- Save document
- Cancel editing
- Preview mode toggle

---

### Document Search Results

**Route:** `/{orgSlug}/documents/search?q=...` or inline results

**Purpose:** Find documents across org and projects

**Contains:**
- Search input with active filters displayed
- Filter sidebar: type, level (org/project), project, tags, author, date range
- Results list:
  - Document name (with highlight)
  - Document type badge
  - Parent org/project
  - Content snippet with match highlight
  - Last modified date
- Result count and pagination

**Actions:**
- Filter results
- Clear filters
- Navigate to document
- Save search (future)

---

### Upload Progress Page / Modal

**Purpose:** Show file upload status

**Contains:**
- File list with individual progress bars
- Upload status per file: pending, uploading, complete, error
- Error message for failed uploads
- Retry button for failed uploads
- Cancel upload option
- Storage quota indicator (if applicable)

**Actions:**
- Retry failed upload
- Cancel upload
- Close modal after completion

---

### Folder Management

**Route:** Part of document pages or separate `/{orgSlug}/documents/folders`

**Purpose:** Organize documents into folders

**Contains:**
- Folder tree view (nested structure)
- Create folder button
- Folder actions: rename, delete, move contents
- Drag & drop to move documents between folders
- Folder breadcrumb for current location

**Actions:**
- Create folder
- Rename folder
- Delete folder
- Move documents to folder
- Reorder folders

---

## Navigation Structure

```
Organization
├── Documents
│   ├── /{orgSlug}/documents
│   ├── /{orgSlug}/documents/[documentId]
│   ├── /{orgSlug}/documents/[documentId]/edit
│   └── /{orgSlug}/documents/search
└── Projects
    └── [Project]
        └── Documents
            └── /{orgSlug}/projects/[projectSlug]/documents
```

---

## Global Elements

### Header
- Organization name and logo
- Global search (Cmd/Ctrl + K)
- User menu
- Notifications

### Sidebar Navigation
- Dashboard link
- Documents link (expandable)
  - All Documents
  - Org Documents
  - Recent
  - Archived
- Projects list
- Settings
- Billing

### Context Menu (Right-click)
- Open
- Edit
- Copy link
- ---
- Move
- Duplicate
- ---
- Add tags
- ---
- Download
- Archive
- Delete

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| New document | Cmd/Ctrl + N |
| Save | Cmd/Ctrl + S |
| Search | Cmd/Ctrl + K |
| Archive | Cmd/Ctrl + Shift + D |

---

## Related Documents

- [Documents Feature](./documents.md) — Complete feature specification
- [Documents CLI](./cli.md) — CLI commands reference
- [Storage Patterns](./storage-reference.md) — How Notion, Linear, GitHub handle document storage