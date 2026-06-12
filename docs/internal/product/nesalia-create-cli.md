---
title: "@nesalia/create — CLI Template Manager"
description: CLI scaffolding tool for bootstrapping Nesalia projects
status: draft
version: 0.1.0
category: developer-tooling
tags: [cli, templates, scaffolding, dx]
author: Product Team
created: 2026-12
updated: 2026-12
reviewers: [eng-lead]
related:
  - features/agents.md
  - features/projects.md
  - features/workflows.md
priority: high
stability: experimental
requires:
  - templates
  - plugin-system
impact:
  users: developers
  complexity: high
---

# @nesalia/create — CLI Template Manager

## Overview

`@nesalia/create` is the official CLI scaffolding tool for Nesalia. It provides developers with a fast, intuitive way to bootstrap new projects using pre-built templates.

## CLI Syntax

```bash
# Create a new project
nesalia create [project-name] [options]

# Initialize Nesalia in an existing project
nesalia init [options]

# Manage cached templates
nesalia cache <subcommand>

# Show help for any command
nesalia <command> --help
nesalia help <command>

# Show version
nesalia --version
```

### Create Command

```bash
nesalia create [project-name] [options]

# Options:
#   -t, --template <name>       Template to use
#   --no-git                    Skip git initialization
#   --no-install                Skip dependency installation
#   --no-cache                  Force fresh download (ignore cache)
#   -y, --yes                   Accept all defaults (silent mode)
#   -d, --dir <path>            Target directory (default: project-name)
#   -c, --cwd <path>            Working directory
#   --offline                   Use only cached templates
#   --search <term>             Search templates
#   --list                      List all available templates
#   --preview <name>            Preview template contents
#   --debug                     Show debug information

# Examples:
nesalia create my-agent
nesalia create my-app --template agent-api
nesalia create . --template workflow --no-git
nesalia create api-service --template agent-api --yes
nesalia create . --offline --no-install
```

### Init Command

```bash
nesalia init [options]

# Options:
#   --force                     Overwrite existing config
#   --template <name>          Template to base config on
#   -y, --yes                   Accept all defaults

# Examples:
nesalia init
nesalia init --force
nesalia init --template agent-api
```

### Cache Commands

```bash
# List cached templates
nesalia cache list

# Show cache size and location
nesalia cache status

# Clean all cached templates
nesalia cache clean

# Update official templates
nesalia cache update

# Add a local template to cache
nesalia cache add ./path/to/local-template

# Remove a template from cache
nesalia cache remove <template-name>
```

### Global Options

```bash
# All commands support these global options:
nesalia --version           # Show version
nesalia --help              # Show global help
nesalia --debug             # Enable debug mode
nesalia --no-color          # Disable color output
nesalia --quiet             # Suppress non-error output
nesalia --verbose           # Show detailed output
```

## Problem Statement

Developers face friction when:
- Setting up new projects from scratch
- Discovering and choosing the right template for their use case
- Managing multiple project configurations across teams

## Target Users

1. **Individual developers** — quick start without deep configuration
2. **Teams** — consistent project scaffolding across organization
3. **Platform engineers** — create and distribute internal templates

## User Experience Goals

### Speed
- First interaction to running project in under 30 seconds
- Minimal prompts (smart defaults, smart choices)
- Progress feedback for long-running operations

### Clarity
- Clear template descriptions with use-case fit
- Visible configuration options before commitment
- Helpful error messages with suggested fixes

### Flexibility
- Interactive mode for newcomers
- Silent mode for automation/CI
- Partial overrides (pick what you need)

## CLI Design Principles

### 1. Convention Over Configuration
Default to sensible choices. A simple `nesalia create my-app` should produce a working project without additional flags.

### 2. Progressive Disclosure
- Basic users: one command, done
- Advanced users: flags for customization
- Power users: config files for repeatability

### 3. Fail Fast, Fail Friendly
- Validate inputs before execution
- Explain what went wrong and how to fix it
- Never leave the user in an inconsistent state

