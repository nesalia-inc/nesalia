---
name: flue-framework-reference
description: Flue Framework capabilities — the agent harness framework Nesalia uses for managed agents
type: reference
---

# Flue Framework — Reference

**Source:** https://flueframework.com/docs/

## Core Concept: Harness-first Architecture

Flue gives any LLM model the context and environment needed for autonomous work:
- Sessions, tools, skills, instructions, filesystem access, secure sandbox

The **harness** = all context (instructions, tools, skills, sessions, files). You fill it and tell the model to solve the task — no scripting required.

## Two Work Modes

| Mode | Use case | Continuity |
|------|----------|------------|
| **Agents** | Conversational, continuing context | ✅ Persistent sessions |
| **Workflows** | Background jobs, one-shot tasks | ❌ Finite, isolated runs |

## Building Blocks

| Block | Role |
|-------|------|
| **Tools** | Typed actions for APIs, DB, external services (`defineTool()`) |
| **Skills** | Reusable instructions as markdown packages (`.agents/skills/` or `SKILL.md`) |
| **Subagents** | Delegation to specialized roles (child sessions, not separate endpoints) |
| **Sandboxes** | Workspace isolation (virtual / local / remote) |
| **MCP Servers** | Connect to Model Context Protocol ecosystem |
| **Observability** | OpenTelemetry, Braintrust, Sentry exports |

## Three Sandbox Types

| Type | Characteristics |
|------|-----------------|
| **Virtual** (default) | Lightweight, in-memory, not isolated |
| **Local** | Full host filesystem access, NOT isolated |
| **Remote** | Container-backed isolation via Daytona, Cloudflare Sandbox |

## Deploy Targets

Node.js · Cloudflare Workers · GitHub Actions · GitLab CI/CD · Daytona

## Key API Patterns

```typescript
// Agent definition
export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: '...',
  tools: [...],
  skills: [...],
  sandbox: local() | remote(provider),
  subagents: [profile],
}));

// Workflow definition
export async function run({ init, payload }: FlueContext<{ input: string }>) {
  const harness = await init(agent);
  const session = await harness.session();
  const response = await session.prompt(payload.input);
  return { result: response.text };
}

// Subagent delegation
const profile = defineAgentProfile({ name: 'specialist', instructions: '...' });
await session.task(input, { agent: 'specialist', result: Schema });
```

## What Flue Does NOT Provide Natively

- Multi-tenant management
- Billing / quotas per agent
- Agent creation UI
- Role/skill marketplace
- Long-term memory storage (beyond session history)
- Inter-agent communication protocol (subagents are intra-session only)

## Compared to Claude Managed Agents

| Feature | Claude Managed Agents | Flue |
|---------|----------------------|------|
| Agent roles | ✅ | ✅ (via harness config) |
| Isolated sandbox | ✅ | ✅ (Daytona/Cloudflare) |
| Persistent memory | ✅ | ❌ (sessions only, no long-term storage) |
| Multi-agent comms | ✅ | ❌ (subagents are intra-session) |
| Managed billing | ✅ | ❌ (build yourself) |
| SDK/CLI | ✅ | ✅ (via DeesseJS) |

## Why Nesalia Uses Flue

Flue provides the foundational harness architecture for managed agents. Nesalia wraps it with:
- Multi-tenant management layer
- Sandbox lifecycle management (create/destroy/reuse)
- Long-term memory persistence layer
- Inter-agent communication/events
- Billing and quotas
- Agent creation UI

**Source URLs:**
- Homepage: https://flueframework.com/
- Agents: https://flueframework.com/docs/guide/building-agents/
- Sandboxes: https://flueframework.com/docs/guide/sandboxes/
- Subagents: https://flueframework.com/docs/guide/subagents/
- Tools: https://flueframework.com/docs/guide/tools/
- Skills: https://flueframework.com/docs/guide/skills/
- Workflows: https://flueframework.com/docs/guide/workflows/
- Why Flue: https://flueframework.com/docs/introduction/why-flue/
