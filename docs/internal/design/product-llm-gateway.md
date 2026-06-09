# LLM Gateway — nesalia.com/llm-gateway

> **Status:** Future
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   LLM GATEWAY                                                   │
│                                                                 │
│   One endpoint. All your models.                                │
│                                                                 │
│   Route to hundreds of AI models through a centralized         │
│   interface. Unified billing, observability, and fallbacks.      │
│                                                                 │
│   [Get Started]  [Read the Docs]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** One endpoint. All your models.

**Subheadline:**
```
Route to hundreds of AI models through a centralized interface.
Unified billing, observability, and automatic fallbacks.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs

---

## What is LLM Gateway?

LLM Gateway is a **unified interface** for accessing multiple AI model providers.

### Key Benefits

- **Single API key** — Access all providers with one key
- **Automatic fallbacks** — Switch providers when one goes down
- **Unified billing** — One invoice for all usage
- **Observability** — Track usage across providers

---

## Features

### 1. Multi-Provider Support

Access 100+ models from multiple providers.

```typescript
// Access any model with one API key
const response = await gateway.generate({
  model: 'anthropic/claude-sonnet-4-6',
  prompt: 'Hello'
});

// Switch models easily
const response = await gateway.generate({
  model: 'openai/gpt-5.4',
  prompt: 'Hello'
});
```

### 2. Automatic Fallbacks

Never go down when a provider fails.

```yaml
# config: gateway.yml
routing:
  primary: anthropic/claude-sonnet-4-6
  fallbacks:
    - openai/gpt-5.4
    - google/gemini-3-flash
  retry_attempts: 3
  timeout: 30s
```

### 3. Unified Billing

One invoice for all AI usage.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Monthly Usage                                                  │
│                                                                 │
│   Anthropic Claude Sonnet 4.6    1.2M tokens    $24.00         │
│   OpenAI GPT-5.4               800K tokens      $16.00         │
│   Google Gemini 3 Flash       500K tokens      $0.50         │
│   ────────────────────────────────────────────────────────────  │
│   Total                        2.5M tokens      $40.50         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Usage Analytics

Track spending and usage across providers.

```typescript
const analytics = await gateway.analytics.getUsage({
  period: '30d',
  groupBy: 'provider'
});

// { anthropic: 1200, openai: 800, google: 500 }
```

### 5. Model Routing

Route requests based on cost, latency, or capability.

```yaml
# Route by capability
routing:
  strategy: capability
  rules:
    - if: task.type == 'code'
      use: anthropic/claude-sonnet-4-6
    - if: task.type == 'fast'
      use: google/gemini-3-flash
    - if: task.type == 'vision'
      use: openai/gpt-5.4-turbo
```

---

## Supported Providers

| Provider | Models | Status |
|----------|--------|--------|
| **Anthropic** | Claude 3/4, Sonnet, Opus | Available |
| **OpenAI** | GPT-4/5, o1, o3 | Available |
| **Google** | Gemini 1/2/3 | Available |
| **OpenRouter** | 100+ models | Available |
| **Ollama** | Local models | Available |
| **Azure OpenAI** | GPT-4, Codex | Available |
| **AWS Bedrock** | Claude, Titan, Llama | Available |
| **Groq** | Llama, Mixtral | Available |

---

## How It Works

### 1. Get an API Key

```bash
# Via dashboard
# Settings → API Keys → Create Key → Select "LLM Gateway"

# Via CLI
nesalia gateway keys create --name "my-key"
```

### 2. Configure Your Application

```typescript
import { createGatewayClient } from '@nesalia/gateway';

const gateway = createGatewayClient({
  apiKey: process.env.NESALIA_GATEWAY_KEY
});
```

### 3. Make Requests

```typescript
// Text generation
const response = await gateway.generate({
  model: 'anthropic/claude-sonnet-4-6',
  prompt: 'Explain quantum computing'
});

// Streaming
const stream = gateway.stream({
  model: 'openai/gpt-5.4',
  prompt: 'Write a story'
});

for await (const chunk of stream) {
  console.log(chunk.text);
}

// Chat
const chat = await gateway.chat({
  model: 'anthropic/claude-sonnet-4-6',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ]
});
```

---

## Integrations

### SDKs

| SDK | Install |
|-----|---------|
| TypeScript | `npm install @nesalia/gateway` |
| Python | `pip install nesalia-gateway` |
| Go | `go get github.com/nesalia/gateway-go` |
| Rust | `cargo add nesalia_gateway` |

### Frameworks

| Framework | Integration |
|-----------|-------------|
| Next.js | `@nesalia/next` |
| LangChain | `@nesalia/langchain` |
| LlamaIndex | `@nesalia/llamaindex` |

---

## FAQ

**How is this different from OpenRouter?**

LLM Gateway is built on top of providers like OpenRouter but adds:
- Integrated agent execution
- Workflow triggers
- Unified billing with Nesalia

**What's the pricing?**

Pay per token at provider list price + small platform fee. No markup on base model costs.

**Can I use my own provider keys?**

Yes. Bring-your-own-key mode available.

---

## CTA

**Headline:** Access all models from one place.

- Primary CTA: Get Started
- Secondary CTA: Read the Docs