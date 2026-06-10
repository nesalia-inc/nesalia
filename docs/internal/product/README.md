# Nesalia — Product Ecosystem

> **Status:** Active Development
> **Last Updated:** 2026-06-10

---

## Mission

**Make software development a commodity.**

Just like Vercel made deployment commodity, we make AI agent infrastructure commodity.

---

## Vision

Build the ecosystem that powers the next generation of software development. From frameworks to platforms to learning, we create the standard tools that every TypeScript developer uses.

---

## Product Family

| Product | Description | Status |
|---------|-------------|--------|
| **DeesseJS** | "Laravel for TypeScript" — OSS framework packages | 🔴 Active |
| **Nesalia** | "Modern Agent Infrastructure" — hosted platform | 🔴 Active |
| **Académie** | Learning platform (Codecademy for AI devs) | 🟡 Planned |
| **Fresh** | Knowledge engine for agents | 🟡 Future |
| **DeesseJS Cloud** | Managed DeesseJS hosting | 🟡 Future |

---

## Core Positioning

### The Vercel/Next.js Parallel

| Open Source | Managed Platform |
|-------------|-----------------|
| Next.js | Vercel |
| **DeesseJS** | **Nesalia** |

**DeesseJS** is free, OSS. **Nesalia** is the hosted platform you pay for.

---

## Products in Depth

### DeesseJS — The Framework

**DeesseJS is the Laravel for TypeScript.**

A modular, plugin-based TypeScript framework that provides essential packages for modern development. It's not an agent framework — it's a collection of tools that make TypeScript development faster, more standardized, and more maintainable.

**Packages:**
- Collections (CMS-like)
- RPC
- Admin Dashboard
- Functional utils
- Errors handling
- And more...

**Goal:** Become the default choice for TypeScript development. Like Laravel for PHP, shadcn for UI.

### Nesalia — The Platform

**Nesalia is modern agent infrastructure.**

A managed service where agents can be triggered from anywhere — GitHub Actions, GitHub bots, CLI, mobile, web, or any HTTP client.

- Agent hosting (Flue-based)
- Workflow engine
- Marty bot
- SDK/CLI
- User brings their own LLM provider

### Académie — The Learning Platform

**Codecademy for AI developers.**

- Courses on DeesseJS, Nesalia, agent development
- Challenges and certifications
- Standalone paid product
- Funnels to platform

### Fresh — The Knowledge Engine (Future)

**Up-to-date knowledge for agents.**

