# Agents — nesalia.com/agents

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   AGENTS                                                        │
│                                                                 │
│   AI agents that work for you.                                 │
│                                                                 │
│   Deploy agents with personalities. Give them memory.          │
│   Trigger them from anywhere.                                  │
│                                                                 │
│   [Get Started]  [Read the Docs]                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** AI agents that work for you.

**Subheadline:**
```
Deploy AI agents with long-term memory, isolated sandboxes,
and universal access via HTTP API. Built on Flue. Powered by Pi.
Your LLM. Your rules.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs

---

## What are Agents?

Nesalia Agents are **persistent AI workers** with human-like memory and context management.

### The Human Model

```
Agent = Identity + Memory + Contexts

┌─────────────┐
│   Agent     │
├─────────────┤
│  Identity   │  Name, role, persona
│  Memory     │  Long-term facts, learned patterns
├─────────────┤
│  Context A  │  "PR #123 review"
│  └── Session│     Thread 1
│  Context B  │  "Slack #general"
│  └── Session│     Thread 1, Thread 2
└─────────────┘
```

### Why Agents vs API Calls?

| API Call | Agent |
|----------|-------|
| Stateless | Stateful — remembers context |
| One-off | Persistent — across sessions |
| Fixed prompt | Learning — gets better over time |
| Single task | Multi-context — handles parallel work |
| Fixed tools | Expandable — learns new capabilities |

---

## Features

### 1. Agent Memory

Agents remember what they've learned, even across restarts.

- Long-term memory stored in vector database
- Weighted by recency and relevance
- Transfer learning between contexts

### 2. Multi-Context Model

Agents can work on multiple things simultaneously without confusion.

```
Agent: "Code Reviewer"
├── Context: "PR #123" (frontend changes)
├── Context: "PR #456" (API changes)
└── Context: "Weekly Report"
```

### 3. Sandboxed Isolation

Each agent runs in its own secure container (Daytona).

- Isolated filesystem
- No access to host environment
- Resource limits (CPU, memory, time)
- Network policy (allow/deny by domain)
- Credentials injected on egress only

### 4. Universal Access (HTTP API)

Trigger agents from anywhere.

```typescript
// SDK
const response = await client.agents.invoke('code-reviewer', {
  prompt: 'Review PR #123',
  context: 'pr-123'
});

// CLI
nesalia agents invoke code-reviewer --prompt "Review PR #123"

// GitHub Action
- uses: nesalia/code-review@v1
  with:
    agent: code-reviewer
    pr: ${{ github.event.pull_request.number }}
```

### 5. Your LLM, Your Rules

Bring your own LLM provider.

```
├── anthropic/claude-sonnet-4-6
├── openai/gpt-5.4
├── google/gemini-3-flash
├── openrouter/moonshotai/kimi-k2
├── ollama/llama3.1:8b
└── ...100+ models via Pi
```

### 6. Tool Calling

Agents can use tools to interact with the real world.

- Web search
- File system (sandboxed)
- Git operations
- API calls
- Code execution
- Custom tools (bring your own)

---

## How It Works

### 1. Create an Agent

```typescript
import { createClient } from '@nesalia/sdk';

const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

const agent = await client.agents.create({
  name: 'code-reviewer',
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `You are an expert code reviewer.
Focus on:
- Code quality and readability
- Security vulnerabilities
- Performance issues
- Test coverage`,
  sandbox: 'daytona',
  tools: ['git', 'filesystem', 'web-search'],
  memory: {
    enabled: true,
    vectorStore: 'pinecone'
  }
});
```

### 2. Trigger from Anywhere

```typescript
// Simple invocation
const response = await client.agents.invoke('agent_abc123', {
  prompt: 'Review the changes in PR #123'
});

// With streaming
for await (const chunk of client.agents.stream('agent_abc123', {
  prompt: 'Review the changes in PR #123'
})) {
  process.stdout.write(chunk.text);
}
```

### 3. Manage Contexts

```typescript
// Create a new context
const context = await client.agents.createContext('agent_abc123', {
  name: 'PR #456',
  metadata: { prNumber: 456 }
});

// Switch between contexts
await client.agents.switchContext('agent_abc123', context.id);

// List all contexts
const contexts = await client.agents.listContexts('agent_abc123');
```

---

## Use Cases

### Code Review Agent

```
Agent: "Senior Code Reviewer"
├── Role: Reviews PRs automatically
├── Memory: Knows team conventions, past issues
├── Contexts: One per PR being reviewed
└── Tools: Git, filesystem, CI status
```

### Technical Writer

```
Agent: "Documentation Writer"
├── Role: Writes and maintains docs
├── Memory: Knows product inside-out
├── Contexts: Per feature/document
└── Tools: Markdown, search, API docs
```

### Customer Support Agent

```
Agent: "Support Specialist"
├── Role: Answers support tickets
├── Memory: Knows common issues, solutions
├── Contexts: Per customer conversation
└── Tools: Knowledge base, ticket system
```

---

## Integrations

| Trigger | How it works |
|---------|--------------|
| **HTTP API** | Direct API call |
| **SDK** | TypeScript/JavaScript |
| **CLI** | Command line |
| **GitHub Action** | CI/CD pipeline |
| **GitHub Bot** | Comment-based (Marty) |
| **Webhook** | External events |
| **Mobile SDK** | Native mobile apps |

---

## FAQ

**How is this different from just calling an LLM API?**

Agents have **memory** and **state**. A simple API call is stateless — each request starts fresh. Agents remember context, learn from interactions, and can handle multiple parallel tasks without confusion.

**Can I use my own LLM provider?**

Yes. Nesalia uses [Pi](https://pi.dev) for LLM abstraction, supporting 100+ models from providers like Anthropic, OpenAI, Google, Ollama, and more.

**How is sandbox isolation implemented?**

Agents run in [Daytona](https://daytona.io) sandboxes — isolated microVMs with no access to host resources.

**Can agents communicate with each other?**

Yes. Agents can invoke other agents, pass context, and collaborate on tasks.

---

## CTA

**Headline:** Start building agents today.

- Primary CTA: Get Started Free
- Secondary CTA: Read the Docs
- Enterprise: Talk to Sales