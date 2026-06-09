# Marty Bot — nesalia.com/marty

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   MARTY                                                          │
│                                                                 │
│   Your AI code reviewer on GitHub.                               │
│                                                                 │
│   Automatic PR reviews, issue triage, and code assistance.      │
│   Powered by your own agents.                                   │
│                                                                 │
│   [Add to GitHub]  [Read the Docs]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Your AI code reviewer on GitHub.

**Subheadline:**
```
Automatic PR reviews, issue triage, and code assistance.
Powered by Nesalia agents. Comment-based commands.
```

**CTAs:**
- Primary: Add to GitHub
- Secondary: Read the Docs

---

## What is Marty?

Marty is a **GitHub bot** that brings AI agents into your repositories.

### Key Capabilities

- **PR Reviews** — Automatic code review on every PR
- **Issue Triage** — Categorize and respond to issues
- **Commands** — Trigger agents via comments
- **Custom Agents** — Use your own agents with custom instructions

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Developer opens PR                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │   Marty     │                                              │
│   │  (triggered)│                                              │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │  Nesalia    │─────── Agent reviews code                     │
│   │   Agent     │                                              │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   Comment posted on PR                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

### 1. Automatic PR Reviews

Marty reviews every PR automatically when opened or updated.

```yaml
# .github/marty.yml
reviews:
  auto_review: true
  on:
    - pull_request.opened
    - pull_request.synchronize
    - pull_request.reopened
```

**Review Focus Areas:**
- Code quality and readability
- Security vulnerabilities
- Performance issues
- Test coverage
- Documentation
- Best practices

### 2. Comment Commands

Trigger agents with @marty commands.

```
@marty review
@marty explain
@marty refactor
@marty add-tests
@marty security-check
@marty translate-doc
```

```typescript
// Custom command
@marty run <agent-name> <prompt>
@marty run code-reviewer Review only the authentication logic
```

### 3. Issue Triage

Auto-respond to issues based on content.

```yaml
# .github/marty.yml
triage:
  enabled: true
  rules:
    - match: "bug"
      label: "bug"
      response: "Thanks for the bug report! We'll look into this."
    - match: "feature request"
      label: "enhancement"
      response: "Great idea! We've added the enhancement label."
```

### 4. Custom Agents

Use your own agents with custom instructions.

```yaml
# .github/marty.yml
agents:
  default: my-code-reviewer
  commands:
    security: my-security-expert
    perf: my-performance-agent
```

### 5. Multi-Repo Support

Manage Marty across multiple repositories.

```bash
# Install on repo
/marty install --repo owner/repo

# Configure
/marty config set default-agent my-reviewer

# Deploy to all repos
/marty deploy --org my-org
```

---

## Commands Reference

### Review Commands

| Command | Description |
|---------|-------------|
| `@marty review` | Full PR review |
| `@marty review --focus security` | Security-focused review |
| `@marty review --focus performance` | Performance-focused review |
| `@marty approve` | Approve if no issues |
| `@marty request-changes` | Request changes with comments |

### Explanation Commands

| Command | Description |
|---------|-------------|
| `@marty explain` | Explain what changed |
| `@marty explain <file>` | Explain specific file |
| `@marty why` | Why was this change made? |

### Modification Commands

| Command | Description |
|---------|-------------|
| `@marty refactor` | Suggest refactoring |
| `@marty add-tests` | Add missing tests |
| `@marty fix-lint` | Fix linting issues |

### Utility Commands

| Command | Description |
|---------|-------------|
| `@marty translate-doc` | Translate documentation |
| `@marty update-changelog` | Update changelog |
| `@marty generate-pr` | Generate PR description |

---

## Configuration

### Installation

```bash
# Using GitHub App (recommended)
# Visit: https://github.com/apps/nesalia-marty

# Or using OAuth token
nesalia marty install --repo owner/repo
```

### Setup

```yaml
# .github/marty.yml
name: marty
version: 1

# Agent configuration
agent:
  id: agent_abc123
  model: anthropic/claude-sonnet-4-6

# Review settings
reviews:
  auto_review: true
  min_files: 1  # Minimum files to trigger review
  max_files: 100  # Maximum files per review

# Comment settings
comments:
  style: concise  # concise | detailed
  emoji: true

# Label settings
labels:
  auto_label: true
  prefix: "ai:"
```

### Environment Variables

```bash
NESALIA_API_KEY=your_api_key
NESALIA_AGENT_ID=agent_abc123
MARTY_GITHUB_TOKEN=github_token
```

---

## How It Works

### Installation Flow

```
1. User visits GitHub App page
       │
       ▼
2. Grants repository access
       │
       ▼
3. Marty installed on selected repos
       │
       ▼
4. User creates .github/marty.yml
       │
       ▼
5. Marty ready to use!
```

### Review Flow

```
1. PR opened/updated
       │
       ▼
2. GitHub webhook → Marty
       │
       ▼
3. Fetch PR diff + context
       │
       ▼
4. Send to Nesalia agent
       │
       ▼
5. Generate review comments
       │
       ▼
6. Post to GitHub
```

---

## Integrations

### Connected Products

```
Marty connects to:
├── Agents ──── Uses agents for reviews
├── Workflows ── Can trigger workflows on events
├── SDK ──────── All API calls go through SDK
└── GitHub ───── Full GitHub API integration
```

### Workflow Triggers

```yaml
# Trigger workflows from Marty
on:
  pull_request:
    types: [opened, closed]

workflow: release-automation
input:
  event: "{{ event.type }}"
  pr: "{{ pr.number }}"
```

---

## Pricing

| Plan | Reviews/month | Agents | Repos |
|------|--------------|--------|-------|
| **Free** | 100 | 1 | 3 |
| **Pro** | Unlimited | 5 | Unlimited |
| **Enterprise** | Unlimited | Unlimited | Unlimited |

---

## FAQ

**How is Marty different from CodeRabbit?**

Marty is powered by **your own agents** with your own instructions, memory, and tools. CodeRabbit has fixed review logic. With Marty, you control exactly how reviews work.

**Can I use different agents for different repos?**

Yes. Configure per-repo agents in `.github/marty.yml` or use org-level defaults.

**Does Marty work with GitHub Enterprise?**

Yes. Marty supports GitHub.com and GitHub Enterprise Server.

**Can I customize the review output?**

Yes. Customize review style, formatting, emoji usage, and response length in configuration.

---

## CTA

**Headline:** Add Marty to your GitHub.

- Primary CTA: Add to GitHub
- Secondary CTA: Read the Docs