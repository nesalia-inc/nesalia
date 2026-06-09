# Desktop — nesalia.com/desktop

> **Status:** Future
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   DESKTOP                                                       │
│                                                                 │
│   Your AI agents, on your desktop.                             │
│                                                                 │
│   Native interface for managing agents, contexts,               │
│   and sessions. Available on macOS and Windows.                  │
│                                                                 │
│   [Download for macOS]  [Download for Windows]  [Read the Docs]│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Your AI agents, on your desktop.

**Subheadline:**
```
Native interface for managing agents, contexts, and sessions.
Multi-agent sessions, persistent context, computer use.
```

**CTAs:**
- Primary: Download for macOS
- Secondary: Download for Windows
- Tertiary: Read the Docs

---

## What is the Desktop App?

The Nesalia Desktop App is a **native application** for managing AI agents directly from your computer.

### Key Benefits

- **Multi-agent sessions** — Run multiple agents simultaneously
- **Persistent context** — Pick up where you left off
- **Computer use** — Agents control your applications
- **Local models** — Run on-premise if needed

---

## Features

### 1. Multi-Agent Sessions

Run multiple agents at once, each with its own context.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │ Code Review │  │ Tech Writer │  │ CI Helper   │            │
│   │  ● Running  │  │  ○ Idle    │  │  ✓ Done    │            │
│   │  PR #123    │  │  Doc API    │  │  Deploy OK │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Persistent Context

Agents remember everything across sessions.

```typescript
// Agent picks up where it left off
const agent = await client.agents.get('my-agent');

// Previous context preserved:
// - Installed packages
// - Cloned repos
// - Running services
// - Knowledge from past sessions
```

### 3. Computer Use

Agents can control your applications directly.

```
Agent can:
├── Open VS Code and edit files
├── Navigate browsers
├── Read documents
├── Operate terminals
├── Interact with any desktop app
└── Execute code on your machine
```

### 4. Local Model Support

Run agents on your own hardware.

```yaml
# Local model configuration
model:
  provider: ollama  # or vllm, lm-studio
  endpoint: http://localhost:11434
  model: llama3.1:70b

# No data leaves your network
# Full offline capability
# Enterprise air-gapped deployment
```

### 5. Agent Computers

Give your agents their own persistent machines.

```typescript
// Create a dedicated machine for an agent
const computer = await client.computers.create({
  name: 'code-agent-machine',
  resources: {
    vcpus: 4,
    memory: '8GB',
    storage: '50GB'
  }
});

// Agent has its own environment
// Isolated from your host machine
// Can be SSH'd into
```

### 6. VS Code Integration

Connect agents directly to your IDE.

```typescript
// Link agent to VS Code
const session = await client.desktop.connectVSCode({
  agent: 'my-agent',
  server: 'local',  // or 'remote'
  workspace: '/path/to/project'
});

// Agent can:
// - Browse and edit files
// - Use terminal
// - Run extensions
// - See diagnostics
```

---

## How It Works

### 1. Download and Install

```bash
# macOS
brew install --cask nesalia

# Windows
winget install nesalia

# Or download from website
# https://nesalia.com/desktop
```

### 2. Sign In

```bash
nesalia auth login
# Opens browser for authentication
```

### 3. Launch an Agent

```typescript
// From desktop app:
// 1. Click "New Agent"
// 2. Select or create agent
// 3. Agent starts in sidebar
```

### 4. Work Together

```typescript
// Agent works on your machine
// You review in real-time
// Approve or request changes
```

---

## Use Cases

### Code Review While You Sleep

```
1. Start code-reviewer agent
2. Tell it to review PRs
3. Agent reviews overnight
4. Morning: Full review report
```

### Multi-Agent Pipeline

```
┌─────────────┐
│ Architect   │─── Designs API
└─────────────┘
       │
       ▼
┌─────────────┐
│ Coder       │─── Implements design
└─────────────┘
       │
       ▼
┌─────────────┐
│ Reviewer    │─── Reviews code
└─────────────┘
       │
       ▼
┌─────────────┐
│ Tester       │─── Writes tests
└─────────────┘
```

### Desktop Automation

```
Agent can:
├── Open your email client
├── Draft responses
├── Update spreadsheets
├── Create presentations
├── Generate reports
└── Automate any workflow
```

---

## Security

### Local Execution

- Commands run locally on your machine
- Risky operations require approval
- Data encrypted in transit and at rest

### Access Control

```yaml
# Permissions per agent
permissions:
  filesystem: read  # or read-write, none
  network: allow-list  # or deny-all
  shell: approved-only  # or all
  clipboard: read-write
```

### Enterprise Features

- Air-gapped deployment
- SSO/SAML integration
- Audit logs
- Policy management

---

## Comparison

| Feature | Web | CLI | Desktop |
|---------|-----|-----|---------|
| **Accessibility** | Anywhere | Terminal | Native app |
| **Computer use** | ❌ | ❌ | ✅ |
| **Multi-session** | Limited | ✅ | ✅ |
| **VS Code integration** | ❌ | ❌ | ✅ |
| **Local models** | ❌ | ✅ | ✅ |
| **Offline support** | ❌ | ✅ | ✅ |

---

## System Requirements

### macOS

- macOS 12 Monterey or later
- Apple Silicon or Intel
- 4GB RAM minimum
- 500MB disk space

### Windows

- Windows 10 or later
- 64-bit only
- 4GB RAM minimum
- 500MB disk space

### Linux (Future)

- Ubuntu 20.04+
- Debian 11+
- Fedora 36+

---

## Pricing

Desktop app is included in all plans:
- **Free**: 1 concurrent agent
- **Pro**: 5 concurrent agents
- **Enterprise**: Unlimited, air-gapped support

---

## FAQ

**What's the difference from the CLI?**

Desktop has a native UI, supports multiple agents simultaneously, enables computer use (agents control your apps), and integrates with VS Code.

**Can agents access my files?**

Only with your permission. Set granular permissions per agent for filesystem, network, and shell access.

**Does it work offline?**

Yes. Desktop supports local models via Ollama or vLLM. No internet required for local execution.

**Can I connect to remote machines?**

Yes. Agents can run on cloud computers you provision through Nesalia, or you can BYO (bring your own) server.

---

## CTA

**Headline:** Get the desktop app.

- Primary CTA: Download for macOS
- Secondary CTA: Download for Windows
- Tertiary CTA: Read the Docs