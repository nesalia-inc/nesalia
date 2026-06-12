---
title: Projects
description: Primary organizational unit for agents, documents, and workflows
status: approved
version: 1.0.0
category: core
tags: [projects, agents, documents, workflows, isolation]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead, design-lead]
related:
  - features/organizations.md
  - features/projects/cli.md
  - features/projects/web.md
priority: critical
stability: stable
requires:
  - organizations
  - authentication
impact:
  users: all
  complexity: medium
---

# Projects

## Overview

Projects are the primary organizational unit for agents, documents, and workflows within an organization. They provide isolated contexts that keep related resources together and enable fine-grained access control.

## Problem Statement

Organizations need to:
- Separate work contexts (clients, teams, use cases)
- Control access to agents and documents
- Configure different integrations per context
- Maintain confidentiality between projects

## User Stories

### Story 1: Freelance Developer

> "I work with 3 clients. Each has their own set of agents and documents. I need complete isolation so Client A's documents never leak to Client B."

### Story 2: Agency

> "We have 12 clients. Each client project has their own agent trained on their specific knowledge base. Our team members have access only to the projects they're assigned to."

### Story 3: Solo Entrepreneur

> "I use one project for my SaaS business and another for personal productivity. Same org, completely separate contexts."

## Hierarchy

```
Organization
├── Documents[]          # Org-level, shared across projects
├── Members & Roles
├── Billing & Plan
└── Projects[]
    ├── Agents[]
    ├── Documents[]
    ├── Workflows[]
    └── Settings
        ├── API Keys
        └── Integrations
```

## Use Cases

### Use Case 1: Client Work Isolation

**Scenario:** Agency managing multiple clients

```
Organization: "My Agency"

Project: "Acme Corp"
├── Agents: [Code Review Bot, QA Assistant]
├── Documents: [Specs, Contracts, Feedback]
├── Workflows: [Onboarding Flow, Weekly Report]
└── Members: [Alice (Admin), Bob (Editor)]

Project: "Beta Inc"
├── Agents: [Bug Triage Agent]
├── Documents: [Bug Reports, Releases]
└── Members: [Alice (Admin), Carol (Editor)]
```

### Use Case 2: Team Separation

**Scenario:** Large organization with internal teams

```
Organization: "Tech Corp"

Project: "Engineering"
├── Agents: [Code Assistant, PR Reviewer]
├── Documents: [Architecture docs, Runbooks]
└── Members: [Engineering team]

Project: "Marketing"
├── Agents: [Content Generator, SEO Analyzer]
├── Documents: [Campaign briefs, Analytics]
└── Members: [Marketing team]

Project: "HR"
├── Agents: [Resume Screener, Onboarding Guide]
├── Documents: [Job descriptions, Policies]
└── Members: [HR team]
```

### Use Case 3: Personal vs Professional

**Scenario:** Solo user with separate contexts

```
Organization: "David's Account"

Project: "SaaS App"
├── Agents: [Feature Analyzer, Changelog Writer]
├── Documents: [User research, Roadmap]
└── Members: [David]

Project: "Personal"
├── Agents: [Daily Planner, Reading Assistant]
├── Documents: [Notes, Book summaries]
└── Members: [David]
```

## Data Model

### Project Entity

```typescript
interface Project {
  id: string
  organizationId: string
  name: string
  description: string | null
  type: 'client' | 'internal' | 'personal'
  status: 'active' | 'archived'
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
}
```

### Project Member Entity

```typescript
interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: 'viewer' | 'editor' | 'admin'
  addedAt: Date
}
```

### Project Settings Entity

```typescript
interface ProjectSettings {
  projectId: string
  apiKeys: Record<string, string>
  integrations: string[]
  environmentVariables: Record<string, string>
  agentLimits: {
    maxAgents: number
    maxConcurrentRuns: number
  }
  documentLimits: {
    maxSize: number
    maxFiles: number
  }
}
```

## Permissions

### Organization Level

- **Owner**: Can manage all projects, billing, members
- **Admin**: Can create projects, manage own projects
- **Member**: Can view all projects, request access

### Project Level

- **Admin**: Full control (settings, members, delete)
- **Editor**: Can create/edit agents, documents, workflows
- **Viewer**: Read-only access to agents, documents, workflows

### Permission Matrix

