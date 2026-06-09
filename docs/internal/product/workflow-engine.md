# Nesalia Workflow Engine

> **Status:** Design Phase
> **Last Updated:** 2026-06-09

---

## Vision

A **modern, agent-centric workflow engine** — like n8n but rebuilt from the ground up with AI agents at its core.

Where n8n is node-based and visual, Nesalia Workflows is **agent-centric and event-driven**. LLM-powered tasks are first-class citizens, not an afterthought.

```
Like n8n, but:
├── Modern architecture (built for AI era)
├── Agents as first-class citizens
├── Human-in-the-loop built-in
├── Webhook-first, extensible
└── Works with Nesalia agent memory
```

---

## Core Concept

**Workflows = Orchestrated sequences of tasks triggered by events.**

```
Trigger (something happens)
    ↓
Workflow runs through steps
    ↓
Steps can be: Agent Tasks, Actions, Conditions, Human Input
    ↓
Output flows to next step or branches
    ↓
Human can intervene at any point
```

---

## Architecture

### Workflow Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WORKFLOW ENGINE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │
│  │   TRIGGERS   │     │    STEPS     │     │   OUTPUTS    │       │
│  ├──────────────┤     ├──────────────┤     ├──────────────┤       │
│  │ Webhook      │     │ Agent Task   │     │ Webhook      │       │
│  │ Schedule     │────▶│ Action       │───▶│ Email        │       │
│  │ GitHub       │     │ Condition    │     │ Slack        │       │
│  │ Email        │     │ Human Input  │     │ Publish      │       │
│  │ API          │     │ Delay        │     │ Sub-workflow │       │
│  │ Another WF   │     │ Parallel     │     │              │       │
│  └──────────────┘     └──────────────┘     └──────────────┘       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      CONTEXT                                 │  │
│  │  Data flows through the workflow, step to step              │  │
│  │  { version, changelog, draft_url, confirmed, ... }          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Step Types

| Step Type | Description | Example |
|-----------|-------------|---------|
| **Agent Task** | LLM-powered task | "Write a blog post about this release" |
| **Action** | External API call | Send email, POST to webhook, create GitHub issue |
| **Condition** | Branching logic | If `confirmed == true`, go to step 4 |
| **Human Input** | Wait for user | "Send email asking for confirmation" |
| **Delay** | Wait X time | "Wait 1 hour before retrying" |
| **Parallel** | Run steps simultaneously | "Send to LinkedIn AND X at the same time" |
| **Sub-workflow** | Trigger another workflow | "After publish, trigger social media workflow" |

### Trigger Types

| Trigger | Description | Example Payload |
|---------|-------------|-----------------|
| **Webhook** | HTTP POST from any service | `{ event: "gh_release", data: {...} }` |
| **Schedule** | Cron-based scheduling | `0 9 * * *` (daily at 9am) |
| **GitHub** | GitHub events | release created, PR merged, issue opened |
| **Email** | Inbound email trigger | New email to workflow@ |
| **API** | Direct API call | `POST /workflows/{id}/trigger` |
| **Workflow** | Another workflow completes | Fan-out pattern |

---

## Example: Changelog Blog Workflow

### The Scenario

When a new GitHub release is created:
1. Agent writes a changelog blog post
2. Draft is sent to a platform (e.g., CMS)
3. User receives email asking for confirmation
4. If confirmed → Publish + trigger LinkedIn + trigger X

### Workflow Definition

```yaml
name: changelog-blog-workflow
trigger:
  type: github
  event: release.created
  repo: owner/repo

steps:
  - id: 1
    name: Write Blog Post
    type: agent
    agent: blog-writer
    input:
      prompt: "Write a blog post about version {{version}} with these changes: {{changelog}}"
      context:
        style: technical
        audience: developers
    output:
      - draft_content
      - draft_url

  - id: 2
    name: Submit Draft
    type: action
    action: cms.create_post
    input:
      title: "Release {{version}} - What's New"
      content: "{{steps.1.draft_content}}"
      status: draft
    output:
      - post_id
      - post_url

  - id: 3
    name: Notify User
    type: action
    action: email.send
    input:
      to: user@example.com
      subject: "Review: Release {{version}} changelog"
      body: |
        A draft changelog has been created: {{steps.2.post_url}}
        
        Reply CONFIRM to publish, or REJECT with feedback.
    output:
      - email_id

  - id: 4
    name: Wait for Confirmation
    type: human_input
    input:
      email_id: "{{steps.3.email_id}}"
      timeout: 24h
    output:
      - confirmed: boolean
      - feedback: string | null

  - id: 5
    name: Publish
    type: condition
    condition: "{{steps.4.confirmed}} == true"
    branches:
      true:
        - id: 5a
          name: Publish Post
          type: action
          action: cms.publish_post
          input:
            post_id: "{{steps.2.post_id}}"
        - id: 5b
          name: Trigger LinkedIn
          type: sub_workflow
          workflow: linkedin-post-workflow
          input:
            post_url: "{{steps.2.post_url}}"
            version: "{{version}}"
        - id: 5c
          name: Trigger X Post
          type: sub_workflow
          workflow: x-post-workflow
          input:
            post_url: "{{steps.2.post_url}}"
            version: "{{version}}"
      false:
        - id: 5d
          name: Notify Rejection
          type: action
          action: email.send
          input:
            to: agent@example.com
            subject: "Changelog rejected"
            body: "Feedback: {{steps.4.feedback}}"
```

### Visual Flow

