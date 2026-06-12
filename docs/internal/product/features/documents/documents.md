---
title: Documents
description: Org-level and project-level document management
status: in-progress
version: 0.2.0
category: core
tags: [documents, storage, content, markdown]
author: Product Team
created: 2026-12
updated: 2026-06-12
reviewers: [eng-lead, design-lead]
related:
  - features/organizations.md
  - features/projects.md
  - features/agents.md
  - features/documents/cli.md
priority: high
stability: experimental
requires:
  - organizations
  - projects
impact:
  users: all
  complexity: medium
---

# Documents

## Overview

Documents are the primary content unit in Nesalia. They exist at two levels — organization and project — and serve as knowledge bases that agents can read and reference.

## Document Levels

| Level | Scope | Visibility | Use Cases |
|-------|-------|------------|-----------|
| **Organization** | All projects in org | Org members | Handbooks, policies, templates, org-wide knowledge |
| **Project** | Single project | Project members | Specs, contracts, meeting notes, project docs |

### Visual Hierarchy

```
Organization
├── 📄 Documents (org-level)
│   ├── Team Handbook
│   ├── Onboarding Guide
│   └── Project Templates
│
├── 📁 Project "Client A"
│   ├── 📄 Documents (project-level)
│   │   ├── Contract
│   │   └── Specs
│   └── 🤖 Agents
│
└── 📁 Project "Client B"
    ├── 📄 Documents (project-level)
    │   ├── Contract
    │   └── Specs
    └── 🤖 Agents
```

## Document Types

### Organization-Level Types

| Type | Description | Examples |
|------|-------------|----------|
| `handbook` | Team procedures | Onboarding, code style, processes |
| `policy` | Rules and guidelines | Security policy, data retention |
| `template` | Reusable document templates | Meeting notes, project briefs |
| `note` | General notes | Meeting summaries, decisions |
| `knowledge` | Reference material | Architecture docs, runbooks |

### Project-Level Types

| Type | Description | Examples |
|------|-------------|----------|
| `spec` | Project specifications | Requirements, technical specs |
| `contract` | Legal documents | NDAs, SOWs, invoices |
| `note` | Project notes | Meeting notes, decisions |
| `knowledge` | Project knowledge | Context, background, research |

**Note:** File attachments are out of scope for initial implementation. Documents are markdown only.

## Features

### 1. Document Creation

**Org-level creation:**
1. User navigates to Organization → Documents
2. Click "New Document"
3. Select type and enter name
4. Add content (markdown, rich text, or upload)
5. Set visibility (all members or admins only)
6. Document created and visible to org members

**Project-level creation:**
1. User navigates to Project → Documents
2. Click "New Document"
3. Select type and enter name
4. Add content or upload file
5. Document created and visible to project members

### 2. Document Editor

**Supported formats:**
- Markdown only (stored in database, like GitHub)

**Editor features:**
- Auto-save (every 30 seconds)
- Markdown preview
- Simple toolbar for common formatting

### 3. Document Organization

**Organization:**
- Folder structure (optional)
- Tags for cross-project filtering
- Search across all documents
- Sort by: name, date, type, author

**Filters:**
- By type
- By author
- By date range
- By tags

### 4. Document Sharing

**Sharing options:**
- **All org members** — Visible to everyone (org-level default)
- **Project members only** — Visible to project members
- **Specific members** — Shared with selected users
- **Public link** — Read-only link (optional)

**Sharing flow:**
```
Document settings → Sharing
├── 👥 All [Org/Project] members (default)
├── 🔒 Specific members
├── 🔗 Public link (optional)
└── 🚫 Private (creator only)
```

### 5. Document Search

**Search capabilities:**
- Full-text search across all accessible documents
- Filter by: level, type, project, tags, author
- AI-powered semantic search (future)

**Search UI:**
```
🔍 Search documents...
├── All documents
├── [Org] Team Handbook
├── [Project: Client A] Contract
└── [Tags: important] ...
```

### 6. Document Versioning

**Note:** Version history is out of scope for initial implementation. Documents are stored as markdown in the database with auto-save only.

**Future consideration:**
- Manual "Save version" for milestones
- Restore previous versions
- Compare versions (diff view)

### 7. Document Archival

**Soft delete:**
- Archived documents are hidden
- Accessible via "Archived" filter
- Can be restored
- Permanent deletion after 30 days

**Project deletion:**
- Archiving project archives its documents
- Documents preserved for recovery

### 8. Document Movement

**Move between levels:**
- Org document → Project (assign to project)
- Project document → Org (move up)

**Move between projects:**
- Project document → Another project (with permission)

**Movement flow:**
```
Document → Move
├── To organization level
├── To project: [Select project]
└── Cancel
```

