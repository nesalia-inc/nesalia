---
name: pi-dev-reference
description: Pi (pi.dev) — the AI agent toolkit that Flue uses internally for LLM provider abstraction
type: reference
---

# Pi (pi.dev) — Reference

**Source:** https://pi.dev | https://github.com/earendil-works/pi

## What is Pi?

Pi is a **minimal agent harness** — a coding agent CLI that you can customize with extensions, skills, prompt templates, and themes. Think of it as a programmable Claude Code.

## Relationship with Flue

**Flue uses Pi internally for LLM provider abstraction.**

From Flue's Provider API docs:
```typescript
import { registerApiProvider } from '@flue/runtime';
// registerApiProvider is re-exported from @earendil-works/pi-ai
```

Flue's `@flue/runtime` wraps `@earendil-works/pi-ai` for:
- Unified multi-provider LLM API (OpenAI, Anthropic, Google, Azure, Bedrock, etc.)
- Wire protocol handlers for different API formats
- Provider registration and configuration

## Pi's Core Packages

| Package | Description |
|---------|-------------|
| **[@earendil-works/pi-ai](packages/ai)** | Unified multi-provider LLM API |
| **[@earendil-works/pi-agent-core](packages/agent)** | Agent runtime with tool calling and state management |
| **[@earendil-works/pi-coding-agent](packages/coding-agent)** | Interactive coding agent CLI |
| **[@earendil-works/pi-tui](packages/tui)** | Terminal UI library |

## Pi's Key Features

### 15+ Providers, Hundreds of Models
Anthropic, OpenAI, Google, Azure, Bedrock, Mistral, Groq, Cerebras, xAI, Hugging Face, Kimi, MiniMax, OpenRouter, Ollama, and more.

### Context Engineering
- **AGENTS.md**: Project instructions loaded at startup
- **SYSTEM.md**: Replace/append to default system prompt
- **Compaction**: Auto-summarizes older messages when approaching context limit
- **Skills**: Capability packages with instructions and tools, loaded on-demand
- **Prompt templates**: Reusable prompts as Markdown files
- **Dynamic context**: Extensions can inject messages, filter history, implement RAG

### Session Management
- Tree-structured, shareable history
- Navigate to any previous point and continue
- Export to HTML, upload to GitHub gist

### Four Modes
1. **Interactive**: Full TUI experience
2. **Print/JSON**: `pi -p "query"` for scripts
3. **RPC**: JSON protocol over stdin/stdout
4. **SDK**: Embed Pi in your apps

### Extensions& Packages
50+ packages on npm for:
- Subagents
- MCP adapter
- Web access
- Memory/persistence
- Security audits
- Code analysis
- And more...

## What Pi Does NOT Include (Intentional)

- ❌ **No MCP built-in** — Build CLI tools with READMEs or extensions
- ❌ **No sub-agents** — Spawn Pi instances via tmux or build with extensions
- ❌ **No permission popups** — Containerize or build your own confirmation flow
- ❌ **No plan mode** — Write plans to files or build with extensions
- ❌ **No built-in to-dos** — Use TODO.md or build with extensions
- ❌ **No background bash** — Use tmux

## Pi vs Flue

| Aspect | Pi | Flue |
|--------|-----|------|
| Type | Coding agent CLI | Agent framework |
| Use case | Interactive coding | Headless programmable agents |
| Sandbox | Container/Docker | Virtual, local, or remote |
| Deploy targets | Local only | Node.js, Cloudflare, CI/CD |
| Provider abstraction | Built-in | Via @earendil-works/pi-ai |
| Skills | Markdown packages | SKILL.md format |
| Multi-agent | Via extensions | Subagents in harness |

## What This Means for Nesalia

1. **Provider flexibility**: Flue inherits Pi's 15+ provider support. Nesalia can use any LLM provider.

2. **Extension ecosystem**: Pi has 50+ npm packages for subagents, MCP, memory, etc. Can be inspiration for Nesalia features.

3. **Minimal by design**: Pi intentionally omits features — you build what you need. Matches Flue's philosophy.

4. **Skills format**: Pi uses markdown-based skills. Flue uses SKILL.md. Could adopt Pi's skill format for compatibility.

## Source URLs
- Homepage: https://pi.dev
- GitHub: https://github.com/earendil-works/pi
- Packages: https://pi.dev/packages