### 4. Local First
- Work offline (templates cached locally)
- Prefer local config over remote
- Graceful degradation when network unavailable

## UX Patterns (2025 Best Practices)

### 1. First-Run Wizard
Guided setup on first use with sensible defaults and an escape hatch.

```
? Project name: my-agent
? Cloud region: us-east-1 (recommended)
? Initialize git? Yes

→ Wrote nesalia.config.ts
  Run `nesalia create --dry-run` to preview changes
```

### 2. Helpful Help
Don't just show flags — show examples and explain what each does.

```
nesalia create --help

Create a new Nesalia project

Examples:
  nesalia create my-agent              # Quick start
  nesalia create . --template api     # In current dir
  nesalia create api --yes            # Silent mode

Flags:
  --template  Choose a template (default: agent-api)
  --no-git    Skip git init (for CI/CD)
  --dry-run   Preview without creating files
```

### 3. Dry-Run with Diff
Show exactly what will happen before doing it.

```
nesalia create my-app --template agent-api --dry-run

Preview:
  ✓ Create src/agents/index.ts
  ✓ Create src/workflows/main.ts
  ✓ Create nesalia.config.ts
  ~ Modify package.json (add scripts)

Changes: 3 files, 0 deletions, 47 additions
```

### 4. Idempotent Commands
Running the same command twice should be safe.

```
nesalia init --force   # Re-run without error
nesalia create my-app  # Idempotent — safe to retry
```

### 5. Structured Output (JSON)
For automation, provide machine-readable output.

```bash
nesalia create my-app --template agent-api --json

{
  "success": true,
  "project": {
    "name": "my-app",
    "path": "./my-app",
    "template": "agent-api"
  },
  "files": ["src/index.ts", "nesalia.config.ts"],
  "plugins": ["database", "cache"]
}
```

### 6. Smart Errors
Don't just show errors — suggest fixes.

```
✗ Template "agent-api" not found

Did you mean?
  • agent-api-starter
  • agent-api-advanced

Run `nesalia create --search "agent"` to find templates
```

### 7. Honest Progress
Show what's happening, not just a spinner.

```
Creating project...
  ✓ Fetching template from GitHub
  ✓ Stripping git metadata
  → Running plugins...
    ✓ Database plugin (PostgreSQL selected)
    ✓ Cache plugin (Redis configured)
  ✓ Installing dependencies (47 packages)
  ✓ Running post-install scripts

Done in 12.3s
```

### 8. Shell Completion
Enable tab completion for commands and flags.

```bash
nesalia completion bash >> ~/.bashrc
nesalia completion zsh >> ~/.zshrc

# Now users can type:
nesalia create <TAB>           # Shows project names
nesalia create --template <TAB> # Shows templates
nesalia cache <TAB>            # Shows cache commands
```

### 9. Context-Awareness
Detect project type and adapt behavior.

```
# Running in Next.js project
nesalia init
→ Detected: Next.js project
→ Suggested: Use --template nextjs-agent
→ Configuring: tRPC, Better Auth, Drizzle

# Running in empty directory
nesalia init
→ No project detected
→ Starting fresh with agent-api template
```

### 10. Suggest Similar Commands
Typo detection with suggestions.

```
nesalia creat my-app
↑ Unknown command: "creat"
↓ Did you mean: "create"

Run `nesalia help` for available commands
```

## Core Commands

### `nesalia create [project-name]`

Primary command for project creation.

**Behavior:**
1. Detect current directory context
2. Fetch template (from cache, GitHub, or bundled)
3. Apply template with user overrides (plugin system)
4. Strip git metadata (if fetching from GitHub)
5. Initialize fresh git repository (optional)
6. Install dependencies (optional)

**Template Fetch Flow:**
```
User runs: nesalia create my-app --template agent-api

1. Check local cache → found? use it
2. Check GitHub → nesalia/template-agent → fetch files
3. Strip .git directory → no remote origin
4. Apply plugins → prompts, generate, configure
5. Done → clean project, ready to git init
```

