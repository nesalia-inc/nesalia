---
name: nesalia-vision
description: Nesalia's vision — hosted agents as individuals, better than OpenClaw/PicoClaw
type: project
---

# Nesalia — Vision & Strategy

## Core Vision

Build an architecture where **agents are individuals** — persistent, retrievable from anywhere, but running in a **hosted context**.

Think: OpenClaw/PicoClaw concept (agents accessible via chat apps) but **better crafted** and running on managed infrastructure.

## Comparison with References

| Feature | OpenClaw | PicoClaw | Nesalia (Target) |
|---------|----------|----------|------------------|
| **Language** | TypeScript | Go | TypeScript (DeesseJS) |
| **Infrastructure** | Desktop-first (macOS app) | Edge/embedded ($10 hardware) | **Hosted cloud** |
| **Deployment** | Local install | Binary deploy | Managed SaaS |
| **Agent persistence** | Session-based | Session-based | **Agent = individual identity** |
| **Multi-channel** | Yes (WhatsApp, Telegram, etc.) | Yes (19+ channels) | Yes (unified access) |
| **Agent retrieval** | Desktop app / chat | CLI / chat | **API / SDK / CLI / Web** |
| **Managed infrastructure** | ❌ | ❌ | ✅ |
| **Agent versioning** | ❌ | ❌ | ✅ |
| **Sandbox isolation** | ❌ | ❌ | ✅ (via Flue/Daytona) |
| **Memory persistence** | Basic | Basic | ✅ (long-term memory layer) |
| **Multi-agent orchestration** | Basic | SubTurn, Hooks | ✅ (true multi-agent comms) |
| **Billing/quotas** | ❌ | ❌ | ✅ |

## Key Differentiators

### 1. Agent = Individual Identity
```
┌─────────────────────────────────────────────────────┐
│                    Nesalia Platform                  │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Alice   │  │ Bob     │  │ Carol   │             │
│  │ (Dev)   │  │ (Writer)│  │ (Analyst)│            │
│  └────┬────┘  └────┬────┘  └────┬────┘             │
│       │             │             │                  │
│  Accessible from anywhere (API, CLI, SDK, Web)     │
│  But running in managed, isolated sandbox          │
└─────────────────────────────────────────────────────┘
```

### 2. Hosted vs Desktop/Embedded
- **OpenClaw**: You install it on your Mac, it runs there
- **PicoClaw**: You install it on a $10 device, it runs there
- **Nesalia**: Agents run on our infrastructure, you access them anywhere

### 3. What "Better Worked" Means
- Clean API/SDK (DeesseJS)
- Agent versioning and lifecycle management
- Long-term memory persistence layer
- True multi-agent communication
- Billing and quotas per agent
- Observability built-in
- Skills/marketplace ecosystem

## Technical Stack (Confirmed)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Agent Framework | **Flue** (@flue/runtime) | Harness, sessions, tools, sandboxes |
| LLM Abstraction | **Pi** (@earendil-works/pi-ai) | Multi-provider LLM API (15+ providers) |
| SDK | **DeesseJS** (own) | Isomorphic TypeScript SDK |
| Sandbox | **Daytona** / Cloudflare | Isolated container environments |
| Runtime | **Node.js** / Cloudflare Workers | Deploy targets |

## Products in Scope

1. **Agent Creator** — Create agents with role, tools, sandbox
2. **Intelligence Layer** — Inter-agent communication
3. **Workflow Builder** — Orchestrate multi-step processes
4. **GitHub Bot** — CI/CD integration
5. **SDK / CLI** — Developer consumption
6. **Managed Agents** — Core product (agents as individuals)

## Use Cases

- Autonomous Agents (technical writer, coach, analyst)
- Workflow automation
- GitHub automation
- Content creation

## Status

- Landing page: In progress
- Core architecture: Defined
- Implementation: TBD