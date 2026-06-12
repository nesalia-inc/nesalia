---
title: Organizations
description: Top-level container for billing, members, and settings
status: approved
version: 1.0.0
category: core
tags: [organizations, billing, members, multi-tenancy]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead, design-lead]
related:
  - features/organizations/cli.md
  - features/organizations/web.md
  - features/projects/projects.md
priority: critical
stability: stable
requires:
  - authentication
  - billing-system
impact:
  users: all
  complexity: high
---

# Organizations

## Overview

Organizations are the top-level container in Nesalia. They represent a company, team, or individual account and manage billing, members, and high-level settings. Every user starts with a personal organization and can create additional organizations for different contexts.

## Problem Statement

Different contexts require different organizations:
- **Different companies** — A consultant working with multiple clients needs separation
- **Personal vs Professional** — Personal productivity and work projects shouldn't mix
- **Departments** — Large teams with separate budgets and admin needs

## Core Concepts

### Organization as Container

```
User
├── Organization "My Agency" (work)
│   ├── Documents: [Team handbook, Policies, Templates]
│   ├── Projects: [Acme Corp, Beta Inc, ...]
│   ├── Members: [Team members]
│   └── Billing: [Pro plan]
└── Organization "Personal" (personal)
    ├── Documents: [Personal notes, Templates]
    ├── Projects: [SaaS, Reading, Fitness]
    ├── Members: [Just me]
    └── Billing: [Free plan]
```

### Why Multiple Organizations?

| Scenario | Organization Strategy |
|----------|----------------------|
| Freelancer with multiple clients | One org per client |
| Solo with work/personal | Two orgs: "Work", "Personal" |
| Agency with teams | One org with projects per client |
| Startup | One org for the company |
| Side project | Separate org to isolate from main work |

## Document Hierarchy

Documents exist at two levels:

| Level | Use Case | Examples |
|-------|----------|----------|
| **Organization** | Org-wide, shared across projects | Team handbook, policies, templates, onboarding docs |
| **Project** | Project-specific, isolated | Client specs, contracts, project-related docs |

**Rules:**
- Org-level documents are visible to all org members
- Project-level documents are visible only to project members
- Documents can be moved between levels
- Deleting a project archives its documents (not deletes)

## Features

### 1. Organization Creation

**When:** User wants a new context

**Flow:**
1. User clicks "New Organization" from dashboard
2. Enter organization name
3. Choose plan (Free/Pro/Enterprise)
4. Configure billing (if paid)
5. Organization created

**Constraints:**
- New users get one org auto-created with their name
- Minimum 1 org per user (cannot have 0)
- Maximum orgs: Free (2), Pro (10), Enterprise (unlimited)

### 2. Organization Dashboard

**Content:**
- Organization name and avatar
- Member count and plan badge
- Project count with quick access
- Recent activity across all projects
- Team members list
- Quick actions

**Tabs:**
- Overview (default)
- Projects
- Members
- Settings
- Billing

### 3. Organization Roles

| Role | Description |
|------|-------------|
| **Owner** | Full control, can delete org, manage billing, transfer ownership |
| **Admin** | Manage members, projects, settings (no billing access) |
| **Member** | Access assigned projects, cannot manage org settings |
| **Billing Admin** | Can only manage billing (separate from org admin) |

**Notes:**
- Owner can be transferred but not removed
- At least one owner must exist
- Roles are scoped to the organization

### 4. Organization Settings

**General:**
- Organization name
- Organization avatar/logo
- Description
- Timezone (for scheduled tasks)

**Members Management:**
- View all members
- Invite new members (email)
- Change member roles
- Remove members
- Accept/decline invitations

**Security:**
- Two-factor authentication enforcement
- Session management
- API key management (org-level)
- Audit log access

**Integrations:**
- Org-wide integrations (Slack, GitHub, etc.)
- SSO configuration (Enterprise)
- SAML setup (Enterprise)

**Limits & Usage:**
- Current plan and limits
- Usage statistics
- Upgrade prompts