**Flags:**
- `--template <name>` — skip template selection
- `--no-git` — skip git initialization
- `--no-install` — skip dependency installation
- `--yes` — accept all defaults (silent mode)

### `nesalia init`

Initialize Nesalia in an existing project.

**Behavior:**
1. Detect project type (Next.js, Node, etc.)
2. Add Nesalia configuration file
3. Configure available integrations

### `nesalia create --help`

Comprehensive help with examples.

## Template System

### Template Registry

Templates are discovered from:
1. Official Nesalia templates (bundled)
2. GitHub repositories (`nesalia/template-*`)
3. Local template directories
4. Organization templates (future)

### Template Sources

#### GitHub Repository (Template Mode)

When a template is hosted on GitHub, the CLI uses a **template fetch** approach (not a git clone):

1. **Fetch without git** — Download files directly via GitHub API or `git archive`
2. **Strip git history** — Remove `.git` directory and all git metadata
3. **No remote origin** — The resulting project has no remote connection
4. **Clean slate** — User can init their own git repository from scratch

**Why not git clone?**
- Avoids carrying over git history, branches, remotes
- Prevents accidental pushes to the template repository
- Smaller download (no history)
- Clean project state for the user

**Implementation:**
```bash
# Option 1: GitHub API (no auth required for public repos)
gh api repos/nesalia/template-agent/contents --jq '.[].download_url' | xargs -I{} wget {}

# Option 2: git archive (preserves directory structure)
git archive --format=tar --remote=https://github.com/nesalia/template-agent main | tar -xf-

# Then strip .git directory
rm -rf .git
```

#### Local Template Directory

Templates can also be local for development/testing:

```
~/.nesalia/templates/
├── agent-api/
├── workflow-automation/
└── webhook-handler/
```

#### Bundled Templates

Official templates are bundled with the CLI binary for instant availability offline.

### Template Metadata

```json
{
  "name": "agent-api",
  "displayName": "Agent API",
  "description": "Build API-powered agents with TypeScript",
  "category": "agent",
  "tags": ["typescript", "api", "tRPC"],
  "requires": ["node >= 18"],
  "recommendedFor": ["api-developers", "fullstack"]
}
```

## Plugin System

Templates can define **plugins** that handle setup logic. Each plugin is responsible for a specific piece of configuration and can prompt the user, generate files, and configure dependencies.

### Plugin Architecture

```
template/
├── nesalia.config.ts    # Template + plugin definitions
└── plugins/
    ├── database/          # Database plugin
    │   ├── index.ts       # Plugin logic
    │   └── prompts.ts     # User prompts
    ├── cache/             # Cache plugin
    │   ├── index.ts
    │   └── prompts.ts
    └── auth/              # Auth plugin
        ├── index.ts
        └── prompts.ts
```

### Plugin Definition

Plugins are defined in `nesalia.config.ts`:

```typescript
import { defineConfig } from '@nesalia/create'

export default defineConfig({
  name: 'agent-api',
  description: 'Build API-powered agents',

  plugins: [
    {
      name: 'database',
      enabled: true,
      required: false,
      options: {
        providers: ['postgresql', 'mysql', 'sqlite']
      }
    },
    {
      name: 'cache',
      enabled: true,
      required: false,
      options: {
        providers: ['redis', 'memory', 'none']
      }
    }
  ]
})
```

### Plugin Interface

Each plugin implements:

```typescript
interface NesaliaPlugin {
  // Plugin metadata
  name: string
  description: string

  // Prompts to ask the user
  prompts(): PluginPrompt[]

  // Validate user inputs
  validate(context: SetupContext): ValidationResult

  // Generate files and configuration
  generate(context: SetupContext): GenerationResult

  // Configure dependencies
  dependencies(): PackageDependency[]

  // Modify existing files
  modifyFiles?: FileModification[]
}
```

### PluginPrompt Schema

```typescript
interface PluginPrompt {
  name: string              // Variable name (used in templates as {{database.provider}})
  type: 'select' | 'input' | 'confirm' | 'password'
  message: string           // Prompt message
  default?: any             // Default value
  choices?: { label: string, value: string }[]  // For select type
  validate?: (value: any) => string | null      // Return error message or null
  when?: (context: SetupContext) => boolean    // Conditional display
  secret?: boolean          // Hide input for passwords
}
```

