---
name: claude-managed-agents-reference
description: Claude Managed Agents capabilities — the reference Nesalia should match/complement
type: reference
---

# Claude Managed Agents — Reference

**Source:** https://platform.claude.com/docs/en/managed-agents/

## Core Architecture

Claude Managed Agents provides a fully managed harness + infrastructure for running Claude as an autonomous agent.

```
┌─────────────────────────────────────────────────────────────┐
│                  Claude Managed Agents                      │
├─────────────────────────────────────────────────────────────┤
│  Agent (model, system, tools, MCP, skills)                  │
│  Environment (cloud sandbox / self-hosted)                  │
│  Session (running instance, persistent events)              │
│  Events (SSE stream, user messages, tool results)           │
└─────────────────────────────────────────────────────────────┘
```

## The 4 Core Concepts

| Concept | Description |
|---------|-------------|
| **Agent** | Reusable, versioned config: model + system prompt + tools + MCP + skills |
| **Environment** | Sandbox config: cloud (Anthropic-managed) or self-hosted |
| **Session** | Running agent instance — persistent conversation history + filesystem |
| **Events** | SSE stream — user messages in, tool results + responses out |

## Key Features

### Agent Configuration
- **Model**: All Claude 4.5+ models supported (opus, sonnet, haiku)
- **System prompt**: Defines persona and behavior
- **Tools**: Built-in toolset (bash, read, write, edit, glob, grep, web fetch/search) + custom tools
- **MCP servers**: Connect to external tool providers
- **Skills**: Domain-specific context with progressive disclosure
- **Multiagent**: Coordinator can delegate to other agents

### Agent Lifecycle
- Create once, reference by ID across sessions
- Versioned — updates generate new version numbers
- Archive to make read-only (existing sessions continue)
- List version history to track changes

### Environment (Sandbox)
- **Cloud**: Anthropic-managed sandbox, pre-installed packages, networking
- **Self-hosted**: On your own infrastructure (compliance/data-residency)
- Networking config: unrestricted or custom

### Session
- SSE streaming for real-time events
- Persistent conversation history
- Can steer/interrupt agent mid-execution
- Session resumes cleanly after pauses
- Filesystem state persists across interactions

### Multiagent (Inter-agent Communication)
- One coordinator agent can delegate to other agents
- Each sub-agent runs in its own session thread (isolated context)
- Shared: sandbox, filesystem, vault credentials
- Not shared: tools, MCP servers, context
- Threads are persistent — can send follow-up to same agent
- Patterns: parallelization (fan out) + specialization (domain agents)

### Tools Available
| Tool | Description |
|------|-------------|
| bash | Execute shell commands |
| read/write/edit/glob/grep | File operations |
| web_fetch | Fetch content from URL |
| web_search | Search the web |

### Custom Tools
- Define input_schema (JSON schema)
- Your code executes, returns result to Claude
- Best practices: detailed descriptions, consolidate related ops, meaningful namespacing

## What Claude Managed Agents Provides (Managed)

- ✅ Agent configuration API (create, update, version, archive)
- ✅ Session management (create, stream events, send messages)
- ✅ Cloud sandbox infrastructure (provisioning, lifecycle)
- ✅ Multiagent orchestration (coordinator + subagents)
- ✅ SSE event streaming
- ✅ Persistence (conversation history, filesystem state)
- ✅ Self-hosted option (bring your own infrastructure)
- ✅ Skills framework
- ✅ MCP connector
- ❌ Billing/quotas per agent (you manage)
- ❌ User-facing UI (you build)
- ❌ Marketplace (you build)

## Compared to Flue

| Feature | Claude Managed Agents | Flue |
|---------|----------------------|------|
| Managed infrastructure | ✅ (cloud + self-hosted) | ❌ (bring your own) |
| Agent versioning | ✅ | ❌ |
| Multiagent (true inter-agent) | ✅ (isolated threads) | ❌ (subagents are intra-session) |
| Shared filesystem | ✅ | ❌ |
| Persistent sessions | ✅ | ✅ |
| Custom tools | ✅ | ✅ |
| MCP servers | ✅ | ✅ |
| Skills | ✅ | ✅ |
| Self-hosted option | ✅ | ✅ (via Daytona) |
| Pricing | Per-token (Claude API) | Open (bring your own model) |

## What Nesalia Can Learn From Claude

Nesalia using Flue should match:
1. **Agent versioning** — add version history to agent configs
2. **Multiagent** — implement coordinator pattern with isolated session threads
3. **Skills framework** — document format for reusable expertise
4. **Session persistence** — conversation history + filesystem state
5. **Event streaming** — SSE for real-time updates
6. **Environment lifecycle** — sandbox provisioning/destruction API

**Source URLs:**
- Overview: https://platform.claude.com/docs/en/managed-agents/overview
- Quickstart: https://platform.claude.com/docs/en/managed-agents/quickstart
- Agent Setup: https://platform.claude.com/docs/en/managed-agents/agent-setup
- Tools: https://platform.claude.com/docs/en/managed-agents/tools
- Multiagent: https://platform.claude.com/docs/en/managed-agents/multi-agent