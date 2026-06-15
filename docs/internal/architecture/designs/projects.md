# Projects Technical Plan

## Overview

Projects are the primary organizational unit for agents, documents, and workflows within an organization. They provide isolated contexts with fine-grained access control.

**Product Spec:** `docs/internal/product/features/projects/projects.md`
**Status:** Draft — pending Head of Product review

---

## Current State

### Existing Components

| Component | Status | Notes |
|-----------|--------|-------|
| **DB Schema** | ✅ | `organization`, `member`, `documents`, `organizationDocuments` tables |
| **API (tRPC)** | ✅ | `organizations`, `organizationDocuments` routers |
| **SDK** | ✅ | `organizations`, `documents` operations |
| **CLI** | ✅ | `nesalia org *`, `nesalia orgs docs *` commands |
| **Web UI** | ✅ | `/[orgSlug]` dashboard, `/[orgSlug]/docs/*` pages |

### What Needs to Change

| Component | Change Required |
|-----------|---------------|
| **DB Schema** | Add `projects`, `project_members` tables |
| **API (tRPC)** | Add `projects` router |
| **SDK** | Add `projects` operations |
| **CLI** | Add `nesalia orgs projects *` commands |
| **Web UI** | Add `/[orgSlug]/projects/*` pages |

---

## Data Model

### New Tables

#### projects

```typescript
export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 20 }).notNull(), // 'client' | 'internal' | 'personal'
    status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' | 'archived'
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
    archivedAt: timestamp("archived_at"), // soft delete
  },
  (table) => [
    index("projects_organization_idx").on(table.organizationId),
    index("projects_status_idx").on(table.status),
    index("projects_archived_idx").on(table.archivedAt),
  ],
);
```

#### project_members

```typescript
export const projectMembers = pgTable(
  "project_members",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(), // 'viewer' | 'editor' | 'admin'
    addedAt: timestamp("added_at").$defaultFn(() => new Date()).notNull(),
  },
  (table) => [
    index("project_members_project_idx").on(table.projectId),
    index("project_members_user_idx").on(table.userId),
    uniqueIndex("project_members_unique").on(table.projectId, table.userId),
  ],
);
```

### Relations

```typescript
// Projects relations
export const projectRelations = relations(projects, ({ one, many }) => ({
  organization: one(organization, {
    fields: [projects.organizationId],
    references: [organization.id],
  }),
  members: many(projectMembers),
}));

// Project members relations
export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(user, {
    fields: [projectMembers.userId],
    references: [user.id],
  }),
}));

// Extend existing relations
organizationRelations: add `projects: many(projects)`
userRelations: add `projectMemberships: many(projectMembers)`
```

### Project Settings (Deferred)

The product spec includes `ProjectSettings` with API keys, integrations, and limits. This is **deferred to v2** — MVP focuses on core CRUD + members only.

---

## API Design

### Router Structure

```typescript
// packages/api/src/routers/projects.ts
export const projectsRouter = createTRPCRouter({
  // Core CRUD
  list: protectedProcedure,
  get: protectedProcedure,
  create: protectedProcedure, // org admin only
  update: protectedProcedure, // project admin only
  archive: protectedProcedure,
  restore: protectedProcedure,
  delete: protectedProcedure,

  // Members
  members: createTRPCRouter({
    list: protectedProcedure,
    add: protectedProcedure,    // project admin only
    update: protectedProcedure,  // project admin only
    remove: protectedProcedure, // project admin only
  }),
});
```

### Procedures

| Procedure | Auth | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `list` | protected | `{ orgId, status?, type? }` | `Project[]` | List projects in org |
| `get` | protected | `{ id }` | `ProjectDetail` | Get project with stats, members |
| `create` | org admin | `{ orgId, name, description?, type }` | `Project` | Create project |
| `update` | project admin | `{ id, name?, description?, type? }` | `Project` | Update project |
| `archive` | project admin | `{ id }` | `{ success }` | Soft delete project |
| `restore` | project admin | `{ id }` | `{ success }` | Restore project |
| `delete` | project admin | `{ id }` | `{ success }` | Hard delete (cascade) |
| `members.list` | project member | `{ projectId }` | `ProjectMember[]` | List members |
| `members.add` | project admin | `{ projectId, email, role }` | `ProjectMember` | Add member |
| `members.update` | project admin | `{ projectId, userId, role }` | `ProjectMember` | Update role |
| `members.remove` | project admin | `{ projectId, userId }` | `{ success }` | Remove member |

### Zod Input Schemas

```typescript
// list
z.object({
  orgId: z.string(),
  status: z.enum(["active", "archived"]).optional(),
  type: z.enum(["client", "internal", "personal"]).optional(),
})

// create
z.object({
  orgId: z.string(),
  name: z.string().min(1).max(256),
  description: z.string().optional(),
  type: z.enum(["client", "internal", "personal"]),
})

// update
z.object({
  id: z.string(),
  name: z.string().min(1).max(256).optional(),
  description: z.string().optional(),
  type: z.enum(["client", "internal", "personal"]).optional(),
})

// members.add
z.object({
  projectId: z.string(),
  email: z.string().email(),
  role: z.enum(["viewer", "editor", "admin"]),
})

// members.update
z.object({
  projectId: z.string(),
  userId: z.string(),
  role: z.enum(["viewer", "editor", "admin"]),
})
```