### Example: Database Plugin

**plugins/database/prompts.ts**
```typescript
export const databasePrompts = [
  {
    name: 'provider',
    type: 'select',
    message: 'Choose your database',
    choices: [
      { label: 'PostgreSQL (recommended)', value: 'postgresql' },
      { label: 'MySQL', value: 'mysql' },
      { label: 'SQLite (for local dev)', value: 'sqlite' }
    ],
    default: 'postgresql'
  },
  {
    name: 'connectionString',
    type: 'input',
    message: 'Database connection string',
    default: 'postgresql://localhost:5432/myapp',
    when: (ctx) => ctx.database.provider !== 'sqlite'
  },
  {
    name: 'enableMigrations',
    type: 'confirm',
    message: 'Enable database migrations?',
    default: true
  }
]
```

**plugins/database/index.ts**
```typescript
export const databasePlugin: NesaliaPlugin = {
  name: 'database',
  description: 'Configure database connection and ORM',

  prompts: () => databasePrompts,

  validate: (context) => {
    const { provider, connectionString } = context.database
    if (provider === 'postgresql' && !connectionString.includes('postgresql://')) {
      return { valid: false, error: 'Invalid PostgreSQL connection string' }
    }
    return { valid: true }
  },

  generate: (context) => {
    const { provider, connectionString } = context.database

    return {
      files: [
        {
          path: 'src/db/config.ts',
          content: generateDbConfig(provider, connectionString)
        },
        {
          path: 'drizzle.config.ts',
          content: generateDrizzleConfig(provider)
        }
      ],
      env: {
        'DATABASE_URL': connectionString
      }
    }
  },

  dependencies: () => [
    { name: 'drizzle-orm', version: '^0.30' },
    { name: 'drizzle-kit', version: '^0.20', dev: true },
    ...getDbDriverDeps(provider)
  ]
}
```

### Example: Cache Plugin

**plugins/cache/prompts.ts**
```typescript
export const cachePrompts = [
  {
    name: 'provider',
    type: 'select',
    message: 'Choose your cache provider',
    choices: [
      { label: 'Redis (recommended)', value: 'redis' },
      { label: 'Memory (for local dev)', value: 'memory' },
      { label: 'None (skip caching)', value: 'none' }
    ],
    default: 'redis'
  },
  {
    name: 'redisUrl',
    type: 'input',
    message: 'Redis connection URL',
    default: 'redis://localhost:6379',
    when: (ctx) => ctx.cache.provider === 'redis'
  },
  {
    name: 'ttl',
    type: 'input',
    message: 'Default cache TTL (seconds)',
    default: '3600',
    validate: (v) => /^\d+$/.test(v) ? null : 'Must be a number'
  }
]
```

### Plugin Execution Order

1. **Collect all prompts** — Aggregate prompts from all enabled plugins
2. **Group by category** — Group prompts logically (project → database → cache → auth)
3. **Execute prompts** — Run interactive or silent mode
4. **Validate inputs** — Each plugin validates its own inputs
5. **Generate files** — Plugins generate files in dependency order
6. **Install deps** — Collect all dependencies and install
7. **Post-install** — Run any post-install scripts

### Template Variable Interpolation

Template files use `{{variable.path}}` syntax:

```
// src/agents/config.ts
export const config = {
  cache: {
    provider: '{{cache.provider}}',    // redis
    ttl: {{cache.ttl}}                 // 3600
  },
  db: {
    provider: '{{database.provider}}', // postgresql
  }
}
```

### Conditional Files

Files can be conditionally included based on plugin answers:

```json
{
  "files": [
    { "path": "src/db/postgres.ts", "when": { "database.provider": "postgresql" } },
    { "path": "src/db/mysql.ts", "when": { "database.provider": "mysql" } },
    { "path": "src/cache/redis.ts", "when": { "cache.provider": "redis" } }
  ]
}
```