## Agent Integration

### Document Context

Agents can read and reference documents:

```typescript
interface AgentDocumentContext {
  documentId: string
  projectId: string
  accessLevel: 'read' | 'write'
  lastIndexed: Date
}
```

### RAG (Retrieval-Augmented Generation)

Documents feed into agent context:
1. Agent receives query
2. System searches relevant documents
3. Relevant chunks sent to LLM
4. Agent responds with document context

### Document Indexing

**Automatic indexing:**
- New documents indexed on creation
- Changes trigger re-index
- Full-text and semantic indexing

**Index configuration:**
- Index frequency (real-time, hourly, daily)
- Chunk size for semantic search
- Metadata included in index

## Data Model

### Base Document Entity

```typescript
interface BaseDocument {
  id: string
  name: string
  type: string
  content: string | null        // For text documents
  fileUrl: string | null        // For file uploads
  mimeType: string | null
  size: number | null           // In bytes
  createdBy: string
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
  metadata: {
    tags: string[]
    language: string
    indexedAt: Date | null
  }
}
```

### Organization Document Entity

```typescript
interface OrganizationDocument extends BaseDocument {
  organizationId: string
  visibility: 'all' | 'admins_only'
  folderId: string | null
  versionCount: number
}
```

### Project Document Entity

```typescript
interface ProjectDocument extends BaseDocument {
  projectId: string
  visibility: 'all' | 'editors_only'
  folderId: string | null
  versionCount: number
}
```

### Document Folder Entity

```typescript
interface DocumentFolder {
  id: string
  organizationId: string
  projectId: string | null      // null for org-level folders
  name: string
  parentId: string | null       // For nested folders
  createdBy: string
  createdAt: Date
}
```

## Permissions

### Organization-Level Documents

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| View documents | ✓ | ✓ | ✓ |
| Create documents | ✓ | ✓ | ✓ |
| Edit documents | ✓ | ✓ | Own only |
| Delete documents | ✓ | ✓ | Own only |
| Set visibility | ✓ | ✓ | ✗ |
| Admin-only docs | ✓ | ✓ | ✗ |

### Project-Level Documents

| Action | Proj Admin | Proj Editor | Proj Viewer |
|--------|------------|-------------|-------------|
| View documents | ✓ | ✓ | ✓ |
| Create documents | ✓ | ✓ | ✗ |
| Edit documents | ✓ | ✓ | ✗ |
| Delete documents | ✓ | Own only | ✗ |
| Move documents | ✓ | ✗ | ✗ |

## API Design

### Endpoints

```bash
# Organization Documents
GET    /api/v1/organizations/:orgId/documents
POST   /api/v1/organizations/:orgId/documents
GET    /api/v1/organizations/:orgId/documents/:docId
PATCH  /api/v1/organizations/:orgId/documents/:docId
DELETE /api/v1/organizations/:orgId/documents/:docId

# Project Documents
GET    /api/v1/projects/:projectId/documents
POST   /api/v1/projects/:projectId/documents
GET    /api/v1/projects/:projectId/documents/:docId
PATCH  /api/v1/projects/:projectId/documents/:docId
DELETE /api/v1/projects/:projectId/documents/:docId

# Document Operations
POST   /api/v1/documents/:docId/move        # Move between levels/projects
POST   /api/v1/documents/:docId/archive    # Archive document
POST   /api/v1/documents/:docId/restore    # Restore archived
GET    /api/v1/documents/:docId/versions   # List versions
POST   /api/v1/documents/:docId/versions   # Create version
GET    /api/v1/documents/:docId/versions/:versionId  # Get specific version

# Search
GET    /api/v1/documents/search?q=...&projectId=...&type=...

# Folders
GET    /api/v1/organizations/:orgId/document-folders
POST   /api/v1/organizations/:orgId/document-folders
GET    /api/v1/projects/:projectId/document-folders
POST   /api/v1/projects/:projectId/document-folders
```

### Request/Response Shapes

```typescript
// Create document request
interface CreateDocumentRequest {
  name: string
  type: string
  content?: string
  file?: File  // For uploads
  visibility?: 'all' | 'admins_only' | 'editors_only'
  tags?: string[]
  folderId?: string
}

// Document response
interface DocumentResponse {
  data: OrganizationDocument | ProjectDocument
  createdBy: User
  versionCount: number
  permissions: DocumentPermissions
}

// Search response
interface DocumentSearchResponse {
  data: Document[]
  pagination: {
    page: number
    perPage: number
    total: number
  }
  highlights: {
    documentId: string
    matches: string[]
  }[]
}
```

## UX Design

### Document List View

**Layout:** Table with columns

