# Sandbox — nesalia.com/sandbox

> **Status:** Future
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   SANDBOX                                                       │
│                                                                 │
│   Isolated, safe code execution.                                │
│                                                                 │
│   Run AI-generated code, user scripts, and plugins in          │
│   secure microVMs. No access to your infrastructure.           │
│                                                                 │
│   [Get Started]  [Read the Docs]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Isolated, safe code execution.

**Subheadline:**
```
Run AI-generated code, user scripts, and plugins in
secure microVMs. No access to your infrastructure.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs

---

## What is Sandbox?

Sandbox provides **isolated execution environments** for running untrusted code.

### Key Benefits

- **Secure isolation** — No access to host resources
- **Quick startup** — Milliseconds to boot
- **Resource limits** — CPU, memory, time constraints
- **Network policies** — Control outbound connections

---

## Features

### 1. MicroVM Isolation

Each sandbox runs in a secure microVM.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Host Infrastructure                                            │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│   │   │  Sandbox 1  │  │  Sandbox 2  │  │  Sandbox 3  │ │   │
│   │   │  (Python)   │  │  (Node.js)  │  │  (Browser)  │ │   │
│   │   └─────────────┘  └─────────────┘  └─────────────┘ │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   No sandbox can access:                                        │
│   ✗ Host filesystem                                             │
│   ✗ Environment variables                                      │
│   ✗ Other sandboxes                                            │
│   ✗ Host network                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Network Policies

Control outbound network access.

```typescript
const sandbox = await Sandbox.create({
  network: {
    policy: 'allow-list',
    allowedDomains: ['api.openai.com', '*.github.com'],
    blockedDomains: ['evil.com']
  }
});
```

### 3. Credential Brokering

Inject secrets without exposing them.

```typescript
const sandbox = await Sandbox.create({
  credentials: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
});

// Key is injected on egress, never stored in sandbox
const result = await sandbox.runCommand({
  cmd: 'curl',
  args: ['-H', 'Authorization: Bearer $OPENAI_API_KEY', 'https://api.openai.com/v1/models']
});
```

### 4. Snapshots

Save and restore sandbox state.

```typescript
// Create and configure
const sandbox = await Sandbox.create();
await sandbox.runCommand({ cmd: 'npm', args: ['install'] });

// Snapshot
const snapshot = await sandbox.snapshot();
console.log(snapshot.id);

// Restore instantly
const fast = await Sandbox.create({ snapshot: snapshot.id });
```

### 5. Resource Limits

Control resource usage.

```typescript
const sandbox = await Sandbox.create({
  resources: {
    vcpus: 2,
    memory: '1GB',
    timeout: '5m',
    storage: '100MB'
  }
});
```

---

## How It Works

### 1. Create a Sandbox

```typescript
import { Sandbox } from '@nesalia/sandbox';

const sandbox = await Sandbox.create({
  runtime: 'node22'
});
```

### 2. Run Code

```typescript
const result = await sandbox.runCommand({
  cmd: 'node',
  args: ['-e', 'console.log("Hello from sandbox!")']
});

console.log(result.stdout);  // "Hello from sandbox!"
console.log(result.exitCode);  // 0
```

### 3. Clean Up

```typescript
await sandbox.stop();
```

---

## Supported Runtimes

| Runtime | Version | Status |
|---------|---------|--------|
| **Node.js** | 18, 20, 22 | Available |
| **Python** | 3.11, 3.12, 3.13 | Available |
| **Browser** | Chromium | Planned |
| **Go** | 1.21+ | Planned |

---

## Use Cases

### AI Agent Code Execution

```typescript
// AI generates code
const code = await agent.generateCode(prompt);

// Run in sandbox
const sandbox = await Sandbox.create({ runtime: 'node22' });
const result = await sandbox.runCommand({
  cmd: 'node',
  args: ['-e', code]
});

// Verify output, no security risk
```

### User-Provided Scripts

```typescript
// User submits custom script
const script = request.body.script;

const sandbox = await Sandbox.create({
  network: { policy: 'deny-all' },
  resources: { timeout: '30s' }
});

await sandbox.runCommand({
  cmd: 'node',
  args: ['-e', script]
});
```

### Plugin Isolation

```typescript
// Third-party plugins
const pluginSandbox = await Sandbox.create({
  network: { policy: 'allow-list', allowedDomains: ['api.plugin.com'] },
  credentials: { PUBLIC_KEY: pluginPublicKey }
});
```

---

## Integrations

### With Agents

Sandbox is the default execution environment for Nesalia agents.

```typescript
const agent = await client.agents.create({
  name: 'code-runner',
  sandbox: 'daytona',  // Built-in sandbox
  tools: ['code-execution']
});
```

### SDK

```typescript
import { Sandbox } from '@nesalia/sandbox';

const sandbox = await Sandbox.create({
  runtime: 'python313',
  network: { policy: 'allow-list' }
});
```

---

## FAQ

**How is isolation implemented?**

Using Firecracker microVMs, the same technology that powers AWS Lambda. Each sandbox is a separate VM with its own kernel.

**Can sandboxed code access the internet?**

Only if you allow it via network policies. By default, all network access is blocked.

**What happens to secrets?**

Credentials are injected on egress only (outbound HTTP requests). They are never stored in the sandbox filesystem or environment.

**How long can a sandbox run?**

Default: 5 minutes. Pro: 1 hour. Enterprise: up to 5 hours.

---

## CTA

**Headline:** Run code safely.

- Primary CTA: Get Started
- Secondary CTA: Read the Docs