### Plugin Communication

Plugins can reference each other's answers:

```typescript
// Auth plugin can use database provider
{
  name: 'sessionStore',
  type: 'select',
  message: 'Where to store sessions?',
  choices: (context) => [
    { label: 'Database (using ' + context.database.provider + ')', value: 'db' },
    { label: 'Redis', value: 'redis' }
  ]
}
```

### Error Handling per Plugin

```typescript
generate: (context) => {
  try {
    return { files: [...], env: {...} }
  } catch (error) {
    return {
      error: true,
      message: 'Failed to generate database config',
      suggestion: 'Check your connection string format'
    }
  }
}
```

## Plugin Registry (Official)

| Plugin | Description | Required | Default |
|--------|-------------|----------|---------|
| `database` | Database connection & ORM setup | No | postgresql |
| `cache` | Cache provider configuration | No | redis |
| `auth` | Authentication provider setup | No | better-auth |
| `storage` | File storage (S3, local) | No | none |
| `telemetry` | Observability (logs, traces) | No | none |
| `monitoring` | Health checks & metrics | No | none |

## Custom Plugins

Template authors can create custom plugins:

```
my-template/
├── nesalia.config.ts
└── plugins/
    └── custom-plugin/
        ├── index.ts      # Plugin implementation
        └── prompts.ts    # Plugin prompts
```

Custom plugins follow the same interface as official plugins.

## Silent Mode with Plugins

In CI mode, plugins use defaults or environment variables:

```bash
NESALIA_DATABASE_PROVIDER=postgresql \
NESALIA_CACHE_PROVIDER=redis \
nesalia create my-app --template agent-api --yes
```

Environment variable mapping: `NESALIA_<PLUGIN>_<PROMPT_NAME>`

## Interactive Mode

### Template Selection

```
? Select a template (Use arrow keys, Enter to select)
  ❯ agent-api — Build API-powered agents
    workflow-automation — Chain agents into workflows
    webhook-handler — Handle incoming webhooks
    chatbot — Conversational AI interface
    (View all templates →)
```

### Configuration Prompts

```
? Project name: my-agent
? Include sample agents: Yes
? Choose auth provider: (Use arrow keys)
  ❯ Better Auth (recommended)
    Auth.js
    Custom
```

### Progress Indicators

```
Creating project...
✓ Cloning template
✓ Installing dependencies (12 packages)
✓ Running post-install scripts
✓ Initializing git

Done! Your project is ready at ./my-agent
```

## Silent Mode (Automation)

For CI/CD and scripts:

```bash
nesalia create my-app --template agent-api --yes --no-git
```

All prompts answered with defaults or explicitly overridden.

## Output Artifacts

### Generated Project Structure

```
my-app/
├── nesalia.config.ts      # Nesalia configuration
├── package.json
├── tsconfig.json
├── src/
│   ├── agents/            # Agent definitions
│   ├── workflows/          # Workflow definitions
│   └── index.ts           # Entry point
├── .env.example           # Environment template
└── README.md              # Project-specific docs
```

### Configuration File

`nesalia.config.ts` is generated with:
- Template-specific defaults
- Clear comments explaining options
- Links to relevant documentation

## Error Handling

### Network Errors

```
✗ Failed to fetch templates
  → Check your internet connection
  → Using cached templates (3 available)

  Run `nesalia create --offline` to use only cached templates
```

### Invalid Template

```
✗ Template "unknown-template" not found

  Available templates:
  • agent-api
  • workflow-automation
  • webhook-handler

  Run `nesalia create --list` to see all templates
```

### Permission Errors

```
✗ Cannot create directory "my-app"
  → Directory already exists
  → Choose a different name or use `--force` to overwrite

  Run `nesalia create my-app --force`
```

### Node.js Version Mismatch

```
✗ Template requires Node.js >= 20
  → Current version: 18.17.0

  Consider using nvm to switch Node versions:
  nvm install 20
  nvm use 20
```

## Offline Behavior

### Cached Templates