```
┌─────────────────┐
│  GitHub Release │  ← TRIGGER
│     Created     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Write Blog Post │  ← AGENT TASK
│   (blog-writer) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Submit Draft   │  ← ACTION (CMS)
│   to Platform   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Notify User    │  ← ACTION (Email)
│   via Email     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Wait for    │  ← HUMAN INPUT
│   Confirmation  │     (Email reply)
└────────┬────────┘
         │
    [USER CONFIRMS]
         │
         ├──────────────────────────────────────┐
         │                                      │
         ▼                                      ▼
┌─────────────────┐                    ┌─────────────────┐
│    Publish      │                    │  (Future:       │
│      Post       │                    │   Notify        │
└────────┬────────┘                    │   Rejection)    │
         │                             └─────────────────┘
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ LinkedIn Post   │ │     X Post      │ │   (More:        │
│  Workflow       │ │   Workflow      │ │   Slack, etc.)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Workflow Run State

### Run Object

```typescript
interface WorkflowRun {
  id: string;
  workflow_id: string;
  trigger: {
    type: string;
    event: string;
    payload: Record<string, any>;
  };
  status: 'running' | 'waiting' | 'paused' | 'completed' | 'failed';
  context: Record<string, any>;  // Data flowing through
  steps: StepRun[];
  created_at: Date;
  updated_at: Date;
}

interface StepRun {
  id: number;
  name: string;
  type: StepType;
  status: 'pending' | 'running' | 'completed' | 'waiting' | 'failed';
  input: Record<string, any>;
  output: Record<string, any> | null;
  error: string | null;
  started_at: Date | null;
  completed_at: Date | null;
}
```

### State Transitions

```
pending → running → completed
                 → waiting (human input, delay)
                 → failed
running → paused (manual pause)
       → waiting (awaiting external event)
waiting → running (event received)
       → failed (timeout)
```

---

## Human-in-the-Loop

### Patterns

**1. Confirmation Gate**
```
Step: Wait for user confirmation
├── User replies "CONFIRM" → continue
├── User replies "REJECT" → go to rejection branch
└── Timeout (24h) → go to timeout branch
```

**2. Feedback Loop**
```
Step: Wait for user feedback
├── User provides feedback → pass to next agent step
├── Agent incorporates feedback → re-submit
└── User approves → continue
```

**3. Manual Intervention**
```
Step: Pause and notify
├── User reviews in dashboard
├── User clicks "Resume" or "Cancel"
└── Workflow continues or terminates
```

### Communication Channels

| Channel | Use Case |
|---------|----------|
| **Email** | Notifications, confirmations |
| **Slack** | Real-time alerts, quick approvals |
| **Dashboard** | Full workflow visualization, manual actions |
| **Webhook** | External system integration |

---

## Integration with Agent Memory

Workflows can access and update agent memory:

```yaml
steps:
  - id: 1
    name: Learn about release
    type: agent
    agent: analyzer
    # Agent learns something new
    # This persists to long-term memory
    output:
      - insights

  - id: 2
    name: Use learned knowledge
    type: agent
    agent: writer
    # Can access insights from step 1
    # Even if this is a different agent/context
    input:
      context:
        learned: "{{steps.1.insights}}"
```

---

## Comparison with Alternatives

| Feature | n8n | Temporal | **Nesalia Workflows** |
|---------|-----|----------|----------------------|
| **Approach** | Visual nodes | Code-first | **Agent-centric** |
| **LLM Tasks** | Via HTTP node | Custom code | **Built-in Agent Task** |
| **Human-in-loop** | Limited | Activities | **First-class** |
| **Trigger Sources** | 400+ | Webhook + Schedule | **Webhook-first** |
| **Agent Memory** | ❌ | ❌ | **✅ Full integration** |
| **Sub-workflows** | Yes | Child workflows | **Yes (fan-out)** |
| **Parallel Steps** | Yes | Yes | **Yes** |
| **Conditions** | Yes | Yes | **Yes** |
| **Code-first** | Limited | Yes | **Yes (YAML/JSON)** |
| **Visual Editor** | Yes | ❌ | **🟡 Planned** |

---

## Open Questions

### 1. Workflow Definition Format
- **YAML** — Human readable, widely used
- **JSON** — Easier to generate programmatically
- **DSL** — Custom domain-specific language
- **Or both** — YAML for humans, JSON for APIs

### 2. Visual Editor
- Start code-first, add visual later?
- Or design visual from the start?

### 3. Versioning
- Workflows should be versioned?
- How to handle breaking changes?

### 4. Monitoring
- Real-time logs?
- Step-by-step visualization?
- Error recovery strategies?

### 5. Concurrency
- Can same workflow run multiple times simultaneously?
- Rate limiting per workflow?

---

## Implementation Notes

### Trigger System
- Webhook endpoint: `POST /workflows/trigger/{workflow_id}`
- Signature verification (GitHub, Slack, etc.)
- Event deduplication

### Step Execution
- Sequential by default
- Parallel for independent steps
- Async for long-running tasks
- State persistence after each step

### Error Handling
- Retry with backoff
- Dead letter queue
- Error notifications
- Manual retry option

---

## Status

| Component | Status |
|-----------|--------|
| **Vision** | ✅ Defined |
| **Architecture** | ✅ Designed |
| **Trigger System** | 🟡 Planned |
| **Step Types** | 🟡 Planned |
| **Human-in-loop** | 🟡 Planned |
| **Agent Memory Integration** | 🟡 Planned |
| **Visual Editor** | 🟡 Future |
| **Implementation** | ❌ Not started |

---

## Related

- [Product README](./README.md) — Overall product vision
- [Session Architecture](../agent-memory/session-architecture.md) — Agent memory model