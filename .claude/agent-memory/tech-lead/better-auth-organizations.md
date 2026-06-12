---
name: better-auth-organizations
description: Better Auth organizations plugin documentation and integration plan
type: reference
---

# Better Auth Organizations Plugin

## Source
Fetched from https://www.better-auth.com/docs/plugins/organization on 2026-06-11.

## Installation

```typescript
// packages/auth/src/config.ts
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      // Options...
    })
  ]
})
```

## Database Tables Added

| Table | Purpose |
|-------|---------|
| `organization` | id, name, slug, logo, metadata, createdAt |
| `member` | id, userId, organizationId, role, createdAt |
| `invitation` | id, email, inviterId, organizationId, role, status, expiresAt |
| `session` | + activeOrganizationId, activeTeamId |
| `organizationRole` | (optional) Dynamic roles per org |
| `team` / `teamMember` | (optional) Teams feature |

## Key Features

- **Organization CRUD**: create, list, update, delete
- **Invitations**: send, accept, reject, cancel
- **Members**: list, add, remove, update role
- **Roles**: owner, admin, member (defaults)
- **Permissions**: `createAccessControl` for custom access control
- **Teams**: optional grouping of members
- **Hooks**: before/after for all operations

## Important Options

- `allowUserToCreateOrganization`: boolean or async function
- `organizationLimit`: max orgs per user
- `creatorRole`: "owner" | "admin"
- `membershipLimit`: max members per org
- `sendInvitationEmail`: async function for email
- `teams: { enabled: true }`: enable teams feature
- `dynamicAccessControl: { enabled: true }`: per-org roles

## Client Plugin

```typescript
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      // mirror server options
    })
  ]
})
```

## Hooks Available

- `beforeCreateOrganization` / `afterCreateOrganization`
- `beforeUpdateOrganization` / `afterUpdateOrganization`
- `beforeAddMember` / `afterAddMember`
- `beforeRemoveMember` / `afterRemoveMember`
- `beforeUpdateMemberRole` / `afterUpdateMemberRole`
- `beforeCreateInvitation` / `afterCreateInvitation`
- `beforeAcceptInvitation` / `afterAcceptInvitation`
- `beforeCreateTeam` / `afterDeleteTeam` (and more for teams)

## Access Control

```typescript
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({ project: ["create", "update", "delete"] });
const admin = ac.newRole({ project: ["create", "update"] });
const member = ac.newRole({ project: ["create"] });
```

## Status

Not yet integrated into this project. User wants to integrate it.