- Official templates are cached on first use
- Cache location: `~/.nesalia/templates/`
- `nesalia create --offline` uses only cached templates

### Cache Management

```
nesalia cache list     # Show cached templates
nesalia cache clean    # Remove all cached templates
nesalia cache update   # Refresh official templates
```

## Configuration Hierarchy

Settings are resolved in order of precedence (highest first):
1. Command-line flags
2. Environment variables (`NESALIA_*`)
3. Local config file (`nesalia.config.ts`)
4. Global config (`~/.nesalia/config.json`)
5. Built-in defaults

## UX Metrics

| Action | Target Time |
|--------|-------------|
| Help displayed | < 100ms |
| Template list fetched | < 500ms |
| Project created (no deps) | < 5s |
| Project created (with deps) | < 30s |
| Error message displayed | < 50ms |

## Success Criteria

1. **New user creates first project in under 60 seconds**
2. **No documentation required for basic use case**
3. **Error messages lead to resolution without external search**
4. **Power users can automate 100% of flows**

## Future Enhancements

### Near Term
- Template search (`nesalia create --search "api"`)
- Template preview (`nesalia create --preview agent-api`)
- Team templates via organization config

### Long Term
- Template marketplace (community templates)
- Template versioning
- Template diff/merge for updates

## Competitor Analysis

| Feature | Nesalia Create | create-next-app | create-t3-app |
|---------|----------------|-----------------|---------------|
| Interactive selection | ✓ | ✓ | ✓ |
| Silent mode | ✓ | ✓ | ✓ |
| Offline support | ✓ | ✗ | ✗ |
| Template preview | Planned | ✗ | ✗ |
| Local templates | ✓ | ✗ | ✗ |

## Output & Formatting

### Color Strategy
Use colors purposefully to communicate meaning:

```
✓ Green  — Success, completed steps
✗ Red    — Errors, failed steps
! Yellow — Warnings, non-critical issues
→ Cyan   — Actions, next steps
● Gray   — Info, neutral messages
```

### Emoji Usage
Use emojis sparingly for quick visual parsing:

```
✨ Project created successfully
⚠ Warning: Using default database
❌ Error: Template not found
🔧 Run: nesalia init --force
📦 Dependencies installed (47 packages)
```

### Terminal Detection
Always check if terminal supports colors:

```bash
# Check NO_COLOR env var
# Check TERM env var
# Detect color support via tput

nesalia --no-color  # Force plain output
```

### Tables for List Output
Use ASCII tables for structured data:

```
┌─────────────────┬────────────────────┬─────────┐
│ Template        │ Description         │ Version │
├─────────────────┼────────────────────┼─────────┤
│ agent-api       │ API-powered agents │ 1.2.0   │
│ workflow-auto   │ Workflow builder    │ 0.9.0   │
│ webhook-handler │ Webhook processor   │ 1.0.0   │
└─────────────────┴────────────────────┴─────────┘
```

### Spinners and Progress
Use spinners for ongoing operations:

```
Creating project...
⠋ Fetching template
⠙ Processing plugins
⠹ Installing deps (47/47)
⠸ Done!
```

### Grep-able Output
Never replace words with emojis that users might want to search:

```
# Bad — can't grep for "error"
❌ Something went wrong

# Good — grep-friendly
[ERROR] Template not found
[SUCCESS] Project created at ./my-app
[INFO] Using cached template
```

## Brand Voice in CLI

- **Help text**: Concise, actionable, friendly
- **Error messages**: Explain + suggest + link
- **Progress**: Celebratory completion messages
- **Prompts**: Clear, with sensible defaults shown

Example help output:
```
nesalia create — Create a new Nesalia project

Usage:
  nesalia create [project-name] [options]

Options:
  -t, --template <name>    Template to use
  --no-git                 Skip git initialization
  --no-install             Skip dependency installation
  -y, --yes                 Accept all defaults
  -h, --help               Show this help

Examples:
  nesalia create my-agent
  nesalia create my-app --template agent-api
  nesalia create . --template workflow --no-git

Learn more: https://nesalia.dev/docs/cli/create
```