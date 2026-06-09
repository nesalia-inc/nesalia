# SDK — nesalia.com/sdk

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   SDK                                                            │
│                                                                 │
│   Build with Nesalia anywhere.                                   │
│                                                                 │
│   Isomorphic TypeScript SDK for web, Node.js, and edge.        │
│                                                                 │
│   [Get Started]  [Read the Docs]  [View on GitHub]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Build with Nesalia anywhere.

**Subheadline:**
```
Isomorphic TypeScript SDK for web, Node.js, and edge.
Works in browsers, servers, and edge runtimes.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs
- Tertiary: View on GitHub

---

## What is the SDK?

The Nesalia SDK is a **universal TypeScript library** that works everywhere JavaScript runs.

### Installation

```bash
npm install @nesalia/sdk
# or
pnpm add @nesalia/sdk
# or
yarn add @nesalia/sdk
```

### Quick Start

```typescript
import { createClient } from '@nesalia/sdk';

const client = createClient({
  apiKey: process.env.NESALIA_API_KEY
});

// Create an agent
const agent = await client.agents.create({
  name: 'my-agent',
  model: 'anthropic/claude-sonnet-4-6',
  instructions: 'You are a helpful assistant.'
});

// Invoke with streaming
for await (const chunk of client.agents.stream(agent.id, {
  prompt: 'Hello, how are you?'
})) {
  console.log(chunk.text);
}
```

---

## Features

### 1. Isomorphic

Same SDK for web, Node.js, and edge runtimes.

```typescript
// Works everywhere
import { createClient } from '@nesalia/sdk';

// Browser
const client = createClient({ apiKey: 'browser-key' });

// Node.js
const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

// Edge (Cloudflare Workers, Vercel Edge)
const client = createClient({ apiKey: env.NESALIA_API_KEY });
```

### 2. Full Type Safety

End-to-end TypeScript with complete type definitions.

```typescript
import { createClient, type Agent, type InvokeOptions } from '@nesalia/sdk';

const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

// Types auto-complete and validate
const agent: Agent = await client.agents.create({
  name: 'my-agent',
  model: 'anthropic/claude-sonnet-4-6', // Only valid models
  // ... strict typing
});
```

### 3. Streaming Support

Real-time responses with streaming.

```typescript
// Stream text
const stream = client.agents.stream(agentId, {
  prompt: 'Write a story'
});

for await (const chunk of stream) {
  console.log(chunk.text);
}

// Stream with metadata
const stream = client.agents.stream(agentId, {
  prompt: 'Explain this code',
  includeUsage: true
});

for await (const event of stream.events) {
  if (event.type === 'text') {
    console.log(event.text);
  }
  if (event.type === 'usage') {
    console.log(`Tokens: ${event.tokens}`);
  }
}
```

### 4. Error Handling

Predictable errors with detailed messages.

```typescript
import { createClient, NesaliaError, RateLimitError } from '@nesalia/sdk';

try {
  await client.agents.invoke(agentId, { prompt: 'Hello' });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter}s`);
  } else if (error instanceof NesaliaError) {
    console.log(`API error: ${error.message}`);
  }
}
```

---

## API Reference

### Client

```typescript
import { createClient } from '@nesalia/sdk';

const client = createClient({
  apiKey: string;
  baseUrl?: string;  // Default: https://api.nesalia.com
  timeout?: number;  // Default: 60000ms
  retry?: number;    // Default: 3
});
```

### Agents

```typescript
// Create
const agent = await client.agents.create({
  name: string;
  model: string;
  instructions?: string;
  sandbox?: 'daytona' | 'cloudflare';
  tools?: string[];
  memory?: { enabled: boolean; vectorStore?: string };
});

// List
const agents = await client.agents.list({ limit: 10, cursor?: string });

// Get
const agent = await client.agents.get('agent_id');

// Invoke
const response = await client.agents.invoke('agent_id', {
  prompt: string;
  context?: string;
  stream?: boolean;
});

// Stream
const stream = client.agents.stream('agent_id', { prompt: string });

// Delete
await client.agents.delete('agent_id');
```

