# CLI — nesalia.com/cli

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   CLI                                                           │
│                                                                 │
│   Control Nesalia from your terminal.                           │
│                                                                 │
│   Fast, powerful CLI for local development, scripts,           │
│   and CI/CD pipelines.                                          │
│                                                                 │
│   [Get Started]  [Read the Docs]  [View on GitHub]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Control Nesalia from your terminal.

**Subheadline:**
```
Fast, powerful CLI for local development, scripts,
and CI/CD pipelines.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs
- Tertiary: View on GitHub

---

## What is the CLI?

The Nesalia CLI provides **command-line access** to all platform features.

### Installation

```bash
npm install -g @nesalia/cli
# or
npx nesalia <command>
# or
brew install nesalia  # macOS
```

### Verify Installation

```bash
nesalia --version
# nesalia/1.0.0 darwin-arm64 node-v22.0.0
```

---

## Authentication

### Login

```bash
# Interactive login
nesalia auth login

# Output:
# Opening browser for authentication...
# ✓ Logged in as marty@nesalia.com
```

### Logout

```bash
nesalia auth logout
# ✓ Logged out
```

### Check Status

```bash
nesalia auth status
# ✓ Logged in as marty@nesalia.com
# Token: ••••••••1234 (expires in 30 days)
```

### API Key (Non-Interactive)

```bash
# Use API key instead of browser login
export NESALIA_API_KEY=your_api_key

# Or inline
nesalia agents list --api-key your_api_key
```

---

## Commands

### `nesalia agents`

Manage and invoke agents.

```bash
# List all agents
nesalia agents list

# Output:
# NAME              MODEL                      CREATED
# code-reviewer     claude-sonnet-4-6          2h ago
# tech-writer       gpt-5.4                    5h ago
# security-expert   claude-opus-4-8            1d ago

# Create an agent
nesalia agents create \
  --name "my-agent" \
  --model "anthropic/claude-sonnet-4-6" \
  --instructions "You are a helpful assistant."

# Get agent details
nesalia agents get code-reviewer

# Invoke an agent
nesalia agents invoke code-reviewer \
  --prompt "Review PR #123"

# Stream response
nesalia agents stream code-reviewer \
  --prompt "Explain this code"

# Delete an agent
nesalia agents delete code-reviewer
```

### `nesalia contexts`

Manage agent contexts.

```bash
# List contexts
nesalia contexts list --agent code-reviewer

# Output:
# NAME              ID              LAST ACTIVE
# PR #123           ctx_abc123      5m ago
# PR #456           ctx_def456      1h ago
# Weekly Report     ctx_ghi789      3h ago

# Create a context
nesalia contexts create \
  --agent code-reviewer \
  --name "PR #789" \
  --metadata '{"pr": 789}'

# Switch context
nesalia contexts switch \
  --agent code-reviewer \
  --context ctx_abc123

# View history
nesalia contexts history \
  --agent code-reviewer \
  --context ctx_abc123

# Delete context
nesalia contexts delete \
  --agent code-reviewer \
  --context ctx_abc123
```

### `nesalia workflows`

Manage and run workflows.

```bash
# List workflows
nesalia workflows list

# Deploy a workflow
nesalia workflows deploy ./release.ts \
  --name "release-automation"

# Run a workflow
nesalia workflows run release-automation

# Run with input
nesalia workflows run release-automation \
  --input '{"pr": 123, "branch": "feature/test"}'

# List runs
nesalia workflows runs release-automation

# Output:
# ID              STATUS      DURATION   STARTED
# run_abc123      ✓ Complete  2m 34s     5m ago
# run_def456      ● Running   1m 12s     1m ago
# run_ghi789      ○ Queued    -          pending

# Watch a run
nesalia workflows run release-automation --watch

# Get run details
nesalia workflows run release-automation --run run_abc123

# Stream logs
nesalia workflows logs release-automation --run run_abc123

# Cancel a run
nesalia workflows cancel release-automation --run run_def456

# Delete workflow
nesalia workflows delete release-automation
```

### `nesalia config`

Manage CLI configuration.

```bash
# List config
nesalia config list

# Output:
# api-key:       ••••••••1234
# default-agent:  code-reviewer
# default-model: anthropic/claude-sonnet-4-6
# output-format: table

# Set config
nesalia config set default-agent my-agent
nesalia config set output-format json

# Delete config
nesalia config delete default-agent
```

### `nesalia marty`

Manage Marty bot (GitHub integration).

```bash
# Install Marty on a repo
nesalia marty install --repo owner/repo

# List configured repos
nesalia marty repos

# Configure default agent
nesalia marty config set default-agent code-reviewer

# Test configuration
nesalia marty test --repo owner/repo
```

---

## Output Formats

### Table (Default)

```bash
nesalia agents list
# NAME              MODEL                      CREATED
# code-reviewer     claude-sonnet-4-6          2h ago
# tech-writer       gpt-5.4                    5h ago
```

### JSON

```bash
nesalia agents list --format json
# [
#   { "name": "code-reviewer", "model": "claude-sonnet-4-6", ... },
#   { "name": "tech-writer", "model": "gpt-5.4", ... }
# ]
```

### YAML

```bash
nesalia agents list --format yaml
```

---

## Options

Global options available on all commands:

| Option | Description |
|--------|-------------|
| `--api-key <key>` | API key to use |
| `--base-url <url>` | API base URL |
| `--format <format>` | Output format (table, json, yaml) |
| `--no-color` | Disable colors |
| `--quiet` | Suppress non-essential output |
| `--debug` | Enable debug logging |

---

## Scripting

### Shell Script

```bash
#!/bin/bash

# Review a PR
PR_NUMBER=$1
nesalia agents invoke code-reviewer \
  --prompt "Review PR #$PR_NUMBER" \
  --context "pr-$PR_NUMBER"
```

### Node.js Script

```javascript
// scripts/review.js
import { spawn } from 'child_process';

const prNumber = process.argv[2];

const proc = spawn('nesalia', [
  'agents', 'invoke', 'code-reviewer',
  '--prompt', `Review PR #${prNumber}`,
  '--format', 'json'
], { stdio: 'inherit' });

proc.on('close', (code) => process.exit(code));
```

### CI/CD Integration

```yaml
# .github/workflows/review.yml
name: AI Code Review

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install NESALIA CLI
        run: npm install -g @nesalia/cli

      - name: Run Review
        env:
          NESALIA_API_KEY: ${{ secrets.NESALIA_API_KEY }}
        run: |
          nesalia agents invoke code-reviewer \
            --prompt "Review PR #${{ github.event.pull_request.number }}"
            --context "pr-${{ github.event.pull_request.number }}"
```

---

## FAQ

**How do I get my API key?**

Run `nesalia auth login` for browser-based authentication, or create an API key in the dashboard under Settings → API Keys.

**Can I use the CLI in CI/CD?**

Yes. Set the `NESALIA_API_KEY` environment variable and run any CLI command.

**How do I see all available commands?**

```bash
nesalia --help      # Global help
nesalia agents --help     # Agents help
nesalia workflows --help # Workflows help
```

**Can I pipe output to other commands?**

Yes. Use `--format json` or `--format yaml` for machine-readable output.

---

## CTA

**Headline:** Take control from the terminal.

- Primary CTA: npm install -g @nesalia/cli
- Secondary CTA: Read the Docs
- Tertiary CTA: View on GitHub