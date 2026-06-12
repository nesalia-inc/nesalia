---
title: Projects Web Interface
description: Page structure and content for project management in the web app
status: draft
version: 0.1.0
category: web
tags: [projects, web, pages, structure]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead, design-lead]
related:
  - features/projects/projects.md
  - features/projects/cli.md
  - features/organizations.md
priority: high
stability: experimental
requires:
  - features/projects/projects.md
impact:
  users: all
  complexity: medium
---

# Projects Web Interface

## Overview

Web interface for managing projects within organizations. Covers page structure, routing, and content organization.

---

## Pages

### Organization Projects Page

**Route:** `/organization/[orgId]/projects`

**Purpose:** Browse and manage all projects in an organization

**Contains:**
- Page title with org name
- "New Project" button
- Filter tabs: All, My Projects, Archived
- Sort dropdown: Recent Activity, Alphabetical, Created Date
- Project list/grid view toggle
- Project cards showing: name, type badge, stats (agents, docs, workflows), last activity
- Quick actions menu per project

**Actions:**
- Create new project
- Open project
- Archive project
- Delete project
- Filter by status/type
- Sort projects

---

### Project Dashboard Page

**Route:** `/organization/[orgId]/project/[projectId]`

**Purpose:** Overview of a specific project

**Contains:**
- Project name and description
- Quick stats cards: agents count, documents count, workflows count
- Recent activity feed
- Team members with access
- Quick actions: Add Agent, Upload Document, Run Workflow

**Tabs:**
- Overview (default)
- Agents
- Documents
- Workflows
- Settings (admin only)

**Actions:**
- View agents
- View documents
- View workflows
- Access settings
- View activity

---

### Project Agents Tab

**Route:** `/organization/[orgId]/project/[projectId]/agents`

**Purpose:** Manage agents within a project

**Contains:**
- "Create Agent" button
- Agent list: name, type, status, last run
- Agent creation modal or page
- Agent detail modal/page

**Actions:**
- Create new agent
- Edit agent
- Delete agent
- View agent runs
- Configure agent settings

---

### Project Documents Tab

**Route:** `/organization/[orgId]/project/[projectId]/documents`

**Purpose:** Manage documents within a project

**Contains:**
- "New Document" button
- Folder navigation
- Document list: name, type, author, last modified
- Search bar with filters
- Drag & drop upload zone

**Actions:**
- Create new document
- Edit document
- Delete/archive document
- Upload files
- Manage folders
- Move documents

---

### Project Workflows Tab

**Route:** `/organization/[orgId]/project/[projectId]/workflows`

**Purpose:** Manage workflows within a project

**Contains:**
- "Create Workflow" button
- Workflow list: name, trigger, last run, status
- Workflow builder
- Recent runs log

**Actions:**
- Create new workflow
- Edit workflow
- Delete workflow
- Run workflow manually
- View run history
- Enable/disable workflow

---

### Project Settings Page

**Route:** `/organization/[orgId]/project/[projectId]/settings`

**Purpose:** Configure project settings

**Sections (tabbed):**

**General Tab:**
- Project name input
- Project description textarea
- Project type selector (Client, Internal, Personal)
- Status toggle (active/archived)

**Members Tab:**
- Member list: name, email, role, joined date
- "Add Member" button
- Role selector per member
- Remove member option

**Integrations Tab:**
- Connected services list
- "Add Integration" button
- API keys management
- Environment variables editor

**Limits Tab:**
- Agent creation limit
- Document storage limit
- API call limits
- Current usage indicators

**Danger Zone Tab:**
- Archive project button
- Delete project button (with confirmation)

**Actions:**
- Update general settings
- Add/remove members
- Change member roles
- Manage API keys
- Manage environment variables
- Add/remove integrations
- Archive project
- Delete project

---

### Project Creation Modal / Page

**Route:** `/organization/[orgId]/projects/new`

**Purpose:** Create a new project

**Contains:**
- Project name input (required)
- Project description textarea (optional)
- Project type selector (Client, Internal, Personal)
- Initial members input (optional, email invite)
- Create button

**Validation:**
- Name: 3-50 characters, unique within org
- Description: max 500 characters

**Actions:**
- Create project
- Cancel

---

### Archived Projects Page

**Route:** `/organization/[orgId]/projects?status=archived`

**Purpose:** View and restore archived projects

**Contains:**
- Archived project list
- Archive date
- Original type
- Restore button per project

**Actions:**
- Restore project
- Permanently delete project

---

## Navigation Structure

```
Organization
├── Projects
│   ├── /organization/[orgId]/projects
│   ├── /organization/[orgId]/projects/new
│   └── /organization/[orgId]/project/[projectId]
│       ├── (tabs) Overview, Agents, Documents, Workflows
│       └── /settings
│           ├── General
│           ├── Members
│           ├── Integrations
│           ├── Limits
│           └── Danger Zone
```

---

## Global Elements

### Sidebar Navigation
- Dashboard link
- Projects link (expandable)
  - All Projects
  - My Projects
  - Archived
- Documents link
- Settings
- Billing

### Context Menu (Right-click on project)
- Open
- Settings
- ---
- Copy project link
- ---
- Archive
- ---
- Delete

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| New project | Cmd/Ctrl + Shift + N |
| Search projects | Cmd/Ctrl + K |
| Archive project | Cmd/Ctrl + Shift + D |

---

## Related Documents

- [Projects](./projects.md) — Complete project specification
- [Projects CLI](./cli.md) — CLI commands reference
- [Organizations](../organizations.md) — Org-level web structure