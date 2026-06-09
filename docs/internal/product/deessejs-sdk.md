# DeesseJS — SDK & CLI

> **Status:** Design Phase
> **Last Updated:** 2026-06-09

---

## Vision

**DeesseJS** is the developer experience layer for Nesalia — an SDK and CLI that makes it easy to interact with agents, trigger workflows, and build integrations.

Think: **Pi, but for Nesalia**. Fork or inspired by [Pi](https://pi.dev), but targeting the Nesalia hosted platform instead of local execution.

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Experience                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    SDK      │  │    CLI      │  │   Web UI   │          │
│  │  (DeesseJS) │  │  (nesalia)  │  │  (future)  │          │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘          │
│         │                │                                  │
│         └────────────────┴──────────────────────────────────┘
│                          │                                    │
│              ┌───────────▼───────────┐                         │
│              │   HTTP API           │                         │
│              │ (universal interface)│                         │
│              └───────────┬───────────┘                         │
│                          │                                     │
│              ┌───────────▼───────────┐                         │
│              │  Nesalia Platform    │                         │
│              │  (Flue-powered)      │                         │
│              └─────────────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Relationship with Pi

**DeesseJS is inspired by or forked from [Pi](https://pi.dev).**

| Aspect | Pi | DeesseJS |
|--------|-----|----------|
| **Base** | `@earendil-works/pi-ai` | Fork of Pi |
| **Provider abstraction** | ✅ 15+ providers | ✅ 15+ providers |
| **Target** | Local / self-hosted | **Nesalia hosted** |
| **Agents** | Single agent | **Multiple agents** |
| **Contexts** | Single session | **Multi-context** |
| **Workflows** | ❌ | **✅ Built-in** |
| **Memory** | Session only | **Long-term memory** |
| **Sandbox** | Local / Docker | **Daytona (hosted)** |
| **GitHub Integration** | Basic | **Marty-powered** |

---

## CLI (`nesalia`)

### Installation

```bash
# npm
npm install -g @nesalia/cli

# Homebrew (macOS)
brew install nesalia/tap/nesalia

# curl (Linux/WSL)
curl -fsSL https://get.nesalia.com/cli | sh
```

### Core Commands

```bash
# Agent commands
nesalia agent [prompt]          # One-shot agent invocation
nesalia agent                   # Interactive mode
nesalia agents list             # List available agents
nesalia agents create           # Create new agent
nesalia agents delete <name>    # Delete agent

# Context commands
nesalia context list            # List contexts
nesalia context switch <id>     # Switch to context
nesalia context reset           # Reset current context
nesalia context delete <id>     # Delete context

# Session commands
nesalia session list            # List sessions in context
nesalia session show <id>       # Show session history
nesalia session reset <id>      # Reset session

# Workflow commands
nesalia workflow list           # List workflows
nesalia workflow run <name>    # Trigger workflow
nesalia workflow status <id>   # Check run status

# Connect to agent
nesalia connect <agent-name>   # Interactive session
```

### Interactive Mode

```bash
$ nesalia connect my-coder

Connected to: my-coder
Context: pr-123
Type 'exit' to quit, 'help' for commands.

> Review the auth module
[Agent thinking...]
[Agent typing...]
The auth module looks good. I found one issue...

> Can you fix the SQL injection?
[Agent working...]
Fixed. Here's the change...

> exit
Goodbye!
```

### Configuration

```bash
# Authenticate
nesalia auth login
nesalia auth logout

# Set default agent
nesalia config set default-agent my-coder

# Set API endpoint
nesalia config set api-endpoint https://api.nesalia.com

# View config
nesalia config show
```

---

## SDK (`@nesalia/sdk`)

### Installation

```bash
npm install @nesalia/sdk
pnpm add @nesalia/sdk
yarn add @nesalia/sdk
```

### Initialization

```typescript
import { createClient } from '@nesalia/sdk';

const client = createClient({
  apiKey: process.env.NESALIA_API_KEY,
  // Optional: custom endpoint
  endpoint: 'https://api.nesalia.com',
});
```

### Agent Invocation

```typescript
// Simple invoke
const response = await client.agents.invoke('my-coder', {
  prompt: 'Review PR #123',
});

// With context
const response = await client.agents.invoke('my-coder', {
  prompt: 'Write the docs for this API',
  context: 'pr-123',
  session: 'docs-session',
});

// With model override
const response = await client.agents.invoke('my-coder', {
  prompt: 'Complex analysis',
  model: 'anthropic/claude-opus-4-6',
});
```

### Streaming

```typescript
// Stream response
for await (const chunk of client.agents.stream('my-coder', {
  prompt: 'Explain this code',
})) {
  process.stdout.write(chunk.text);
}

// With structured output
const { data } = await client.agents.invoke('my-coder', {
  prompt: 'Analyze this PR',
  result: {
    priority: ['low', 'medium', 'high'],
    summary: 'string',
    risks: ['string'],
  },
});
```

### Context Management

```typescript
// List contexts
const contexts = await client.contexts.list();

// Create context
const context = await client.contexts.create({
  name: 'pr-456',
  description: 'Code review for PR #456',
});

// Switch context
await client.contexts.switch('pr-456');

// Delete context
await client.contexts.delete('pr-456');
```

### Session Management

```typescript
// List sessions in context
const sessions = await client.sessions.list({
  context: 'pr-456',
});

// Get session history
const session = await client.sessions.get('session-123');

// Reset session
await client.sessions.reset('session-123');
```

### Workflow Triggers

```typescript
// Trigger workflow
const run = await client.workflows.trigger('changelog-workflow', {
  version: '2.0.0',
  changelog: [
    { type: 'feature', description: 'New auth system' },
    { type: 'fix', description: 'SQL injection vulnerability' },
  ],
});

// Check status
const status = await client.workflows.status(run.id);

// Stream events
for await (const event of client.workflows.stream(run.id)) {
  console.log(event.type, event.data);
}
```

### Agent Management

```typescript
// List agents
const agents = await client.agents.list();

// Get agent
const agent = await client.agents.get('my-coder');

// Create agent
const agent = await client.agents.create({
  name: 'my-coder',
  model: 'anthropic/claude-sonnet-4-6',
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_KEY,
  instructions: 'You are a code reviewer...',
  tools: ['read', 'write', 'bash'],
  skills: ['code-review'],
  sandbox: 'daytona',
});

// Update agent
await client.agents.update('my-coder', {
  instructions: 'Updated instructions...',
});

// Delete agent
await client.agents.delete('my-coder');
```

---

## SDK vs CLI Comparison

| Feature | SDK | CLI |
|---------|-----|-----|
| **Interactive mode** | ❌ | ✅ |
| **Scripting** | ✅ | ✅ |
| **Streaming** | ✅ | ✅ |
| **Agent management** | ✅ | ✅ |
| **Context management** | ✅ | ✅ |
| **Workflow triggers** | ✅ | ✅ |
| **GitHub integration** | Via API | ✅ |
| **CI/CD usage** | ✅ | ✅ |

---

## Error Handling

```typescript
import { NesaliaError, RateLimitError, AuthenticationError } from '@nesalia/sdk';

try {
  const response = await client.agents.invoke('my-coder', {
    prompt: 'Do something',
  });
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limiting
    await sleep(error.retryAfter);
  } else if (error instanceof AuthenticationError) {
    // Handle auth issues
    console.error('Invalid API key');
  } else if (error instanceof NesaliaError) {
    // Handle other errors
    console.error(error.message);
  }
}
```

---

## TypeScript Support

Full TypeScript types included:

```typescript
import type {
  Agent,
  Context,
  Session,
  WorkflowRun,
  InvokeOptions,
  StreamChunk,
} from '@nesalia/sdk';

// Fully typed
const response = await client.agents.invoke<{
  summary: string;
  priority: 'low' | 'medium' | 'high';
}>('my-coder', {
  prompt: 'Analyze this PR',
});
```

---

## Status

| Component | Status |
|-----------|--------|
| **SDK Architecture** | 🟡 Planned |
| **CLI Commands** | 🟡 Planned |
| **Pi Fork/Inspiration** | 🟡 Research |
| **Implementation** | ❌ Not started |

---

## Related

- [Product README](./README.md) — Overall product vision
- [Nesalia Vision](../agent-memory/nesalia-vision.md) — Core platform vision
- [Pi Reference](../agent-memory/pi-dev.md) — Reference for CLI/SDK inspiration