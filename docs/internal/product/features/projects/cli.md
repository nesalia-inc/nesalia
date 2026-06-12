---
title: Projects CLI Reference
description: CLI commands for project management
status: draft
version: 0.1.0
category: cli
tags: [cli, projects, commands]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead]
related:
  - features/projects/projects.md
  - features/organizations.md
priority: high
stability: experimental
---

# Projects CLI Reference

All CLI commands for managing projects in Nesalia.

---

## Core Commands

### List Projects

```bash
# List all projects in current organization
nesalia projects list

# List projects in specific organization
nesalia projects list --org my-org

# Filter by status
nesalia projects list --status active
nesalia projects list --status archived

# Filter by type
nesalia projects list --type client
nesalia projects list --type internal
nesalia projects list --type personal

# Output as JSON
nesalia projects list --json
```

### Get Project

```bash
# Get project by name or ID
nesalia projects get my-project

# Get with full details
nesalia projects get my-project --json

# Get with members
nesalia projects get my-project --include-members
```

### Create Project

```bash
# Create a client project
nesalia projects create "Acme Corp" --type client

# Create an internal project
nesalia projects create "Engineering" --type internal

# Create a personal project
nesalia projects create "Personal" --type personal

# Create with description
nesalia projects create "Client A" --type client --description "Main client project"

# Create with initial members
nesalia projects create "Client A" --type client --members alice@example.com,bob@example.com
```

### Update Project

```bash
# Update project name
nesalia projects update my-project --name "New Name"

# Update description
nesalia projects update my-project --description "Updated description"

# Change type
nesalia projects update my-project --type internal
```

### Archive Project (Soft Delete)

```bash
# Archive project
nesalia projects archive my-project

# Archive with confirmation
nesalia projects archive my-project
#? This will archive "my-project". Continue? [y/N]

# Force archive (skip confirmation)
nesalia projects archive my-project --force
```

### Restore Project

```bash
# Restore archived project
nesalia projects restore my-project
```

### Delete Project

```bash
# Delete project (requires confirmation)
nesalia projects delete my-project

# Force delete (skip confirmation)
nesalia projects delete my-project --force

# Delete with data warning
nesalia projects delete my-project --force
#? Warning: This project has 3 agents, 12 documents, and 2 workflows.
#? This action cannot be undone. Continue? [y/N]
```

---

## Member Commands

### List Members

```bash
# List all project members
nesalia projects members list my-project

# List with roles
nesalia projects members list my-project --json
```

### Add Member

```bash
# Add member as editor
nesalia projects members add my-project alice@example.com --role editor

# Add member as admin
nesalia projects members add my-project alice@example.com --role admin

# Add member as viewer
nesalia projects members add my-project alice@example.com --role viewer

# Add multiple members
nesalia projects members add my-project alice@example.com,bob@example.com --role editor
```

### Update Member Role

```bash
# Change member role
nesalia projects members update my-project alice@example.com --role admin
```

### Remove Member

```bash
# Remove member from project
nesalia projects members remove my-project alice@example.com

# Remove without confirmation
nesalia projects members remove my-project alice@example.com --force
```

---

## Settings Commands

### Get Settings

```bash
# Get project settings
nesalia projects settings get my-project

# Output as JSON
nesalia projects settings get my-project --json
```

### Update Settings

```bash
# Update agent limit
nesalia projects settings update my-project --max-agents 10

# Update concurrent runs limit
nesalia projects settings update my-project --max-concurrent-runs 5

# Update document limits
nesalia projects settings update my-project --max-file-size 100 --max-files 100
```

### API Keys

```bash
# List API keys (names only)
nesalia projects settings keys list my-project

# Add API key
nesalia projects settings keys add my-project GITHUB_TOKEN

# Set API key value
nesalia projects settings keys set my-project GITHUB_TOKEN "ghp_xxxx"

# Remove API key
nesalia projects settings keys remove my-project GITHUB_TOKEN
```

### Environment Variables

```bash
# List environment variables
nesalia projects settings env list my-project

# Add environment variable
nesalia projects settings env set my-project DATABASE_URL "postgresql://..."

# Remove environment variable
nesalia projects settings env remove my-project DATABASE_URL
```

### Integrations

```bash
# List integrations
nesalia projects settings integrations list my-project

# Add integration
nesalia projects settings integrations add my-project github

# Remove integration
nesalia projects settings integrations remove my-project github
```

---

## Quick Actions

### List Agents

```bash
# List agents in project
nesalia projects agents list my-project
```

### List Documents

```bash
# List documents in project
nesalia projects docs list my-project
```

### List Workflows

```bash
# List workflows in project
nesalia projects workflows list my-project
```

---

## Transfer Commands

### Transfer Project

```bash
# Transfer to another organization
nesalia projects transfer my-project --to-org other-org

# Transfer requires approval from destination org owner
nesalia projects transfer my-project --to-org other-org
#? This will transfer "my-project" to "other-org".
#? An approval request will be sent to the org owner.
#? Continue? [y/N]
```

### Accept Transfer

```bash
# Accept pending transfer
nesalia projects transfer accept transfer-123
```

### Reject Transfer

```bash
# Reject pending transfer
nesalia projects transfer reject transfer-123
```

---

## Flags Reference

### Global Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--org <name>` | Target organization | Current org |
| `--json` | Output as JSON | false |
| `--quiet` | Suppress output | false |
| `--debug` | Show debug info | false |

### Project Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--type` | Project type | `--type client` |
| `--description` | Project description | `--description "..."` |
| `--status` | Project status | `--status active` |
| `--role` | Member role | `--role editor` |

### Pagination Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--page <n>` | Page number | 1 |
| `--per-page <n>` | Items per page | 20 |
| `--limit <n>` | Max items | 100 |

---

## Examples

### Complete Workflow

```bash
# 1. Create a new client project
nesalia projects create "Acme Corp" --type client --description "Main client for Q1 2026"

# 2. Add team members
nesalia projects members add "Acme Corp" alice@example.com --role admin
nesalia projects members add "Acme Corp" bob@example.com --role editor

# 3. Configure settings
nesalia projects settings update "Acme Corp" --max-agents 5
nesalia projects settings keys set "Acme Corp" GITHUB_TOKEN "ghp_xxxx"

# 4. List agents and documents in the project
nesalia projects agents list "Acme Corp"
nesalia projects docs list "Acme Corp"
```

### Client Management

```bash
# List all client projects
nesalia projects list --type client --status active

# Archive completed client project
nesalia projects archive "Acme Corp"

# View archived projects
nesalia projects list --status archived

# Restore if needed
nesalia projects restore "Acme Corp"
```

### Team Collaboration

```bash
# Onboard new team member to project
nesalia projects members add "Engineering" charlie@example.com --role editor

# Change their role later
nesalia projects members update "Engineering" charlie@example.com --role admin

# View current team
nesalia projects members list "Engineering"

# Remove when they leave
nesalia projects members remove "Engineering" charlie@example.com
```

### Project Configuration

```bash
# Set up API keys for a project
nesalia projects settings keys set "Client A" OPENAI_API_KEY "sk-xxxx"
nesalia projects settings keys set "Client A" GITHUB_TOKEN "ghp_xxxx"

# Set environment variables
nesalia projects settings env set "Client A" DATABASE_URL "postgresql://..."
nesalia projects settings env set "Client A" REDIS_URL "redis://..."

# View configuration
nesalia projects settings get "Client A" --json
```

---

## Related Documents

- [Projects](./projects.md) — Project feature specification
- [Organizations](../organizations.md) — Organization CLI commands