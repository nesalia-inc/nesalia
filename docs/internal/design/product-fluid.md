# Fluid Compute — nesalia.com/fluid

> **Status:** Future
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   FLUID COMPUTE                                                 │
│                                                                 │
│   Servers, in serverless form.                                  │
│                                                                 │
│   The efficiency of servers with the flexibility of serverless. │
│   Pay only for active compute, not idle time.                    │
│                                                                 │
│   [Get Started]  [Read the Docs]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Servers, in serverless form.

**Subheadline:**
```
The efficiency of servers with the flexibility of serverless.
Pay only for active compute, not idle time.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs

---

## What is Fluid Compute?

Fluid Compute is a **new execution model** that combines the best of servers and serverless.

### The Problem

Traditional serverless wastes resources during idle time:

```
Serverless Request:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Request ──→ [████] ──→ Response                          │
│                    │                                         │
│              Idle time,                                      │
│              still paying                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Solution

Fluid Compute keeps instances warm with in-function concurrency:

```
Fluid Compute Request:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Request 1 ──→ [████████████] ──→ Response 1              │
│   Request 2 ──→ [████████████] ──→ Response 2              │
│   Request 3 ──→ [████████████] ──→ Response 3              │
│                    │                                         │
│              Shared compute                                  │
│              One instance, many requests                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

### 1. In-Function Concurrency

Handle multiple requests on one instance.

```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    // This instance can handle multiple requests
    const result = await processRequest(request);
    return new Response(result);
  }
}
```

**Result:** Up to 70% cost reduction with zero code changes.

### 2. Active CPU Pricing

Pay only when CPU is actually used.

| Model | CPU Usage | Cost |
|-------|-----------|------|
| **Traditional Serverless** | 100% of time | Full price |
| **Fluid Compute** | Active CPU only | 30-70% savings |

### 3. Cold Start Prevention

Instances stay warm and ready.

- Bytecode pre-caching
- Warm pools for common handlers
- Sub-millisecond cold start elimination

### 4. Streaming Support

Built-in streaming for AI workloads.

```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const stream = new ReadableStream({
      async start(controller) {
        const result = await streamAIResponse();
        for await (const chunk of result) {
          controller.enqueue(chunk);
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  }
}
```

### 5. Cross-Region Failover

High availability across regions.

```typescript
const handler = {
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],

  async handle(request: Request): Promise<Response> {
    // Automatic failover if region fails
  }
};
```

---

## Comparison

| Feature | Traditional Serverless | Fluid Compute |
|---------|------------------------|---------------|
| Cold starts | Yes | Eliminated |
| Scaling | Vertical only | Horizontal + Vertical |
| Concurrency | One request/instance | Multi-request/instance |
| Pricing | Time-based | Active CPU-based |
| Idle cost | 100% | ~30% |
| Streaming | Manual | Built-in |

---

## Use Cases

### AI APIs

```typescript
// Multiple concurrent LLM calls
export default {
  async fetch(request: Request): Promise<Response> {
    const { prompt, model } = await request.json();

    const result = await callLLM({ prompt, model });

    return new Response(JSON.stringify(result));
  }
}
```

### Real-time Applications

```typescript
// WebSocket handling
export default {
  async fetch(request: Request): Promise<Response> {
    const socket = request.accept();

    socket.on('message', async (message) => {
      const response = await processMessage(message);
      socket.send(response);
    });
  }
}
```

### Long-Running Tasks

```typescript
// Background processing
export default {
  async fetch(request: Request): Promise<Response> {
    // Tasks can run longer without timeout
    const result = await runLongTask();

    return new Response(JSON.stringify(result));
  }
}
```

---

## Integrations

### With Sandbox

Sandbox runs on Fluid Compute for optimal cost.

```typescript
const sandbox = await Sandbox.create({
  compute: 'fluid',
  resources: { timeout: '1h' }
});
```

### With Agents

Agents use Fluid Compute for efficient execution.

```typescript
const agent = await client.agents.create({
  name: 'my-agent',
  compute: 'fluid'
});
```

---

## FAQ

**How much can I save?**

For I/O-bound workloads, savings of 50-95% are typical. For CPU-bound workloads, savings depend on CPU utilization.

**What languages are supported?**

Currently: Node.js, Python, Go, Rust. More coming soon.

**How is this different from AWS Lambda?**

Fluid Compute adds in-function concurrency and active CPU pricing on top of the Lambda execution model.

**Can I migrate from existing serverless?**

Yes. Most serverless functions work with minimal or no changes.

---

## CTA

**Headline:** Pay for compute, not idle time.

- Primary CTA: Get Started
- Secondary CTA: Read the Docs