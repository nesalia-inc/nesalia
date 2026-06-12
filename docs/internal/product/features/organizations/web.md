---
title: Organizations Web Interface
description: Page structure and content for organization management in the web app
status: in-progress
version: 0.2.0
category: web
tags: [organizations, web, pages, structure]
author: Product Team
created: 2026-12
updated: 2026-06-12
reviewers: [eng-lead, design-lead]
related:
  - features/organizations/organizations.md
  - features/organizations/cli.md
priority: high
stability: experimental
requires:
  - features/organizations/organizations.md
impact:
  users: all
  complexity: medium
---

# Organizations Web Interface

## Overview

Web interface for managing organizations. Covers page structure, routing, and content organization.

---

## Pages

### Dashboard (Organization List)

**Route:** `/home`

**Purpose:** Redirects to first organization, or shows welcome if no orgs

**Contains:**
- Redirects to `/{firstOrgSlug}` if user has organizations
- Shows welcome message if user has no organizations

**Actions:**
- Redirect to organization
- Create new organization (future)

---

### Organization Dashboard

**Route:** `/{orgSlug}`

**Purpose:** Overview of a specific organization

**Contains:**
- Organization name and avatar
- Quick stats: projects count, members count
- Team members list
- Quick actions: New Project, Invite Member

**Tabs:**
- Overview (default)
- Projects
- Documents
- Members
- Settings
- Billing

**Actions:**
- View projects
- View documents
- View members
- Access settings
- Manage billing

---

### Organization Projects Page

**Route:** `/{orgSlug}/projects`

**Purpose:** Manage all projects within organization

**Contains:**
- Project list: name, type badge, stats, last activity
- "New Project" button
- Filter tabs: All, My Projects, Archived
- Sort dropdown

**Actions:**
- Create new project
- Open project
- Archive project
- Delete project

---

### Organization Members Page

**Route:** `/{orgSlug}/members`

**Purpose:** Manage organization members

**Contains:**
- Member list: name, email, role badge, joined date
- "Invite Member" button
- Role filter dropdown
- Pending invitations section

**Actions:**
- Invite new member
- Change member role
- Remove member
- Resend invitation
- Cancel pending invitation

---

### Organization Documents Page

**Route:** `/{orgSlug}/documents`

**Purpose:** Manage org-level documents

**Contains:**
- Document list: name, type, author, last modified
- "New Document" button
- Search bar with filters
- Folder navigation

**Actions:**
- Create new document
- Edit document
- Delete/archive document
- Move document to project
- Share document

---

### Organization Settings Page

**Route:** `/{orgSlug}/settings`

**Purpose:** Configure organization settings

**Sections (tabbed):**

**General Tab:**
- Organization name input
- Organization avatar upload
- Description textarea
- Timezone selector

**Members Tab:**
- Member list with roles
- Invite form
- Role management
- Pending invitations

**Security Tab:**
- 2FA enforcement toggle
- Active sessions list
- Revoke session option
- API keys management

**Integrations Tab:**
- Connected services list (Slack, GitHub)
- SSO configuration (Enterprise)
- SAML setup (Enterprise)
- Webhook settings

**Limits Tab:**
- Current plan display
- Usage statistics
- Upgrade prompt if at limit

**Danger Zone Tab:**
- Transfer ownership button
- Delete organization button

**Actions:**
- Update general settings
- Manage members
- Configure security
- Set up integrations
- Transfer ownership
- Delete organization

---

### Organization Billing Page

**Route:** `/{orgSlug}/billing`

**Purpose:** Manage billing and subscription

**Contains:**
- Current plan card with features
- Usage summary
- Upgrade/Downgrade options
- Invoice history table
- Payment method management

**Actions:**
- Upgrade plan
- Downgrade plan
- Cancel subscription
- Download invoice
- Update payment method
- Add billing admin

---

### Organization Creation Modal / Page

**Route:** `/organizations/new`

**Purpose:** Create a new organization

**Contains:**
- Organization name input (required)
- Plan selection cards (Free, Pro, Enterprise)
- Description textarea (optional)
- Create button

**Validation:**
- Name: 3-100 characters, unique per user

**Actions:**
- Create organization
- Cancel

---

### Organization Switcher

**Location:** Sidebar header dropdown

**Purpose:** Quick switch between organizations

**Contains:**
- Current org highlighted
- All orgs listed with avatars
- "Create New Organization" link

**Actions:**
- Switch to org
- Create new organization

---

### Pending Invitations Page

**Route:** `/{orgSlug}/invitations`

**Purpose:** Manage pending member invitations

**Contains:**
- Pending invitation list: email, role, sent date, expires
- Resend invitation button
- Cancel invitation button

**Actions:**
- Resend invitation
- Cancel invitation
- Accept/decline (for invitee)

---

## Navigation Structure

```
Dashboard
└── Organization
    ├── /{orgSlug}
    │   ├── (tabs) Overview, Projects, Documents, Members
    │   └── /settings
    │       ├── General
    │       ├── Members
    │       ├── Security
    │       ├── Integrations
    │       ├── Limits
    │       └── Danger Zone
    ├── /{orgSlug}/billing
    ├── /{orgSlug}/members
    ├── /{orgSlug}/documents
    └── /{orgSlug}/invitations

Global (Header)
├── Organization Switcher
│   └── /home
└── User Menu
    └── /settings (personal)
```

---

## Global Elements

### Header
- Organization name and avatar (clickable for switcher)
- Global search (Cmd/Ctrl + K)
- Notifications bell
- User avatar dropdown

### Sidebar (within org context)
- Organization switcher dropdown (current org + list)
- Navigation menu
- Home link

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Switch organization | Cmd/Ctrl + Shift + O |
| New organization | Cmd/Ctrl + Shift + N |
| Search | Cmd/Ctrl + K |

---

## Related Documents

- [Organizations](./organizations.md) — Complete organization specification
- [Organizations CLI](./cli.md) — CLI commands reference