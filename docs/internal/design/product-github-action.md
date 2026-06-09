# GitHub Action — nesalia.com/github-action

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   GITHUB ACTION                                                 │
│                                                                 │
│   Trigger agents from your CI/CD pipeline.                     │
│                                                                 │
│   Code review, testing, deployment, and more — all automated    │
│   as part of your existing GitHub Actions workflow.           │
│                                                                 │
│   [View on GitHub]  [Read the Docs]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Trigger agents from your CI/CD pipeline.

**Subheadline:**
```
Code review, testing, deployment, and more — all automated
as part of your existing GitHub Actions workflow.
```

**CTAs:**
- Primary: View on GitHub
- Secondary: Read the Docs

---

## What is the GitHub Action?

The Nesalia GitHub Action lets you trigger AI agents directly from GitHub Actions workflows.

### Key Benefits

- **Zero config** — Just add to your workflow
- **Any agent** — Use any agent you create
- **Streaming output** — Real-time logs in GitHub
- **Secrets management** — Secure API key handling

---

## Features

### 1. Simple Syntax

Trigger agents with a single step.

```yaml
name: Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Review PR
        uses: nesalia/code-review@v1
        with:
          agent: code-reviewer
          api-key: ${{ secrets.NESALIA_API_KEY }}
          pr: ${{ github.event.pull_request.number }}
```

### 2. Streaming Logs

See agent output in real-time in GitHub Actions logs.

```
Run nesalia/code-review@v1
  Agent: code-reviewer
  PR: #123
  Context: pr-123

  [13:01] Initializing agent...
  [13:01] Fetching PR changes...
  [13:02] Analyzing code...
  [13:03] Found 2 issues:
  [13:03]   - Line 42: Missing null check
  [13:03]   - Line 58: Consider using const
  [13:04] Review complete.
```

### 3. Flexible Inputs

Configure agent invocation with flexible inputs.

```yaml
- name: Custom Review
  uses: nesalia/code-review@v1
  with:
    agent: my-agent
    api-key: ${{ secrets.NESALIA_API_KEY }}
    prompt: |
      Review only the authentication logic.
      Focus on security best practices.
    context: auth-module
    timeout: 300
```

### 4. Output Parsing

Parse agent output for use in subsequent steps.

```yaml
- name: Get Review
  id: review
  uses: nesalia/invoke@v1
  with:
    agent: code-reviewer
    prompt: "Review PR ${{ github.event.pull_request.number }}"

- name: Post Comment
  if: steps.review.outputs.has_issues == 'true'
  run: |
    echo "Issues found:"
    echo "${{ steps.review.outputs.issues }}"
```

### 5. Workflow Integration

Combine with other GitHub Actions.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  review:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: nesalia/code-review@v1
        with:
          agent: code-reviewer
          api-key: ${{ secrets.NESALIA_API_KEY }}

  deploy:
    needs: [test, review]
    if: github.ref == 'main'
    runs-on: ubuntu-latest
    steps:
      - uses: nesalia/deploy@v1
        with:
          agent: deployer
          api-key: ${{ secrets.NESALIA_API_KEY }}
```

---

## Usage Examples

### Code Review

```yaml
name: AI Code Review

on:
  pull_request:
    branches: [main, develop]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: AI Review
        uses: nesalia/code-review@v1
        with:
          agent: senior-reviewer
          api-key: ${{ secrets.NESALIA_API_KEY }}
```

### Security Scan

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Security Review
        uses: nesalia/security-scan@v1
        with:
          agent: security-expert
          api-key: ${{ secrets.NESALIA_API_KEY }}
          focus: vulnerabilities
```

### Documentation Check

```yaml
name: Documentation Check

on:
  pull_request:
    paths:
      - '**.md'
      - 'docs/**'

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Doc Review
        uses: nesalia/doc-check@v1
        with:
          agent: tech-writer
          api-key: ${{ secrets.NESALIA_API_KEY }}
```

### Automated Testing

```yaml
name: AI Test Generation

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate Tests
        uses: nesalia/generate-tests@v1
        with:
          agent: test-writer
          api-key: ${{ secrets.NESALIA_API_KEY }}
          coverage-target: 80
```

### Release Automation

```yaml
name: Release Workflow

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Release Manager
        uses: nesalia/release@v1
        with:
          agent: release-manager
          api-key: ${{ secrets.NESALIA_API_KEY }}
          version: ${{ github.ref_name }}
```

---

## Configuration

### Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `agent` | Yes | — | Agent ID or name |
| `api-key` | Yes | — | Nesalia API key |
| `prompt` | No | — | Custom prompt |
| `context` | No | — | Context identifier |
| `timeout` | No | 300 | Timeout in seconds |
| `stream` | No | true | Enable streaming |

### Outputs

| Output | Description |
|--------|-------------|
| `response` | Agent response text |
| `has_issues` | Whether issues were found |
| `issues` | JSON array of issues |
| `duration` | Execution duration |

### Environment Variables

```yaml
env:
  NESALIA_API_KEY: ${{ secrets.NESALIA_API_KEY }}
  NESALIA_BASE_URL: https://api.nesalia.com  # Optional
```

---

## Secrets

### Adding the API Key

```bash
# GitHub UI
# Settings → Secrets and variables → Actions → New repository secret
# Name: NESALIA_API_KEY
# Secret: your_api_key_here
```

### Using in Workflow

```yaml
- name: Use Agent
  uses: nesalia/invoke@v1
  with:
    agent: my-agent
    api-key: ${{ secrets.NESALIA_API_KEY }}
```

---

## Integrations

### Connected Products

```
GitHub Action works with:
├── Agents ──── Invokes agents
├── Workflows ── Can trigger workflows
├── SDK ──────── Underlying API
└── Marty ────── Different trigger (comments vs Actions)
```

### Workflow Patterns

```yaml
# Sequential
job1 → job2 → job3

# Parallel
job1 ─┬─ job2 ─┬─ job3
     │        │
     └────────┘

# Conditional
if: success()
if: failure()
if: always()
```

---

## Pricing

Usage is included in your Nesalia plan:
- **Free**: Limited invocations/month
- **Pro**: Higher limits
- **Enterprise**: Unlimited

No additional GitHub Action pricing.

---

## FAQ

**What's the difference between Marty and the GitHub Action?**

| Feature | Marty | GitHub Action |
|----------|-------|---------------|
| Trigger | Comments (@marty) | CI/CD events |
| Run location | On GitHub | In your workflow |
| Use case | Interactive review | Automated tasks |
| Streaming | Comments | GitHub logs |

**Can I use both Marty and the Action?**

Yes! Use Marty for interactive reviews, the Action for automated CI/CD tasks.

**How do I debug failures?**

Enable debug logging:
```yaml
- name: Debug
  run: echo "Agent output: ${{ steps.agent.outputs.response }}"
```

**Can I run multiple agents in parallel?**

Yes:
```yaml
jobs:
  review:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        agent: [code-reviewer, security-expert, test-writer]
    steps:
      - uses: nesalia/invoke@v1
        with:
          agent: ${{ matrix.agent }}
```

---

## CTA

**Headline:** Add AI to your CI/CD.

- Primary CTA: View on GitHub
- Secondary CTA: Read the Docs