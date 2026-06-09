# Marty — The Nesalia GitHub Bot

> **Status:** Design Phase
> **Last Updated:** 2026-06-09

---

## Vision

**Marty** is a comprehensive GitHub bot that combines the best of CodeRabbit, GitHub Copilot Agents, and Vercel's tools — but with the power of **Nesalia agents** behind it.

Think: CodeRabbit's PR reviews + Copilot's task management + Vercel's deployment intelligence + **your own agents** doing the work.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Marty Bot                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  On GitHub Events:                                                  │
│  ├── PR Created → Review + Summarize                               │
│  ├── PR Merged → Trigger workflows (changelog, social)              │
│  ├── Issue Opened → Triage + Assign                                 │
│  ├── PR Comment → @Marty respond                                    │
│  ├── Release → Trigger workflows                                    │
│  └── ...and more                                                    │
│                                                                     │
│  Powered by:                                                        │
│  └── Nesalia Agents (user-configured)                               │
│       ├── code-reviewer agent                                       │
│       ├── documentation agent                                       │
│       ├── triage agent                                              │
│       └── ...any agent you create                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Competitive Landscape

### What Existing Bots Do

| Bot | Primary Focus | Key Features |
|-----|---------------|--------------|
| **CodeRabbit** | PR Reviews | AI summaries, bug detection, one-click fixes, security analysis |
| **GitHub Copilot** | Coding Assistant | Inline suggestions, code completion, agentic tasks |
| **Copilot Agents** | Task Management | Assign tasks, steer agents, async execution |
| **Vercel Agent** | Deployment | Preview deployments, instant feedback, CI/CD integration |
| **Mend Copilot** | Security | SAST/SCA scanning, vulnerability remediation |
| **Continue.dev** | IDE Integration | PR review bot, context-aware suggestions |

### What They Lack

| Gap | Description |
|-----|-------------|
| **Custom Agents** | Limited ability to use your own AI agents |
| **Workflow Triggers** | Can't trigger complex workflows on events |
| **Multi-Agent Coordination** | Single-purpose, can't coordinate multiple agents |
| **External Integrations** | Limited to GitHub, no connection to external services |
| **User-Provided LLMs** | Locked to specific providers |

---

## Marty Features

### 1. PR Review & Analysis

```markdown
@marty review

Marty responds with:
- Summary of changes
- Bug detection (potential issues)
- Security analysis
- Refactor suggestions
- One-click fixes (apply suggestions)
```

| Feature | Description |
|---------|-------------|
| **AI Summaries** | Comprehensive PR overview |
| **Bug Detection** | Runtime errors, null pointers, logic flaws |
| **Security Analysis** | Vulnerability scanning |
| **Code Quality** | Best practices, style suggestions |
| **One-Click Fixes** | Apply suggestions directly |
| **Incremental Reviews** | Focus on new commits only |

### 2. Issue Triage

```markdown
@marty triage

Marty responds with:
- Issue categorization
- Priority assignment
- Label suggestions
- Assignee recommendations
```

| Feature | Description |
|---------|-------------|
| **Auto-categorization** | Bug, feature, question, etc. |
| **Priority Triage** | P0-P4 based on impact |
| **Label Suggestions** | Relevant labels |
| **Assignee Routing** | Route to best team member |
| **Duplicate Detection** | Link to similar issues |

### 3. Workflow Triggers

```yaml
# .marty/workflows.yml
workflows:
  changelog-on-release:
    trigger:
      event: release.published
    actions:
      - Invoke changelog-agent
      - Draft blog post
      - Notify team

  security-scan-on-pr:
    trigger:
      event: pull_request.opened
    actions:
      - Run security scan
      - Post findings
      - Create issues for critical
```

| Feature | Description |
|---------|-------------|
| **Event-Based** | Any GitHub event can trigger |
| **Multi-Step** | Complex workflows with conditions |
| **Human-in-Loop** | Wait for confirmation before actions |
| **External Actions** | Call external APIs, send emails |
| **Parallel Execution** | Multiple workflows on same event |

### 4. Interactive Commands

```markdown
@marty help
@marty review [--full|--incremental|--security]
@marty summarize
@marty fix [issue-id]
@marty explain [code-block]
@marty test [file]
@marty docs [function]
@marty status
@marty pause
@marty resume
```

| Command | Description |
|---------|-------------|
| `@marty review` | Full or incremental review |
| `@marty summarize` | Quick PR summary |
| `@marty fix` | Apply specific fix |
| `@marty explain` | Explain code |
| `@marty test` | Generate tests |
| `@marty docs` | Generate documentation |
| `@marty workflow` | Trigger a workflow |
| `@marty pause/resume` | Control review behavior |

### 5. Contextual Chat

```markdown
@marty Why was this architecture chosen?

@marty Can you refactor this to use the repository pattern?

@marty What tests should I add for this function?

@marty Summarize the discussion in this PR
```

### 6. Deployment Intelligence (like Vercel)

```markdown
@marty deploy preview

Marty responds with:
- Preview URL
- Changes summary
- Known issues
- Recommendations
```

| Feature | Description |
|---------|-------------|
| **Preview Detection** | Detect deployment previews |
| **Change Summary** | What's in this preview |
| **Regression Detection** | Alert on potential issues |
| **Rollback Suggestions** | Recommend rollback if needed |

---

## Architecture

