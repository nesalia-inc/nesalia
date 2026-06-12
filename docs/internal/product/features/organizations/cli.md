---
title: Organizations CLI Reference
description: CLI commands for organization management
status: draft
version: 0.1.0
category: cli
tags: [cli, organizations, commands]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead]
related:
  - features/organizations/organizations.md
  - features/projects/cli.md
priority: high
stability: experimental
---

# Organizations CLI Reference

All CLI commands for managing organizations in Nesalia.

---

## Core Commands

### List Organizations

```bash
# List all organizations for current user
nesalia orgs list

# Output as JSON
nesalia orgs list --json
```

### Get Organization

```bash
# Get organization by name or ID
nesalia orgs get my-org

# Get with full details
nesalia orgs get my-org --json

# Get with members
nesalia orgs get my-org --include-members
```

### Create Organization

```bash
# Create organization with default plan
nesalia orgs create "Client A Agency"

# Create with specific plan
nesalia orgs create "Client A Agency" --plan pro
nesalia orgs create "Client A Agency" --plan enterprise

# Create with description
nesalia orgs create "Personal" --plan free --description "My personal workspace"
```

### Update Organization

```bash
# Update organization name
nesalia orgs update my-org --name "New Name"

# Update description
nesalia orgs update my-org --description "Organization description"

# Update avatar
nesalia orgs update my-org --avatar ./logo.png
```

### Switch Organization

```bash
# Switch to organization (set as current)
nesalia orgs switch my-org

# Shortcut
nesalia switch my-org
```

### Delete Organization

```bash
# Delete organization (requires confirmation)
nesalia orgs delete my-org

# Force delete (skip confirmation)
nesalia orgs delete my-org --force

# Delete with warning
nesalia orgs delete my-org --force
#? Warning: This organization has 5 projects and 12 members.
#? All data will be permanently deleted after 7 days.
#? This action cannot be undone. Continue? [y/N]
```

---

## Member Commands

### List Members

```bash
# List all members in organization
nesalia orgs members list

# List members in specific organization
nesalia orgs members list my-org

# List with roles
nesalia orgs members list my-org --json
```

### Add Member

```bash
# Add member as regular member
nesalia orgs members add my-org alice@example.com --role member

# Add as admin
nesalia orgs members add my-org alice@example.com --role admin

# Add as billing admin
nesalia orgs members add my-org alice@example.com --role billing_admin

# Add multiple members
nesalia orgs members add my-org alice@example.com,bob@example.com --role member
```

### Update Member Role

```bash
# Change member role
nesalia orgs members update my-org alice@example.com --role admin

# Change to billing admin
nesalia orgs members update my-org alice@example.com --role billing_admin
```

### Remove Member

```bash
# Remove member from organization
nesalia orgs members remove my-org alice@example.com

# Remove without confirmation
nesalia orgs members remove my-org alice@example.com --force
```

---

## Settings Commands

### Get Settings

```bash
# Get organization settings
nesalia orgs settings get my-org

# Output as JSON
nesalia orgs settings get my-org --json
```

### Update Settings

```bash
# Update timezone
nesalia orgs settings update my-org --timezone America/New_York

# Update default project type
nesalia orgs settings update my-org --default-project-type client

# Update multiple settings
nesalia orgs settings update my-org --timezone Europe/London --require-2fa true
```

### API Keys

```bash
# List API keys (names only)
nesalia orgs settings keys list my-org

# Add API key
nesalia orgs settings keys add my-org INTERNAL_API_KEY

# Set API key value
nesalia orgs settings keys set my-org INTERNAL_API_KEY "key_xxxx"

# Remove API key
nesalia orgs settings keys remove my-org INTERNAL_API_KEY
```

### SSO Configuration (Enterprise)

```bash
# Configure SAML SSO
nesalia orgs settings sso configure my-org --provider saml

# Configure OIDC
nesalia orgs settings sso configure my-org --provider oidc --issuer https://example.okta.com

# Disable SSO
nesalia orgs settings sso disable my-org
```

---

## Security Commands

### Two-Factor Authentication

```bash
# Enforce 2FA for all members
nesalia orgs security 2fa-enforce my-org

# Disable 2FA enforcement
nesalia orgs security 2fa-disable my-org

# Check 2FA status
nesalia orgs security 2fa-status my-org
```

### Session Management

```bash
# List active sessions
nesalia orgs security sessions list my-org

# Revoke all sessions for a member
nesalia orgs security sessions revoke my-org alice@example.com

# Revoke all sessions
nesalia orgs security sessions revoke-all my-org
```

### Audit Log

```bash
# View audit log
nesalia orgs security audit-log my-org

# Filter by action type
nesalia orgs security audit-log my-org --action member.add

# Filter by date range
nesalia orgs security audit-log my-org --from 2026-01-01 --to 2026-01-31

# Export audit log
nesalia orgs security audit-log my-org --format json --output ./audit.json
```

