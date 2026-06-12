---
title: Documents CLI Reference
description: CLI commands for document management
status: draft
version: 0.1.0
category: cli
tags: [cli, documents, commands]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead]
related:
  - features/documents/documents.md
  - features/nesalia-create-cli.md
priority: medium
stability: experimental
---

# Documents CLI Reference

All CLI commands for managing documents in Nesalia.

---

## Core Commands

### List Documents

```bash
# List all accessible documents
nesalia docs list

# List documents in specific organization
nesalia docs list --org my-org

# List documents in specific project
nesalia docs list --project my-project

# Filter by type
nesalia docs list --type handbook
nesalia docs list --type contract

# Include archived documents
nesalia docs list --archived

# Output as JSON
nesalia docs list --json
```

### Get Document

```bash
# Get document by ID
nesalia docs get handbook-team

# Get document with full details
nesalia docs get contract-123 --json

# Get document with versions
nesalia docs get handbook-team --include-versions
```

### Create Document

```bash
# Create org-level document
nesalia docs create "Team Handbook" --type handbook
nesalia docs create "Security Policy" --type policy --org my-org

# Create project-level document
nesalia docs create "Contract" --type contract --project client-a
nesalia docs create "Technical Specs" --type spec --project my-project

# Create with content
nesalia docs create "Meeting Notes" --type note --content "Meeting notes..."

# Create with tags
nesalia docs create "Onboarding Guide" --type handbook --tags important,onboarding

# Create in folder
nesalia docs create "Template 1" --type template --folder Templates
```

### Update Document

```bash
# Update document name
nesalia docs update handbook-team --name "New Name"

# Update document content
nesalia docs update contract-123 --content "Updated content..."

# Update tags
nesalia docs update handbook-team --tags important,onboarding,team

# Update type
nesalia docs update meeting-notes --type note

# Batch update (future)
nesalia docs update --filter "type=handbook" --tags archived
```

### Upload File

```bash
# Upload file to organization
nesalia docs upload ./contract.pdf --name "Contract PDF"

# Upload to project
nesalia docs upload ./design.png --project client-a --name "Design Mockup"

# Upload with type
nesalia docs upload ./image.jpg --project my-project --type file

# Upload to specific folder
nesalia docs upload ./doc.pdf --folder "Contracts"
```

### Archive Document

```bash
# Archive single document
nesalia docs archive handbook-team

# Archive with confirmation
nesalia docs archive contract-123
#? This will archive "Contract". Continue? [y/N]

# Force archive (skip confirmation)
nesalia docs archive handbook-team --force
```

### Restore Document

```bash
# Restore archived document
nesalia docs restore handbook-team

# Restore specific version
nesalia docs restore handbook-team --version 3
```

### Delete Document

```bash
# Delete document (requires confirmation)
nesalia docs delete handbook-team

# Force delete (skip confirmation)
nesalia docs delete handbook-team --force

# Delete multiple (future)
nesalia docs delete handbook-team contract-123
```

---

## Movement Commands

### Move Document

```bash
# Move to different project
nesalia docs move handbook-team --to-project new-project

# Move to organization level
nesalia docs move contract-123 --to-org-level

# Move from org to project
nesalia docs move onboarding-guide --to-project client-a

# Move with new name
nesalia docs move handbook --to-project client-a --name "Client Handbook"
```

---

## Search Commands

### Search Documents

```bash
# Basic search
nesalia docs search "onboarding"

# Search with type filter
nesalia docs search "contract" --type contract

# Search in project
nesalia docs search "spec" --project my-project

# Search in organization
nesalia docs search "policy" --org my-org

# JSON output
nesalia docs search "handbook" --json

# Search with pagination
nesalia docs search "notes" --page 2 --per-page 20

# Fuzzy search (future)
nesalia docs search "onboardng" --fuzzy
```

---

## Version Commands

### List Versions

```bash
# List all versions
nesalia docs versions list handbook-team

# List with content preview
nesalia docs versions list handbook-team --preview

# List specific number
nesalia docs versions list handbook-team --limit 10
```

### Create Version

```bash
# Create version with note
nesalia docs versions create handbook-team --note "Major update"

# Create checkpoint
nesalia docs versions create handbook-team --note "Checkpoint before restructure"
```

### Restore Version

