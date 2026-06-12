---
title: Document Storage Patterns Reference
description: Analysis of how top products (Notion, Linear, GitHub) handle document storage
status: review
version: 0.1.0
category: reference
tags: [architecture, storage, reference, notion, linear, github]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead]
related:
  - features/documents/documents.md
  - features/organizations.md
  - features/projects.md
priority: medium
stability: stable
---

# Document Storage Patterns Reference

Analysis of how leading products handle document storage, based on public engineering documentation.

---

## Notion — Block Model

### Core Philosophy

Notion treats **everything as a block**: text, headings, images, databases, even full pages are the same object type. This single decision shapes the entire architecture.

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Universal block primitive | Enables composability, nesting, drag-and-drop as data operations |
| PostgreSQL storage | 96 servers, 5 logical shards (2023), partitioned by workspace ID |
| Content pointer ≠ Parent pointer | Separate render tree (content) from permissions tree (parent) |
| Optimistic local apply | Fast UI even on slow connections |
| Breadth-first API pagination | Deep trees would be too slow to fetch entirely |

### Data Model

```typescript
interface Block {
  id: string              // UUID v4
  type: string            // heading_1, paragraph, callout, etc.
  properties: object      // type-specific properties
  content: string[]       // ordered child block IDs (render tree)
  parent_id: string       // upward pointer (permissions)
}
```

### Sync Pipeline

```
1. User action → Operations → Transaction
2. Transaction applied locally (optimistic)
3. Persisted in TransactionQueue (SQLite/IndexedDB)
4. Posted to /saveTransactions
5. Server validates and commits
6. MessageStore (WebSocket) notifies subscribers
7. Clients sync via syncRecordValues
```

### Key Learnings

1. **Define atomic primitive first** — Block model enables all other features
2. **Decouple content tree from permissions** — Walking tree for permissions is slow
3. **Local persistence for offline** — RecordCache + TransactionQueue
4. **Transaction validation on server** — Before/after state comparison handles conflicts

---

## Linear — Sync Engine (LSE)

### Core Philosophy

Linear built their own sync engine for handling arbitrary data models with rich features (partial sync, permissions, undo/redo, offline, history) without the complexity of OT or CRDTs.

### Why Not OT or CRDT?

| Approach | Problem |
|----------|---------|
| **OT (Operational Transform)** | Complex, overkill for simple use cases (user info, metadata) |
| **CRDT** | Metadata overhead, hard to manage partial sync and permissions |

### Key Requirements for Sync Engine

1. **Arbitrary data models** — Adaptable to many scenarios
2. **Rich features** — Partial sync, permissions, undo/redo, offline, history
3. **Great DX** — ORM-like model definitions, no expert knowledge required

### Sync Features

- Real-time simultaneous edits
- Offline availability
- Edit history
- Partial syncing (subset of files based on permissions)
- Permission control

### Key Learnings

1. **Don't use OT/CRDT blindly** — Match sync approach to data model complexity
2. **Partial sync is essential** — Users should only sync data they have access to
3. **Abstract complexity** — Linear Sync Engine provides intuitive API hiding complexity

---

## GitHub — Repository Storage

### Core Philosophy

GitHub uses standard Git protocol with distributed storage (Spokes), routing proxy, and MySQL for metadata. Repositories are replicated across three copies.

### Architecture Overview

```
Developer → DNS + Anycast → Load Balancer → Auth → Rails API
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              DGit Proxy          MySQL Metadata
                                    ↓
                              Spokes (Storage)
                                    ↓
                              Git Repository Files
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **Spokes** | Distributed storage system, 3 replicas per repo |
| **DGit** | Routing proxy layer in front of storage |
| **MySQL** | Metadata (permissions, issues, PRs) |
| **Rails API** | Permissions and routing logic |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Git-native storage | Leverages Git's built-in delta compression |
| 3 replicas | Fault tolerance, geographic distribution |
| DGit proxy | Routing to correct storage node |
| MySQL for metadata | Separates content (Git) from data (issues, PRs) |

### Key Learnings

1. **Leverage existing protocols** — Git-native means built-in compression, delta storage
2. **Separate content from metadata** — Git for content, relational DB for data
3. **Replication for reliability** — Three copies enable maintenance without downtime

---

## Pattern Summary

### Storage Layer

| Product | Storage | Sharding Strategy |
|---------|---------|-------------------|
| Notion | PostgreSQL (RDS) | By workspace ID |
| GitHub | Git (custom) + MySQL | 5 logical shards per workspace |
| Linear | Custom sync engine | Partial sync per user |

### Content Model

| Product | Atomic Unit | Hierarchy |
|---------|-------------|-----------|
| Notion | Block | Content pointer + parent pointer |
| GitHub | Blob/Tree | Git tree structure |
| Linear | Entity | Flat with relationships |

### Sync Strategy

| Product | Sync Mechanism | Offline |
|---------|----------------|---------|
| Notion | WebSocket (MessageStore) + local cache | RecordCache + TransactionQueue |
| Linear | Custom sync engine (LSE) | Built-in |
| GitHub | Git protocol | Native Git |

---

## Recommendations for Nesalia

Based on analysis, here's what we should consider:

### 1. Document Model

**Option A: Block Model (Notion-style)**
- Pros: Maximum flexibility, nesting, transformation
- Cons: Complex sync, API design, pagination
- Best for: Collaborative rich text editing

**Option B: Simple Document Model (Linear-style)**
- Pros: Simpler, faster, easier sync
- Cons: Less flexible for complex nesting
- Best for: Structured documents (specs, contracts)

**Option C: Hybrid (Recommended)**
- Org-level: Simple documents (handbooks, policies)
- Project-level: Block model for rich content (meeting notes, specs)
- Agents: Semantic chunks for RAG

### 2. Storage Recommendation

```
Organization level:
├── PostgreSQL (shared) for metadata
├── S3-compatible for file storage
└── Redis for caching

Project level:
├── PostgreSQL with project partitioning
├── Vector store for semantic search (future)
└── S3 for large file uploads
```

### 3. Sync Recommendation

| Scenario | Approach |
|----------|----------|
| Real-time collaboration | WebSocket + operational transforms |
| Offline support | Local SQLite/IndexedDB cache |
| Background sync | Queue-based with retry |
| Permission-aware | Server validates before commit |

### 4. Key Architectural Decisions

1. **Decouple content from permissions** — Content tree ≠ permissions tree
2. **Local persistence for responsiveness** — Cache reads, queue writes
3. **Server-side validation** — Client optimistic, server confirms
4. **Breadth-first pagination** — Don't fetch entire trees
5. **Soft delete by default** — Archive, don't delete

---

## Key Sources

- [Notion Engineering: Data Model](https://www.notion.so/blog)
- [Linear Sync Engine Analysis](https://dev.to/wzhudev)
- [GitHub Engineering: DGit](https://github.blog/engineering/architecture-optimization/introducing-dgit/)
- [How GitHub Stores Repositories](https://singhajit.com)

---

## Related Documents

- [Documents](./documents.md) — Our document feature spec
- [Organizations](../organizations.md) — Org-level structure
- [Projects](../projects.md) — Project-level structure