---

## Billing Commands

### View Billing

```bash
# View current billing status
nesalia orgs billing my-org

# View as JSON with full details
nesalia orgs billing my-org --json
```

### Upgrade Plan

```bash
# Upgrade to Pro
nesalia orgs billing upgrade my-org --plan pro

# Upgrade to Enterprise
nesalia orgs billing upgrade my-org --plan enterprise

# Upgrade with annual billing
nesalia orgs billing upgrade my-org --plan pro --billing annual
```

### Cancel Subscription

```bash
# Cancel subscription
nesalia orgs billing cancel my-org

# Cancel with confirmation
nesalia orgs billing cancel my-org
#? This will cancel your Pro subscription.
#? Your organization will be downgraded to Free plan.
#? Continue? [y/N]
```

### Invoices

```bash
# List invoices
nesalia orgs billing invoices my-org

# Download invoice
nesalia orgs billing invoices my-org download inv_123

# View invoice details
nesalia orgs billing invoices my-org view inv_123 --json
```

---

## Transfer Commands

### Transfer Ownership

```bash
# Transfer to another user
nesalia orgs transfer my-org --to alice@example.com

# Transfer with confirmation
nesalia orgs transfer my-org --to alice@example.com
#? This will transfer ownership of "my-org" to alice@example.com.
#? You will become an Admin after the transfer.
#? Continue? [y/N]
```

### Accept Ownership

```bash
# Accept pending transfer
nesalia orgs transfer accept transfer-123
```

### Decline Transfer

```bash
# Decline ownership transfer
nesalia orgs transfer decline transfer-123
```

---

## Document Commands

### List Organization Documents

```bash
# List org-level documents
nesalia docs list --org my-org

# Filter by type
nesalia docs list --org my-org --type handbook

# Include archived
nesalia docs list --org my-org --archived
```

### Create Organization Document

```bash
# Create handbook
nesalia docs create "Team Handbook" --type handbook --org my-org

# Create policy
nesalia docs create "Security Policy" --type policy --org my-org

# Create with content
nesalia docs create "Onboarding Guide" --type handbook --org my-org --content "# Onboarding\n\nWelcome..."
```

---

## Flags Reference

### Global Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--json` | Output as JSON | false |
| `--quiet` | Suppress output | false |
| `--debug` | Show debug info | false |

### Organization Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--plan` | Plan type | `--plan pro` |
| `--description` | Organization description | `--description "..."` |
| `--timezone` | Organization timezone | `--timezone America/New_York` |
| `--role` | Member role | `--role admin` |
| `--to` | Transfer target | `--to alice@example.com` |

### Date Filters

| Flag | Description | Example |
|------|-------------|---------|
| `--from <date>` | Start date | `--from 2026-01-01` |
| `--to <date>` | End date | `--to 2026-01-31` |

### Pagination

| Flag | Description | Default |
|------|-------------|---------|
| `--page <n>` | Page number | 1 |
| `--per-page <n>` | Items per page | 20 |

---

## Environment Variables

```bash
# Default organization for commands
NESALIA_DEFAULT_ORG=my-org
```

---

## Examples

### Complete Organization Setup

```bash
# 1. Create organization
nesalia orgs create "My Agency" --plan pro --description "Client work"

# 2. Configure settings
nesalia orgs settings update "My Agency" --timezone America/New_York

# 3. Enforce 2FA
nesalia orgs security 2fa-enforce "My Agency"

# 4. Add team members
nesalia orgs members add "My Agency" alice@example.com --role admin
nesalia orgs members add "My Agency" bob@example.com --role member

# 5. Create first project
nesalia projects create "Client A" --type client --org "My Agency"
```

### Freelancer Client Management

```bash
# Create separate org per client
nesalia orgs create "Client A Corp" --plan pro
nesalia orgs create "Client B Inc" --plan pro

# Switch between clients
nesalia switch "Client A Corp"
# ... work on Client A ...

nesalia switch "Client B Inc"
# ... work on Client B ...
```

### Team Onboarding

```bash
# Admin creates org
nesalia orgs create "Acme Inc" --plan pro

# Owner invites team
nesalia orgs members add "Acme Inc" alice@acme.com --role admin
nesalia orgs members add "Acme Inc" bob@acme.com --role member

# Team members accept invitations
# (via email link or web UI)
```

### Security Hardening

```bash
# Enforce 2FA for all members
nesalia orgs security 2fa-enforce "My Agency"

# Set up SSO (Enterprise)
nesalia orgs settings sso configure "My Agency" --provider saml --metadata-url "https://..."

# Review audit log
nesalia orgs security audit-log "My Agency" --action member.add
```

---

## Related Documents

- [Organizations](./organizations.md) — Organization feature specification
- [Projects CLI](../projects/cli.md) — Project CLI commands
- [Documents CLI](../documents/cli.md) — Document CLI commands