| Action | Owner | Org Admin | Org Member | Proj Admin | Proj Editor | Proj Viewer |
|--------|-------|-----------|------------|------------|-------------|-------------|
| Create project | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Delete project | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Archive project | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Manage project settings | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Add project members | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Create agents | ✓ | ✓ | Request | ✓ | ✓ | ✗ |
| Create documents | ✓ | ✓ | Request | ✓ | ✓ | ✗ |
| Create workflows | ✓ | ✓ | Request | ✓ | ✓ | ✗ |
| View project | ✓ | ✓ | Request | ✓ | ✓ | ✓ |

## Features

### 1. Project Creation

**When:** User wants to create a new work context

**Flow:**
1. User clicks "New Project" in org dashboard
2. Enter project name and optional description
3. Choose project type (Client, Internal, Personal)
4. Project created with default settings

### 2. Project Dashboard

**Content:**
- Project name and description
- Quick stats: agents, documents, workflows count
- Recent activity feed
- Team members with access
- Quick actions: Add agent, Upload document, Run workflow

**Tabs:**
- Overview (default)
- Agents
- Documents
- Workflows
- Settings (restricted to project admins)

### 3. Project Settings

**Configurable options:**

**General:**
- Project name and description
- Project type (Client, Internal, Personal)
- Archived status (soft delete)

**Members:**
- Add/remove members
- Assign roles (Viewer, Editor, Admin)
- Invite via email

**Integrations:**
- Per-project API keys
- Connected services (CRM, Database, etc.)
- Environment variables

**Limits:**
- Agent creation limit
- Document storage limit
- API call limits (if applicable)

### 4. Project Archival

Projects can be archived (soft delete) instead of hard deleted:
- Archived projects are hidden from main view
- Accessible via "Archived" filter
- Can be restored at any time
- Data preserved for compliance/audit

### 5. Project Transfer

Move a project to another organization:
- Transfer ownership
- All agents, documents, workflows transfer
- Members receive notification
- Requires approval from destination org

## API Design

### Endpoints

```bash
# List projects
GET /api/v1/projects
GET /api/v1/projects?status=active|archived

# Get project
GET /api/v1/projects/:id

# Create project
POST /api/v1/projects
{
  "name": "string",
  "description": "string",
  "type": "client" | "internal" | "personal"
}

# Update project
PATCH /api/v1/projects/:id

# Archive project
POST /api/v1/projects/:id/archive

# Restore project
POST /api/v1/projects/:id/restore

# Delete project
DELETE /api/v1/projects/:id

# Project members
GET /api/v1/projects/:id/members
POST /api/v1/projects/:id/members
DELETE /api/v1/projects/:id/members/:userId

# Project settings
GET /api/v1/projects/:id/settings
PATCH /api/v1/projects/:id/settings
```

### Response Shapes

```typescript
// Project list response
interface ProjectsResponse {
  data: Project[]
  pagination: {
    page: number
    perPage: number
    total: number
  }
}

// Project detail response
interface ProjectResponse {
  data: Project & {
    stats: {
      agents: number
      documents: number
      workflows: number
    }
    members: ProjectMember[]
    recentActivity: Activity[]
  }
}
```

## Edge Cases

### Deletion
- **Deleting a project with data:** Require confirmation, show warning with data counts
- **Cascade:** Deleting a project cascades to agents, documents, workflows (soft delete first)

### Transfer
- **Incomplete transfer:** If transfer fails mid-way, rollback to original state
- **Duplicate names:** Allow same name in different orgs (uniqueness scoped to org)

### Limits
- **Exceeding limits:** Soft block (warning), not hard block. Let user proceed with upgrade prompt.
- **Org deletion:** Projects must be archived or transferred before org deletion

## Metrics

| Metric | Target |
|--------|--------|
| Time to create first project | < 10s |
| Time to create agent in project | < 5s |
| Project list load time | < 200ms |
| Project switch time | < 300ms |

## Success Criteria

1. **Isolation works** — Users can work with multiple clients without data leakage
2. **Permissions work** — Members see only what they should see
3. **Context switch is smooth** — Users can quickly switch between projects
4. **Empty states guide** — New users know how to get started
5. **Archival preserves** — Archived projects can be restored with all data

## Related Documents

- [Organizations](../organizations.md) — Org-level structure
- [Projects CLI](./cli.md) — CLI commands reference
- [Projects Web](./web.md) — Web interface structure