### Contexts

```typescript
// Create
const context = await client.agents.createContext('agent_id', {
  name: string;
  metadata?: Record<string, any>;
});

// List
const contexts = await client.agents.listContexts('agent_id');

// Switch
await client.agents.switchContext('agent_id', 'context_id');

// Get history
const history = await client.agents.getHistory('agent_id', {
  context?: string;
  limit?: number;
});
```

### Workflows

```typescript
// Deploy
await client.workflows.deploy('./workflow.ts', {
  name: 'my-workflow'
});

// Run
const run = await client.workflows.run('my-workflow', {
  input: { key: 'value' }
});

// List runs
const runs = await client.workflows.listRuns('my-workflow', {
  status?: 'pending' | 'running' | 'complete' | 'failed';
});

// Get run
const run = await client.workflows.getRun('my-workflow', 'run_id');

// Stream logs
const logs = client.workflows.streamLogs('my-workflow', 'run_id');
```

---

## Usage Examples

### Web Application

```typescript
// pages/api/chat.ts
import { createClient } from '@nesalia/sdk';

const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

export async function POST(req: Request) {
  const { prompt, agentId } = await req.json();

  const stream = client.agents.stream(agentId, { prompt });

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

### Next.js Server Component

```typescript
// app/page.tsx
import { createClient } from '@nesalia/sdk';

const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

export default async function Page() {
  const agent = await client.agents.get('my-agent');

  return (
    <div>
      <h1>{agent.name}</h1>
      <p>Model: {agent.model}</p>
    </div>
  );
}
```

### Edge Function

```typescript
// edge-function.ts
import { createClient } from '@nesalia/sdk';

export default {
  async fetch(request: Request, env: Env) {
    const client = createClient({ apiKey: env.NESALIA_API_KEY });

    const response = await client.agents.invoke('my-agent', {
      prompt: 'Hello from the edge!'
    });

    return new Response(response.text);
  }
};
```

### CI/CD Script

```typescript
// scripts/ci-review.ts
import { createClient } from '@nesalia/sdk';

const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

const prNumber = process.env.PR_NUMBER;
const response = await client.agents.invoke('code-reviewer', {
  prompt: `Review PR #${prNumber}`,
  context: `pr-${prNumber}`
});

console.log('Review:', response.text);
process.exit(response.hasIssues ? 1 : 0);
```

---

## Integrations

### Framework Templates

| Framework | Install |
|-----------|---------|
| Next.js | `npx create-nesalia@latest --template nextjs` |
| Remix | `npx create-nesalia@latest --template remix` |
| SvelteKit | `npx create-nesalia@latest --template sveltekit` |
| Astro | `npx create-nesalia@latest --template astro` |

### Bundler Support

- Vite
- Webpack
- esbuild
- Rollup
- Turbopack

### Runtime Support

- Node.js 18+
- Deno
- Bun
- Cloudflare Workers
- Vercel Edge Functions
- AWS Lambda
- Browser (ESM)

---

## FAQ

**Is the SDK isomorphic across all frameworks?**

Yes. The SDK works in Next.js, Remix, SvelteKit, Astro, vanilla React, and any other framework. It also works in non-framework environments like Node.js scripts, Edge functions, and CLI tools.

**Does the SDK support CommonJS?**

Yes. Both ESM and CommonJS are supported.

**How do I handle streaming in the browser?**

```typescript
const stream = client.agents.stream(agentId, { prompt: 'Hello' });

for await (const chunk of stream) {
  // Handle streaming text
}
```

**Can I use the SDK server-side only?**

Yes. The SDK works both client and server-side. For browser usage, use a backend-for-frontend pattern to protect your API key.

---

## CTA

**Headline:** Start building with the SDK.

- Primary CTA: npm install @nesalia/sdk
- Secondary CTA: Read the Docs
- Tertiary CTA: View on GitHub