| Name | Type | Author | Updated | Actions |
|------|------|--------|---------|---------|
| Team Handbook | handbook | Alice | 2h ago | ... |
| Contract | contract | Bob | 1d ago | ... |
| Specs | spec | Charlie | 3d ago | ... |

**Features:**
- Sort by any column
- Quick preview on hover
- Bulk actions (archive, delete, move)
- Filter sidebar

### Document Detail View

**Layout:** Two-column

```
┌─────────────────────────────────────────────────────────┐
│ Team Handbook                        [Edit] [Share] [...]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ # Team Handbook                                        │
│                                                         │
│ ## Onboarding                                          │
│                                                         │
│ Welcome to the team! This handbook covers...           │
│                                                         │
│ ## Code Style                                           │
│                                                         │
│ - Use TypeScript for all new code                      │
│ - Follow our naming conventions...                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 📄 Related Documents    | 🏷️ Tags: onboarding, policy  │
│ - Onboarding Guide      | 📅 Created: Jan 15, 2026     │
│ - Security Policy       | 👤 By: Alice               │
└─────────────────────────────────────────────────────────┘
```

### Empty States

**No documents:**
```
┌─────────────────────────────────────┐
│                                     │
│   📄                               │
│                                     │
│   No documents yet                 │
│                                     │
│   Create your first document or     │
│   upload files to get started.      │
│                                     │
│   [Create Document] [Upload File]  │
│                                     │
└─────────────────────────────────────┘
```

**No search results:**
```
┌─────────────────────────────────────┐
│                                     │
│   🔍                               │
│                                     │
│   No results for "budget"          │
│                                     │
│   Try different keywords or         │
│   check your filters.              │
│                                     │
│   [Clear filters]                  │
│                                     │
└─────────────────────────────────────┘
```

### Drag & Drop Upload

**Upload zone:**
- Drag files to upload
- Or click to browse
- Progress indicator for uploads
- Auto-categorization based on file type

## Storage & Limits

### Storage Limits

| Plan | Storage | Max File Size |
|------|---------|---------------|
| Free | 1 GB | 10 MB |
| Pro | 50 GB | 100 MB |
| Enterprise | 500 GB | 1 GB |

### File Type Support

| Category | Types |
|----------|-------|
| Documents | .md, .txt, .pdf, .doc, .docx |
| Images | .jpg, .png, .gif, .svg |
| Data | .csv, .json, .xml |
| Archives | .zip (extraction for indexing) |

## Edge Cases

### Large Documents
- Chunking for semantic indexing (max 10k tokens per chunk)
- Lazy loading for long documents
- Progressive rendering

### Concurrent Editing
- Last-write-wins for simple edits
- Conflict detection with merge option (future)
- Lock mechanism for critical documents (future)

### Deleted References
- If agent references deleted doc → graceful fallback
- "Document not found" shown in agent response
- Option to recover from archive

## CLI Commands

See [Documents CLI Reference](./cli.md) for complete CLI documentation.

**Quick Reference:**

| Command | Description |
|---------|-------------|
| `nesalia docs list` | List documents |
| `nesalia docs get` | Get document details |
| `nesalia docs create` | Create document |
| `nesalia docs update` | Update document |
| `nesalia docs upload` | Upload file |
| `nesalia docs archive` | Archive document |
| `nesalia docs restore` | Restore archived |
| `nesalia docs delete` | Delete document |
| `nesalia docs move` | Move between levels |
| `nesalia docs search` | Search documents |
| `nesalia docs versions` | Manage versions |
| `nesalia docs folders` | Manage folders |
| `nesalia docs share` | Share document |
| `nesalia docs export` | Export document |

## Future Enhancements

### Short Term
- Real-time collaborative editing
- Document templates marketplace
- Enhanced search with filters

### Medium Term
- AI document summarization
- Automatic tagging
- Document comparison (diff view)

### Long Term
- Semantic search (vector embeddings)
- Document recommendations
- Automated document classification

## Metrics

| Metric | Target |
|--------|--------|
| Document creation time | < 2s |
| Document load time | < 500ms |
| Search response time | < 300ms |
| Upload speed (per MB) | > 5 MB/s |

## Success Criteria

1. **Documents are findable** — Search and filters work well
2. **Documents are accessible** — Permissions respected everywhere
3. **Documents feed agents** — RAG integration works smoothly
4. **Documents are organized** — Folders and tags help navigation
5. **Documents are safe** — Soft delete preserves data

## Related Documents

- [CLI Reference](./cli.md) — Complete CLI documentation
- [Storage Reference](./storage-reference.md) — How Notion, Linear, GitHub handle document storage
- [Organizations](../organizations.md) — Org-level structure
- [Projects](../projects.md) — Project-level structure