### 5. Organization Switching

Users can switch between organizations instantly:

```
Header: [Avatar ▼] Switch organization
├── My Agency (current)
├── Personal
└── [Create Organization]
```

**Behavior:**
- Switching is instant (no reload)
- All sidebar/context updates to new org
- Projects, members, settings reflect new org
- User's personal context (notifications, preferences) persists

### 6. Organization Deletion

**Flow:**
1. Owner initiates deletion
2. 7-day grace period (can cancel)
3. All projects archived (not deleted immediately)
4. After grace period: data deleted
5. Org cannot be recovered after deletion

**Requirements:**
- Must transfer or delete all projects first
- Must cancel active subscriptions
- Owner must be the one initiating

### 7. Organization Transfer

Transfer ownership to another user:

```
Current Owner → New Owner
├── Org settings transfer
├── Billing transfer (new owner must add payment)
├── Members remain
└── Projects unchanged
```

**Constraints:**
- New owner must have an account
- New owner receives email notification
- Current owner becomes Admin after transfer

## User Flows

### Flow 1: Freelancer Onboarding

```
1. User signs up for Nesalia
2. Org auto-created: "David's Organization" (Personal)
3. User creates first project: "Client A"
4. User invites client A team members
5. User creates agents in Client A project
6. Repeat for next client (new org or new project)
```

### Flow 2: Team Setup

```
1. CEO creates organization "Acme Inc"
2. CEO invites founders as Admins
3. Admins create projects for departments
4. Admins invite team members to projects
5. Members work within their project scope
```

### Flow 3: Switching Contexts

```
1. User working in "My Agency" org
2. User clicks avatar dropdown
3. User selects "Personal" org
4. Interface updates to show Personal org
5. User sees Personal projects and settings
```

## Data Model

### Organization Entity

```typescript
interface Organization {
  id: string
  name: string
  slug: string  // URL-friendly, unique
  avatar: string | null
  description: string | null
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'deleted'
  ownerId: string
  settings: OrganizationSettings
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

### Organization Member Entity

```typescript
interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member' | 'billing_admin'
  invitedBy: string
  joinedAt: Date
  status: 'active' | 'invited' | 'removed'
}
```

### Organization Settings Entity

```typescript
interface OrganizationSettings {
  organizationId: string
  timezone: string
  defaultProjectType: 'client' | 'internal' | 'personal'
  requireTwoFactor: boolean
  allowedDomains: string[]  // For SSO/domain restriction
  ssoConfig: SSOConfig | null
  auditLogRetention: number  // days
  features: {
    allowProjectCreation: boolean
    allowMemberInvitation: boolean
    maxProjectsPerOrg: number
    maxMembersPerOrg: number
  }
}
```

## Permissions Matrix

| Action | Owner | Admin | Member | Billing Admin |
|--------|-------|-------|--------|--------------|
| View org | ✓ | ✓ | ✓ | ✓ |
| Edit org details | ✓ | ✓ | ✗ | ✗ |
| Delete org | ✓ | ✗ | ✗ | ✗ |
| Manage billing | ✓ | ✗ | ✗ | ✓ |
| View billing | ✓ | ✗ | ✗ | ✓ |
| Add/remove members | ✓ | ✓ | ✗ | ✗ |
| Change member roles | ✓ | ✓ | ✗ | ✗ |
| Create projects | ✓ | ✓ | ✗ | ✗ |
| Manage org settings | ✓ | ✓ | ✗ | ✗ |
| View audit log | ✓ | ✓ | ✗ | ✗ |
| Transfer ownership | ✓ | ✗ | ✗ | ✗ |

## Billing & Plans

### Free Plan
- 2 organizations max
- 3 projects per org
- 2 team members per org
- Basic features

### Pro Plan
- 10 organizations max
- Unlimited projects
- Unlimited members
- Advanced features
- Priority support

### Enterprise Plan
- Unlimited organizations
- Unlimited everything
- SSO/SAML
- Audit logs
- Dedicated support
- Custom contracts

## API Design

### Endpoints

```bash
# List user's organizations
GET /api/v1/organizations