- RAG + real-time data
- Agent training knowledge
- Dynamic context for LLMs

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Agent Framework** | [Flue](https://flueframework.com) (`@flue/runtime`) | Harness, sessions, tools, sandboxes |
| **LLM Abstraction** | [Pi](https://pi.dev) (`@earendil-works/pi-ai`) | Multi-provider LLM API (15+ providers) |
| **SDK** | **DeesseJS SDK** (own) | Isomorphic TypeScript SDK |
| **Sandbox** | **Daytona** / Cloudflare | Isolated container environments |
| **Runtime** | **Node.js** / Cloudflare Workers | Deploy targets |

### Provider Support (via Pi)

Users bring their own LLM provider. Supported formats:

```
provider/model
├── anthropic/claude-sonnet-4-6
├── openai/gpt-5.4
├── google/gemini-3-flash
├── openrouter/moonshotai/kimi-k2
├── ollama/llama3.1:8b
├── bedrock/anthropic.claude-4-6
├── azure/gpt-5.4
├── groq/llama-3.3-70b
└── ...and more
```

---

## Pricing Strategy

### Model: Usage-based + Tiers (Vercel-like)

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | Limited usage, testing |
| **Starter** | $X/mo | Basic usage, 1-2 agents |
| **Pro** | $Y/mo | Unlimited agents, more compute |
| **Enterprise** | Custom | SSO, SLA, dedicated infra |

### Usage Components

- Agent invocations
- Compute time
- Storage
- (LLM costs: user pays their own provider — not included)

### Academy: Separate Paid Product

- Courses on DeesseJS, Nesalia, agent development
- Challenges and certifications
- Standalone revenue + platform funnel

---

## Sales Messaging

### One-Liner for Each Product

| Product | One-Liner |
|---------|-----------|
| **DeesseJS** | "The Laravel for TypeScript — modular packages for modern development." |
| **Nesalia** | "Deploy, scale, and manage agents without managing infrastructure." |
| **Académie** | "Learn to build with DeesseJS, certified agent developer." |
| **Fresh** | "Give your agents up-to-date knowledge, automatically." |

### Tagline

> "Make software development a commodity."

---

## Target Audience

**Primary:** TypeScript developers worldwide
**Secondary:** Teams, startups, enterprises
**Tertiary:** AI/LLM providers (recommend DeesseJS to users)

### Audience Segments

| Segment | Needs | Approach |
|---------|-------|----------|
| **Solo Dev** | Speed, simplicity | "Build in minutes" |
| **Startup** | Standardization, scaling | "One stack for the team" |
| **Enterprise** | Security, compliance, SLA | "Managed, secure, scalable" |
| **LLM Providers** | Partner to recommend | "Default choice for TypeScript" |

---

## Organization & Projects

### Hierarchy

```
User
├── Organization (team/company)
│   ├── Members (users with roles)
│   ├── Settings (billing, SSO, etc.)
│   │
│   └── Project A
│   │   ├── Agents
│   │   ├── Workflows
│   │   ├── API Keys
│   │   └── Settings
│   │
│   └── Project B
│       ├── Agents
│       ├── Workflows
│       └── Settings
│
└── Personal Account (optional)
    └── Private projects
```

### Organization

An **organization** represents a team or company:

| Feature | Description |
|---------|-------------|
| **Members** | Users with roles (owner, admin, member) |
| **Billing** | Subscription and usage-based pricing |
| **Settings** | SSO, SAML, security policies |
| **Projects** | Container for related agents/workflows |
| **API Keys** | Organization-level keys for CI/CD |

### Roles

| Role | Permissions |
|------|-------------|
| **Owner** | Full control, billing, delete org |
| **Admin** | Manage members, projects, settings |
| **Member** | Create/edit agents and workflows |
| **Viewer** | Read-only access (future) |

### Projects

A **project** groups related work:

| Feature | Description |
|---------|-------------|
| **Agents** | All agents in this project |
| **Workflows** | Automation workflows |
| **Contexts** | Agent contexts and sessions |
| **API Keys** | Project-scoped keys |
| **Settings** | Project-specific config |
| **Usage** | Per-project usage tracking |

### Use Cases

**Use Case 1: Company with Multiple Teams**
```
Acme Corp
├── Engineering Team
│   ├── code-reviewer
│   ├── tech-writer
│   └── CI automation
├── Marketing Team
│   ├── content-creator
│   └── social-poster
└── Support Team
    └── support-agent
```

**Use Case 2: Solo Developer**
```
Personal Account
├── work (for client)
│   ├── client-agent
│   └── client-workflows
└── side-project
    ├── experiment-agent
    └── test-workflows
```

**Use Case 3: Agency**
```
Agency Org
├── Client A Project
│   └── Client's agents
├── Client B Project
│   └── Client's agents
└── Internal Project
    ├── billing-agent
    └── reporting-workflow
```

### API Keys

| Type | Scope | Use Case |
|------|-------|----------|
| **Organization Key** | All projects | CI/CD, server-side |
| **Project Key** | Single project | Client-side, public |

### Billing Model

- **Organization-level** subscription (per seat or flat rate)
- **Project-level** usage tracking (compute, storage)
- **Free tier** per organization (not per user)

---

## Products in Scope (Nesalia Platform)

### Core Products

| Product | Description | Status |
|---------|-------------|--------|
| **Agent Creator** | Create agents with role, model, tools, sandbox | 🔴 In Progress |
| **Managed Agents** | Agents as individuals with isolated sandboxes | 🔴 In Progress |
| **HTTP API** | Universal interface for all integrations | 🔴 In Progress |
| **SDK / CLI** | Developer consumption via DeesseJS | 🔴 In Progress |
| **Workflow Engine** | Agent-centric workflows (n8n-modernisé) | 🟡 Planned |
| **Marty Bot** | GitHub bot (CodeRabbit/Vercel equivalent) | 🟡 Planned |
| **GitHub Action** | Trigger agents from CI/CD | 🟡 Planned |
| **Mobile SDK** | Native mobile access | 🟡 Planned |

### Use Cases

- **Autonomous Agents** — specialized agents (technical writer, coach, analyst)
- **Workflow Automation** — multi-step process orchestration
- **GitHub Automation** — code review, CI tasks
- **Content Creation** — automated content generation
- **Software Factory** — example: product doc → archi → versions → tasks → dev → tests → PR → review → merge → release → blog → social

> **Note:** The software factory pipeline is an example of what's possible with the system. Build any workflow you need.

---

## POC Scope (Internal Use)

### Must-Have Features

| Feature | Description |
|---------|-------------|
| **HTTP API** | Universal interface (REST/JSON) |
| **Agent CRUD** | Create, list, get, delete agents |
| **Agent Invocation** | Prompt → response via API |
| **Provider Config** | Per-agent LLM provider + API key |
| **Sandbox Isolation** | Per-agent container (Daytona) |
| **Session Persistence** | Conversation history survives restarts |
| **SDK Access** | DeesseJS for programmatic use |

### Should-Have Features

| Feature | Description |
|---------|-------------|
| **CLI** | Command-line interface |
| **Multi-agent Comms** | Agent → Agent communication |
| **Skills** | Reusable expertise packages (SKILL.md format) |
| **Webhook/Events** | SSE for streaming responses |
| **CLI Dashboard** | View agent status, logs |

---

## Memory Architecture (Human Model)

Each agent has a **human-like memory system**:

| Aspect | Description |
|--------|-------------|
| **Long-term Memory** | Shared across all contexts (identity, skills, facts) |
| **Selective Forgetting** | Weighted by recency/relevance, some things fade |
| **Transfer Learning** | Learn in Context A, apply in Context B |
| **Context Lifecycle** | Create, pause, resume, delete |

### Hierarchy
```
Agent
├── Identity (name, role, persona)
├── Long-Term Memory (shared, persistent)
└── Contexts (multiple, independent)
    ├── Context A (e.g., "PR #123")
    │   ├── Session 1 (thread)
    │   └── Session 2 (thread)
    └── Context B (e.g., "Slack #general")
        └── Session 1 (thread)
```

---

## Key Design Decisions

### 1. User Provides Their Own LLM

The platform does **not** provide LLM inference. Users configure their own provider:

```typescript
// Agent config example
{
  name: "my-coder",
  model: "anthropic/claude-sonnet-4-6",
  apiKey: "sk-ant-...", // User's key, stored encrypted
  sandbox: "daytona",
  tools: [...],
  skills: [...]
}
```

**Implications:**
- API key management per user or per agent
- Secure storage (encrypted in DB)
- Provider validation before agent creation

### 2. Agent = Human-like Individual

Think of an agent like a **human colleague**:

- You have **long-term tasks** that persist
- You have **individual contexts** with different people (Martin vs François — different topics)
- You can **forget things** when switching contexts
- You can **return to any context** anytime
- You **learn things in one context** that can be useful in another

**Key behaviors:**
- **Individual contexts** — Different conversations don't interfere
- **Selective forgetting** — Some things fade over time
- **Transfer learning** — Learn in one context, apply in another
- **Seamless context switching** — Can switch anytime, pick up where you left off

### 3. Sandbox Isolation

Each agent runs in its own container (Daytona or Cloudflare Sandbox):
- No local environment conflicts
- Clean state per agent
- Secure execution

---

## Integration Points (Extensible by Default)

The HTTP API is the universal interface. Anyone can build integrations:

| Integration | Description | Status |
|-------------|-------------|--------|
| **HTTP API** | REST/JSON interface for any client | 🔴 Core |
| **DeesseJS SDK** | TypeScript SDK for web/Node.js | 🔴 Core |
| **CLI** | Command-line tool | 🔴 Core |
| **GitHub Action** | Trigger agents from CI/CD | 🟡 Planned |
| **GitHub Bot** | Comment-based agent interaction | 🟡 Planned |
| **Mobile SDK** | Native mobile access | 🟡 Planned |
| **Webhook** | Event-driven triggers | 🟡 Planned |

### Example Integrations

```yaml
# GitHub Actions
- name: Code Review
  uses: nesalia/code-review-action@v1
  with:
    agent: my-coder
    api-key: ${{ secrets.NESALIA_API_KEY }}
```

```bash
# CLI
nesalia agent invoke my-coder --prompt "Review PR #123"

# SDK
const response = await nesalia.agents.invoke('my-coder', {
  prompt: 'Review PR #123'
});
```

```typescript
// GitHub Bot (comment trigger)
@nesalia review
Please review the changes in this PR.
```

---

## Comparison with Flue

| Aspect | Flue (self-hosted) | **Nesalia (hosted)** |
|--------|-------------------|---------------------|
| **Infrastructure** | You manage | ✅ Managed |
| **Access** | Local / self-deployed | **Global HTTP API** |
| **Sandbox** | Bring your own | ✅ Daytona included |
| **Provider config** | Code config | **API/UI config** |
| **Scaling** | Manual | ✅ Auto-scale |
| **Monitoring** | Bring your own | ✅ Built-in |

---

## Website Structure (Landing Page)

### Navigation
- Templates
- DeesseJS (Errors, DRPC, Collections, FP, Admin, Cloud)
- Academy
- Social (X, LinkedIn, GitHub)
- Blog

### Footer Sections

| Section | Links |
|---------|-------|
| **DeesseJS** | Errors, DRPC, Collections, FP, Admin, Cloud |
| **Learn** | Docs, Blog, Changelog, Academy, Community |
| **Use Cases** | Autonomous Agents, Workflows, GitHub Bot, Content Creation |
| **Company** | About, Help, Legal, Privacy Policy |
| **Community** | Open Source Program, Students, GitHub, LinkedIn, X |

### Footer Legal
```
Nesalia Inc. All rights reserved
```

---

## External References

| Resource | URL |
|----------|-----|
| **Flue Framework** | https://flueframework.com |
| **Pi (LLM Toolkit)** | https://pi.dev |
| **Claude Managed Agents** | https://platform.claude.com/docs/en/managed-agents/ |
| **OpenClaw** | https://openclaw.ai |
| **PicoClaw** | https://picoclaw.io |

---

## Next Steps

1. **Landing Page** — Single page with product overview + footer
2. **Agent Creator** — Core CRUD + invocation
3. **SDK/CLI** — DeesseJS implementation
4. **Internal Testing** — POC used by team
5. **Iterate** — Feedback → roadmap

---

## Status Legend

| Status | Meaning |
|--------|---------|
| 🔴 In Progress | Currently being built |
| 🟡 Planned | On the roadmap, not started |
| ✅ Complete | Shipped and functional |
| ❌ Removed | Deliberately not in scope |