```bash
# Restore to specific version
nesalia docs versions restore handbook-team --version 3

# Preview version before restore
nesalia docs versions preview handbook-team --version 3

# Restore as new document
nesalia docs versions restore handbook-team --version 2 --as-new
```

---

## Folder Commands

### List Folders

```bash
# List all folders
nesalia docs folders list

# List folders in project
nesalia docs folders list --project my-project

# List folders in organization
nesalia docs folders list --org my-org
```

### Create Folder

```bash
# Create folder in project
nesalia docs folders create "Templates" --project my-project

# Create folder in organization
nesalia docs folders create "Contracts" --org my-org

# Create nested folder
nesalia docs folders create "2026 Contracts" --parent "Contracts"
```

### Manage Folder Contents

```bash
# Add document to folder
nesalia docs folders add handbook-team --folder Templates

# Remove document from folder
nesalia docs folders remove handbook-team --folder Templates

# Move folder contents
nesalia docs folders move "Old Folder" --to "New Folder"
```

---

## Sharing Commands

### Share Document

```bash
# Share with specific members
nesalia docs share handbook-team --members alice@example.com,bob@example.com

# Make public
nesalia docs share handbook-team --public

# Share with permission level
nesalia docs share contract-123 --members alice@example.com --permission view

# Share with expiration (future)
nesalia docs share handbook-team --members alice@example.com --expires "2026-12-31"
```

### Revoke Access

```bash
# Revoke from member
nesalia docs share handbook-team --revoke alice@example.com

# Revoke public access
nesalia docs share handbook-team --revoke-public

# Revoke all sharing
nesalia docs share handbook-team --revoke-all
```

---

## Export Commands

### Export Document

```bash
# Export as Markdown
nesalia docs export handbook-team --format markdown

# Export as PDF
nesalia docs export contract-123 --format pdf

# Export as JSON
nesalia docs export handbook-team --format json

# Export to specific directory
nesalia docs export contract-123 --format pdf --output ./downloads

# Export with filename
nesalia docs export handbook-team --format md --output ./exports --filename "handbook.md"
```

---

## Flags Reference

### Global Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--org <name>` | Target organization | Current org |
| `--project <name>` | Target project | None |
| `--json` | Output as JSON | false |
| `--quiet` | Suppress output | false |
| `--debug` | Show debug info | false |

### Document Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--type` | Document type | `--type handbook` |
| `--content` | Document content | `--content "Notes..."` |
| `--tags` | Comma-separated tags | `--tags a,b,c` |
| `--archived` | Include archived | `--archived` |
| `--format` | Export format | `--format markdown` |
| `--output` | Output directory | `--output ./docs` |

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
# 1. Create a new handbook
nesalia docs create "Team Handbook" --type handbook --org my-org --tags team,onboarding

# 2. Add content
nesalia docs update handbook-team --content "# Team Handbook\n\n## Onboarding\n\nWelcome..."

# 3. Create a folder for templates
nesalia docs folders create "Templates" --org my-org

# 4. Move handbook to folder
nesalia docs folders add handbook-team --folder Templates

# 5. Share with team
nesalia docs share handbook-team --members alice@example.com,bob@example.com

# 6. Create version checkpoint
nesalia docs versions create handbook-team --note "Added new section"

# 7. Export for external use
nesalia docs export handbook-team --format pdf --output ./exports
```

### Search and Filter

```bash
# Find all handbooks
nesalia docs list --type handbook

# Find in specific project
nesalia docs search "contract" --project client-a

# Find with multiple tags
nesalia docs list --tags important,onboarding --type handbook

# Find archived documents
nesalia docs list --archived

# Search and export
nesalia docs search "policy" --org my-org --json | jq '.data[].id' | xargs -I{} nesalia docs export {} --format md
```

### Project Document Management

```bash
# Create project document
nesalia docs create "Technical Specs" --type spec --project api-service

# Upload supporting files
nesalia docs upload ./api-spec.pdf --project api-service --name "API Specification"

# Search within project
nesalia docs search "endpoint" --project api-service

# Export all project docs
nesalia docs list --project api-service --json | jq '.data[].id' | xargs -I{} nesalia docs export {} --format md --output ./api-docs
```

---

## Related Documents

- [Documents](./documents.md) — Document feature specification
- [Organizations CLI](../organizations.md#cli-commands) — Organization CLI commands
- [Projects CLI](../projects.md#cli-commands) — Project CLI commands
- [CLI Template Manager](../nesalia-create-cli.md) — Project scaffolding CLI