# Get organization
GET /api/v1/organizations/:id

# Create organization
POST /api/v1/organizations
{
  "name": "string",
  "plan": "free" | "pro" | "enterprise"
}

# Update organization
PATCH /api/v1/organizations/:id
{
  "name": "string",
  "description": "string",
  "avatar": "string"
}

# Delete organization
DELETE /api/v1/organizations/:id

# Members
GET /api/v1/organizations/:id/members
POST /api/v1/organizations/:id/members
PATCH /api/v1/organizations/:id/members/:userId
DELETE /api/v1/organizations/:id/members/:userId

# Billing
GET /api/v1/organizations/:id/billing
POST /api/v1/organizations/:id/billing/upgrade
POST /api/v1/organizations/:id/billing/cancel

# Organization Documents
GET /api/v1/organizations/:id/documents
POST /api/v1/organizations/:id/documents
GET /api/v1/organizations/:id/documents/:documentId
PATCH /api/v1/organizations/:id/documents/:documentId
DELETE /api/v1/organizations/:id/documents/:documentId
POST /api/v1/organizations/:id/documents/:documentId/move-to-project/:projectId

# Settings
GET /api/v1/organizations/:id/settings
PATCH /api/v1/organizations/:id/settings

# Transfer ownership
POST /api/v1/organizations/:id/transfer
{
  "newOwnerId": "string"
}
```

### Response Shapes

```typescript
// Organization list response
interface OrganizationsResponse {
  data: Organization[]
  pagination: {
    page: number
    perPage: number
    total: number
  }
}

// Organization detail response
interface OrganizationResponse {
  data: Organization & {
    stats: {
      projects: number
      members: number
      agents: number
    }
    currentUserRole: Role
  }
}
```

## Edge Cases

### Organization at Limit
- **Creating new org at limit:** Show upgrade prompt
- **Inviting member at limit:** Show upgrade prompt
- **Creating project at limit:** Show upgrade prompt

### Member Removal
- **Removing last owner:** Must transfer first, then remove
- **Removing member with active sessions:** Sessions terminated
- **Removing member from org:** Projects remain, access revoked

### Billing Failures
- **Payment failed:** Grace period (7 days), then suspend
- **Subscription cancelled:** Downgrade to Free, preserve data
- **Upgrading mid-cycle:** Prorated billing

### Data Recovery
- **Accidental deletion:** 30-day recovery window
- **Owner leaves:** Transfer before leaving
- **Organization suspended:** Data preserved, can reactivate

## Notifications

### Organization Events
- New member invited
- Member accepted/declined invitation
- Member role changed
- Organization plan changed
- Billing payment succeeded/failed
- Organization deletion scheduled

### Notification Channels
- In-app notifications
- Email (configurable per event type)
- Slack/Teams (if integrated)

## Integrations

### Org-Level Integrations
- **Slack:** Channel notifications for org events
- **GitHub:** Organization-level webhook settings
- **SSO:** SAML/OIDC for enterprise
- **Audit Logs:** Export to SIEM

### Project-Level Integrations
- **Per-project API keys**
- **Project-specific Slack channels**
- **CRM connections**

## Metrics

| Metric | Target |
|--------|--------|
| Organization creation time | < 5s |
| Organization switch time | < 200ms |
| Member list load time | < 300ms |
| Settings page load time | < 500ms |

## Success Criteria

1. **Multiple contexts work** — Users can maintain separate orgs without confusion
2. **Switching is seamless** — No reload, instant context switch
3. **Permissions are enforced** — Members see only what they should
4. **Billing is clear** — Users understand their plan and limits
5. **Deletion is safe** — Grace period allows cancellation

## Related Documents

- [Projects](../projects/projects.md) — Projects within organizations
- [Organizations CLI](./cli.md) — CLI commands reference
- [Organizations Web](./web.md) — Web interface structure