---

## Implementation Phases

### Phase 1: Database
- [ ] Add `projects` table to schema
- [ ] Add `project_members` table to schema
- [ ] Add relations (`projectRelations`, `projectMemberRelations`)
- [ ] Extend existing relations (`organizationRelations`, `userRelations`)
- [ ] Generate migration
- [ ] Test migration

### Phase 2: API
- [ ] Create `projects` router
- [ ] Implement `list` procedure
- [ ] Implement `get` procedure (with stats, members)
- [ ] Implement `create` procedure
- [ ] Implement `update` procedure
- [ ] Implement `archive` / `restore` procedures
- [ ] Implement `delete` procedure
- [ ] Implement `members.list` procedure
- [ ] Implement `members.add` procedure (by email lookup)
- [ ] Implement `members.update` procedure
- [ ] Implement `members.remove` procedure
- [ ] Add permission checks (org admin vs project admin vs member)
- [ ] Test all procedures

### Phase 3: SDK
- [ ] Add `projects` operations to SDK client
- [ ] Add TypeScript types exports
- [ ] Test integration

### Phase 4: CLI
- [ ] Add `nesalia orgs projects` command group
- [ ] Add `list` subcommand
- [ ] Add `get` subcommand
- [ ] Add `create` subcommand
- [ ] Add `update` subcommand
- [ ] Add `archive` / `restore` subcommands
- [ ] Add `delete` subcommand
- [ ] Add `members` subcommand group
- [ ] Add `members list`, `members add`, `members update`, `members remove`
- [ ] Test commands

### Phase 5: Web UI
- [ ] Add `/[orgSlug]/projects` page
- [ ] Add `/[orgSlug]/projects/[projectId]` page
- [ ] Add `/[orgSlug]/projects/[projectId]/settings` page
- [ ] Create project components (card, list, dialogs)
- [ ] Add "Projects" link to sidebar
- [ ] Test full flow

---

## Effort Estimate

| Phase | Complexity | Time |
|-------|------------|------|
| Database | Low | 1-2h |
| API | Medium | 4-6h |
| SDK | Low | 1h |
| CLI | Medium | 3-4h |
| Web UI | Medium | 4-6h |
| **Total** | | **13-19h** |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Permission complexity | Medium | High | Double-check org admin vs project admin logic |
| Email lookup for members | Low | Medium | Handle "user not found" gracefully |
| Cascade delete | Low | High | Archive first (soft delete) before hard delete |
| Project transfer (v2) | N/A | N/A | Not in MVP — documented for future |

---

## Open Questions for Product

1. **Project transfer** — Is this in MVP or v2? (Spec says v1, but complex)
2. **Org-level vs project-level documents** — Current Documents are org-level. Should we attach to projects now or later?
3. **Default project** — Does a new org automatically get a "Personal" project?

### Answers (Pending Product Review)

_To be filled after sync with Head of Product_

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Project settings deferred | MVP focuses on core CRUD + members |
| Soft delete via `archivedAt` | Allows restore, preserves data |
| Project admin check in `update`/`archive`/`delete` | Not org admin — project-level permission |
| Email-based `members.add` | Simpler than user ID lookup from CLI |
| Unique constraint on `project_members(projectId, userId)` | Prevent duplicate memberships |

---

## Dependencies

- **Depends on:** Organizations (✅ done)
- **Blocks:** Agents, Workflows (future features)

---

## Related Documents

- Product Spec: `docs/internal/product/features/projects/projects.md`
- CLI Spec: `docs/internal/product/features/projects/cli.md`
- Web Spec: `docs/internal/product/features/projects/web.md`

---

## Appendix: Documents Integration Decision

**Current state:** Documents are org-level (`organizationDocuments` links docs to orgs)

**Options for Projects:**

| Option | Pros | Cons |
|--------|------|------|
| **A: Keep org-level only** | Simple, existing code works | Can't isolate docs per project |
| **B: Add `projectId` FK to `organizationDocuments`** | Flexible, docs can be in org or project | Schema change, migration needed |
| **C: New `projectDocuments` table** | Clean separation | Duplicate structure, more complex |

**Recommendation:** Option B for MVP flexibility. Documents can optionally belong to a project.

```typescript
// organizationDocuments change
export const organizationDocuments = pgTable(
  "organization_documents",
  {
    // ... existing fields
    projectId: text("project_id").references(() => projects.id), // NEW: optional
  },
  // ... existing indexes
);
```

This keeps existing org-level docs working while enabling project-scoped docs.

---

_Plan created: 2026-06-15_
_Last updated: 2026-06-15_
_Status: Draft — pending Head of Product review_