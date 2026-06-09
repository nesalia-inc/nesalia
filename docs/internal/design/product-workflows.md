# Workflows — nesalia.com/workflows

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   WORKFLOWS                                                     │
│                                                                 │
│   Automate any process with AI agents.                         │
│                                                                 │
│   Chain agent tasks, add conditions, human approval gates,      │
│   and connect to any service.                                   │
│                                                                 │
│   [Get Started]  [Read the Docs]                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Automate any process with AI agents.

**Subheadline:**
```
Build workflows with agent tasks, conditions, human-in-the-loop,
and external integrations. Like n8n, but agent-centric.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs

---

## What are Workflows?

Workflows are **multi-step automation pipelines** powered by AI agents.

Unlike traditional automation tools, Nesalia Workflows are **agent-native**:
- Each step can be an agent with memory and tools
- Human approval gates for critical decisions
- Conditional logic based on agent outputs
- Real-time observability

### The Automation Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Workflow Engine                                               │
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│   │   Trigger   │──│   Steps     │──│   Output    │           │
│   │  (Webhooks, │  │  (Agents,   │  │  (Logs,     │           │
│   │   Schedules,│  │  Conditions│  │  Artifacts) │           │
│   │   Manual)   │  │  Human)     │  │             │           │
│   └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Workflows vs Traditional Automation?

| Traditional (n8n, Zapier) | Nesalia Workflows |
|---------------------------|-------------------|
| Fixed actions | **Agent-powered actions** |
| Predefined logic | **AI-driven decisions** |
| No memory | **Persistent context** |
| Webhook triggers | **Any trigger** (webhook, schedule, GitHub, CLI) |
| Manual updates | **Self-correcting** |

---

## Features

### 1. Agent Tasks

Each workflow step runs an agent with full capabilities.

```yaml
steps:
  - name: review-code
    agent: code-reviewer
    input:
      pr: "{{ trigger.pr_number }}"

  - name: write-tests
    agent: test-writer
    input:
      changes: "{{ steps.review-code.changes }}"
    condition: "{{ steps.review-code.needs_tests }}"
```

### 2. Conditions

Branch your workflow based on agent outputs or external data.

```yaml
conditions:
  - name: check-severity
    if: "{{ steps.triage.severity }} == 'high'"
    then:
      - name: urgent-response
        agent: incident-responder
    else:
      - name: standard-response
        agent: support-agent
```

### 3. Human-in-the-Loop

Pause workflows for human approval at critical points.

```yaml
steps:
  - name: deploy-decision
    type: approval
    approvers:
      - role: lead-engineer
      - role: security-reviewer
    timeout: 24h

  - name: deploy
    agent: deployer
    condition: "{{ steps.deploy-decision.approved }}"
```

### 4. Triggers

Start workflows from anywhere.

| Trigger | Use Case |
|---------|----------|
| **Webhook** | External services, CI/CD |
| **Schedule** | Cron jobs, recurring tasks |
| **GitHub** | PR events, issues, comments |
| **Manual** | One-click run |
| **CLI** | Local testing, scripts |
| **API** | Programmatic triggering |

### 5. Integrations

Connect to external services.

```
Available Integrations:
├── GitHub (repos, PRs, issues)
├── Slack (notifications, commands)
├── Linear (issues, projects)
├── Jira (tickets)
├── Email (send, receive)
├── Database (query, write)
├── S3 (file storage)
└── Custom (webhook, HTTP)
```

### 6. Observability

Built-in logging and monitoring.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Workflow Run #1234                                            │
│                                                                 │
│   Status: ✓ Complete                                           │
│   Duration: 2m 34s                                              │
│   Cost: $0.02                                                   │
│                                                                 │
│   Steps:                                                        │
│   ├─ Trigger: webhook    ✓  0.1s                              │
│   ├─ Triage             ✓  5.2s                                │
│   ├─ Review             ✓  12.8s                              │
│   ├─ Approval            ⏳ pending (1/2 approved)              │
│   └─ Deploy              ○ waiting                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## How It Works

### 1. Define a Workflow

```typescript
import { defineWorkflow } from '@nesalia/workflows';

export const releaseWorkflow = defineWorkflow({
  name: 'release-automation',
  trigger: { type: 'github', events: ['pull_request.merged'] },

  steps: [
    {
      name: 'create-branch',
      type: 'agent',
      agent: 'release-coordinator',
      input: { branch: '{{ trigger.branch }}' }
    },
    {
      name: 'update-changelog',
      type: 'agent',
      agent: 'changelog-writer',
      input: { changes: '{{ steps.create-branch.commits }}' }
    },
    {
      name: 'run-tests',
      type: 'command',
      command: 'npm test'
    },
    {
      name: 'approval',
      type: 'approval',
      approvers: ['release-manager'],
      timeout: '24h'
    },
    {
      name: 'deploy',
      type: 'agent',
      agent: 'deployer',
      condition: '{{ steps.approval.approved }}'
    }
  ]
});
```

### 2. Deploy the Workflow

```bash
nesalia workflows deploy release-automation.ts
```

### 3. Monitor Runs

```bash
nesalia workflows runs release-automation --watch

# Output:
# Run #1234: ✓ Complete (2m 34s)
# Run #1235: ● Running: Triage (5.2s)
# Run #1236: ○ Queued
```

---

## Example: Software Factory

Complete SDLC automated with AI agents:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Product Requirement                                           │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │  Architect  │─── Generate API design                       │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │   Planner   │─── Create tasks (Linear/Jira)               │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │   Coder     │─── Implement features                        │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │  Reviewer   │─── Code review (human approval)              │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │   Tester    │─── Run tests, generate coverage              │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │   Merger    │─── Auto-merge on approval                     │
│   └─────────────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                              │
│   │  Publisher  │─── Release notes, blog post                   │
│   └─────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integrations

### Triggers

| Trigger | Description |
|---------|-------------|
| **GitHub** | PR opened, merged, commented |
| **Webhook** | Any HTTP POST |
| **Schedule** | Cron expression |
| **Manual** | One-click run |
| **CLI** | `nesalia workflows run` |

### Actions

| Action | Description |
|--------|-------------|
| **Agent** | Run an agent with context |
| **Approval** | Wait for human approval |
| **Command** | Run shell command |
| **HTTP** | Make HTTP request |
| **Notify** | Send notification |

### Connected Products

```
Workflows work with:
├── Agents ──── Each step can be an agent
├── Marty ───── GitHub events trigger workflows
├── SDK/CLI ─── Programmatic workflow management
└── GitHub ──── Code events trigger workflows
```

---

## FAQ

**How is this different from n8n or Zapier?**

Nesalia Workflows are **agent-centric**. Each step can be an AI agent with memory, not just a fixed action. This means workflows can make decisions, adapt, and handle complex tasks that traditional automation can't.

**Can I have human approval gates?**

Yes. Use the `approval` step type to pause a workflow and wait for human approval before continuing.

**What happens if an agent fails?**

Workflows support error handling with retries, fallbacks, and notifications. You can also configure automatic rollback for failed steps.

**Can workflows trigger other workflows?**

Yes. Workflows can trigger other workflows, enabling modular and reusable automation patterns.

---

## CTA

**Headline:** Start automating today.

- Primary CTA: Get Started Free
- Secondary CTA: Read the Docs
- Enterprise: Talk to Sales