### How Marty Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Events (PR, Issue, Comment, Release, etc.)                         │
│         │                                                           │
│         ▼                                                           │
│  ┌─────────────────┐                                               │
│  │   Marty Bot     │  ← GitHub App / Webhook Consumer              │
│  │  (Nesalia API)  │                                               │
│  └────────┬────────┘                                               │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Marty Service                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │   │
│  │  │   Router    │→ │  Workflow   │→ │   Agent Executor    │ │   │
│  │  │  (routing)  │  │   Engine    │  │ (calls Nesalia API) │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Nesalia Platform                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │   │
│  │  │ Review  │  │ Triage  │  │  Docs   │  ← User-configured    │   │
│  │  │ Agent   │  │ Agent   │  │ Agent   │    Agents             │   │
│  │  └─────────┘  └─────────┘  └─────────┘                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Configuration

```yaml
# .marty/config.yml
name: Marty
description: Your AI coding assistant

# Agent configuration
agents:
  default: nesalia/coder
  review: nesalia/reviewer
  triage: nesalia/triage
  docs: nesalia/writer

# Trigger configurations
triggers:
  pr.opened:
    - agent: review
      type: full-review
  pr.synchronize:
    - agent: review
      type: incremental-review
  issue.opened:
    - agent: triage
  release.published:
    - workflow: changelog-workflow

# Command aliases
commands:
  review: pr.review --full
  security: pr.review --security-only
  summary: pr.summarize

# Response settings
response:
  format: markdown
  include-code-suggestions: true
  max-comments-per-pr: 50
```

### Bot Installation

```bash
# Install Marty on a repository
/marty install

# Configure agents
/marty config set agent.review nesalia/code-reviewer

# Add workflows
/marty workflow add changelog

# View status
/marty status
```

---

## Comparison with Alternatives

| Feature | CodeRabbit | Copilot | Vercel | **Marty** |
|---------|------------|---------|--------|-----------|
| **PR Reviews** | ✅ | ✅ | ✅ | ✅ |
| **AI Summaries** | ✅ | ✅ | ✅ | ✅ |
| **Issue Triage** | ❌ | Limited | ❌ | ✅ |
| **Custom Agents** | ❌ | ❌ | ❌ | ✅ |
| **Workflow Triggers** | ❌ | ❌ | Limited | ✅ |
| **Multi-Agent** | ❌ | ✅ | ❌ | ✅ |
| **Human-in-Loop** | ❌ | ❌ | ❌ | ✅ |
| **External Integrations** | ❌ | ❌ | ✅ | ✅ |
| **User-Provided LLM** | ❌ | ❌ | ❌ | ✅ |
| **Nesalia Integration** | ❌ | ❌ | ❌ | ✅ |

---

## What Makes Marty Different

### 1. Powered by Your Agents
```yaml
agents:
  review: nesalia/my-reviewer  # Your custom agent
  triage: nesalia/my-triage    # Your custom logic
```
You define what each agent does. Marty is the interface.

### 2. Workflow Triggers
```yaml
on:
  pr.merged:
    - workflow: publish-docs
    - workflow: social-post
    - notify: slack
```
Complex automation built on top of simple triggers.

### 3. Human-in-the-Loop
```yaml
workflow:
  steps:
    - name: Deploy to prod
      type: human-approval
      approvers: ["@user"]
```
Critical actions wait for human confirmation.

### 4. External Integrations
```yaml
actions:
  - type: webhook
    url: https://your-cms.com/api/posts
  - type: email
    to: team@example.com
  - type: slack
    channel: "#releases"
```

### 5. User-Provided LLM
```yaml
agents:
  review:
    provider: anthropic/claude-sonnet-4-6
    api_key: ${{ secrets.ANTHROPIC_KEY }}
```
Users bring their own LLM provider. No lock-in.

---

## Roadmap

### Phase 1: MVP
- [ ] Basic PR review
- [ ] AI summaries
- [ ] Issue triage
- [ ] Basic commands (@marty help, @marty review)

### Phase 2: Workflows
- [ ] Workflow triggers
- [ ] Sub-workflow execution
- [ ] External webhook actions

### Phase 3: Advanced
- [ ] Human-in-the-loop
- [ ] Multi-agent coordination
- [ ] Custom agent training

---

## Example Interactions

### Review Request
```markdown
On PR #123: Add user authentication

@marty review

---
🤖 Marty

## Summary
This PR adds JWT-based authentication to the API endpoints.

**Files changed:** 5
**Lines added:** 234
**Lines removed:** 12

## Findings

### 🔴 Critical
- [ ] SQL injection vulnerability in `auth/login.ts:45`

### 🟠 Major
- [ ] Password logged in plain text in `auth/service.ts:89`

### 🟡 Minor
- [ ] Consider using `bcrypt` instead of MD5 for password hashing

## Suggestions
- Add rate limiting to login endpoint
- Implement account lockout after failed attempts

[Apply Fix] [Ask Marty More] [Dismiss]
```

### Issue Triage
```markdown
On Issue #456: App crashes on startup

@marty triage

---
🤖 Marty

## Triage Result

**Category:** Bug
**Priority:** P1 (Critical)
**Labels:** `bug`, `crash`, `needs-reproduction`

**Root Cause Estimate:** High probability of null pointer in config loading

**Suggested Assignee:** @backend-team

**Similar Issues:** #234, #301 (possible duplicate)

**Recommended Actions:**
1. Request reproduction steps
2. Add to current sprint
3. Notify on-call for hotfix
```

---

## Status

| Component | Status |
|-----------|--------|
| **Vision** | ✅ Defined |
| **Feature Set** | ✅ Defined |
| **Competitive Analysis** | ✅ Complete |
| **Architecture** | 🟡 In Progress |
| **Implementation** | ❌ Not started |

---

## Related

- [Product README](./README.md) — Overall product vision
- [Workflow Engine](./workflow-engine.md) — Workflow system Marty uses
- [Nesalia Vision](../agent-memory/nesalia-vision.md) — Core platform vision