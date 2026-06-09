# Nesalia — Product Specification

> **Status:** POC (Internal Use Only)
> **Last Updated:** 2026-06-09

---

## Vision

**Nesalia = A globally hosted, extensible version of Flue.**

A managed Flue service where agents can be triggered from anywhere — GitHub Actions, GitHub bots, CLI, mobile, web, or any HTTP client. The platform handles orchestration, isolation, and persistence while users bring their own LLM providers.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Nesalia Platform                              │
│ (Hosted Flue Service)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────┐ ┌─────────┐   ┌─────────┐   ┌─────────┐           │
│   │  GH │   │  GitHub │   │   CLI   │   │  Mobile │ │
│   │ Actions │   │   Bot   │   │         │   │   App   │           │
│   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘           │
│        │             │             │             │                  │
│        └─────────────┴──────┬──────┴─────────────┘                  │
│                             │                                       │
│                      ┌─────▼─────┐                                 │
│                      │   API     │                                 │
│                      └─────┬─────┘                                 │
│                            │                                       │
│              ┌─────────────┼─────────────┐                         │
│              ▼             ▼             ▼                         │
│         ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│         │ Agent A │  │ Agent B │  │ Agent C │                     │
│         │(sandbox)│  │(sandbox)│  │(sandbox)│                     │
│         └─────────┘  └─────────┘  └─────────┘                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Core principles:**
- **Extensible by default** — Anyone can build integrations (SDK, CLI, GH Action, bot)
- **Trigger from anywhere** — HTTP API is the universal interface
- **User-provided LLM** — Users bring their own provider
- **Managed infrastructure** — No setup required, just API keys

---

## Core Differentiator

| Aspect | OpenClaw | PicoClaw | **Nesalia** |
|--------|----------|----------|-------------|
| **Deployment** | Desktop (macOS app) | Binary ($10 hardware) | **☁️ Hosted cloud** |
| **Access Points** | Desktop app / chat | CLI / chat | **GH Actions, Bot, CLI, Mobile, Web, HTTP** |
| **Extensibility** | Plugins | Extensions | ✅ **Extensible by default** |
| **Agent Identity** | Session-based | Session-based | **Agent = individual** |
| **Infrastructure** | ❌ Managed | ❌ Managed | ✅ **Managed** |
| **LLM Provider** | User-provided | User-provided | **User-provided** |
| **Sandbox Isolation** | ❌ | ❌ | ✅ **Per-agent containers** |
| **Memory Persistence** | Basic | Basic | ✅ **Long-term layer** |
| **Multi-agent Comms** | Basic | SubTurn + Hooks | ✅ **True inter-agent** |

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Agent Framework** | [Flue](https://flueframework.com) (`@flue/runtime`) | Harness, sessions, tools, sandboxes |
| **LLM Abstraction** | [Pi](https://pi.dev) (`@earendil-works/pi-ai`) | Multi-provider LLM API (15+ providers) |
| **SDK** | **DeesseJS** (own) | Isomorphic TypeScript SDK |
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

## Products in Scope

### Core Products

| Product | Description | Status |
|---------|-------------|--------|
| **Agent Creator** | Create agents with role, model, tools, sandbox | 🔴 In Progress |
| **Managed Agents** | Agents as individuals with isolated sandboxes | 🔴 In Progress |
| **HTTP API** | Universal interface for all integrations | 🔴 In Progress |
| **SDK / CLI** | Developer consumption via DeesseJS (fork of Pi) | 🔴 In Progress |
| **Intelligence Layer** | Inter-agent communication | 🟡 Planned |
| **Workflow Engine** | Agent-centric workflows (n8n-modernisé) | 🟡 Planned |
| **GitHub Action** | Trigger agents from CI/CD | 🟡 Planned |
| **Marty Bot** | GitHub bot (CodeRabbit/Vercel equivalent) | 🟡 Planned |
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

```
┌─────────────────────────────────────────────────────────────┐
│                    Human (Agent)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Long-term Memory:                                          │
│  - "I know how to code review"                             │
│  - "I prefer concise outputs"                               │
│  - "I worked on PR #123 last week"                         │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│                                                             │
│  Context "Martin"              Context "François"          │
│  ┌────────────────────┐       ┌────────────────────┐      │
│  │ "Let's review PR #456" │   │ "Can you write     │      │
│  │ [active conversation] │   │ the docs for API"  │      │
│  │                       │   │ [paused, 3 days    │      │
│  │                       │   │  ago]              │      │
│  └───────────────────────┘   └────────────────────┘      │
│                                                             │
│  Transfer learning:                                         │
│  - Learned from Martin: "PR #456 has a bug"               │
│  - Can use it with François: "Based on PR #456 learning..." │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

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
