# Mobile — nesalia.com/mobile

> **Status:** Future
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   MOBILE                                                        │
│                                                                 │
│   Your agents, in your pocket.                                   │
│                                                                 │
│   Native iOS and Android app for managing                       │
│   and interacting with your AI agents.                           │
│                                                                 │
│   [Download on App Store]  [Get on Google Play]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Your agents, in your pocket.

**Subheadline:**
```
Native iOS and Android app for managing
and interacting with your AI agents on the go.
```

**CTAs:**
- Primary: Download on App Store
- Secondary: Get on Google Play

---

## What is the Mobile App?

The Nesalia Mobile App brings **AI agents to your phone**.

### Key Benefits

- **Manage agents** — Create, edit, delete from anywhere
- **Real-time notifications** — Get updates when agents complete tasks
- **Voice input** — Talk to your agents
- **Cross-device sync** — Continue where you left off

---

## Features

### 1. Agent Management

Manage all your agents from your phone.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Agents                          +                             │
│   ───────                                                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 📝 Code Reviewer                                      │   │
│   │ ● Active    │    Last: 2h ago                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 📝 Tech Writer                                        │   │
│   │ ○ Idle      │    Last: Yesterday                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 📝 Support Agent                                      │   │
│   │ ✓ Running   │    Task: Reviewing PR #456               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Chat Interface

Talk to your agents like a messaging app.

```typescript
// Chat with agent
const response = await client.agents.chat('code-reviewer', {
  message: 'Review the latest PR',
  context: 'pr-789'
});
```

### 3. Voice Input

Speak to your agents.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   📝 Code Reviewer                                              │
│   ──────────────────                                            │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Review the API changes in PR #123  │   │
│   │                                              10:32 AM  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ I've reviewed the API changes. Overall looks good,    │   │
│   │ but I found a few issues...                            │   │
│   │                                              10:33 AM  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐       │
│   │ 🎤 Review the backend tests too...              🎤  │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Push Notifications

Stay updated on agent activity.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   🔔 Nesalia                                                     │
│                                                                 │
│   Code Reviewer completed PR #123 review                        │
│   Found 3 issues, 2 suggestions                                 │
│   2 min ago                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Quick Actions

Trigger agents with shortcuts.

```typescript
// Widget or shortcut
{
  name: 'Quick Review',
  agent: 'code-reviewer',
  prompt: 'Review the latest PR',
  icon: '📝'
}
```

### 6. Offline Mode

Access cached context when offline.

```typescript
// Offline capability
const offlineContext = await client.agents.getCachedContext('code-reviewer');
// View recent conversation history
// Queue new prompts for when online
```

---

## How It Works

### 1. Download and Sign In

```bash
# iOS
# App Store → Search "Nesalia" → Download

# Android
# Google Play → Search "Nesalia" → Install
```

### 2. Connect to Your Account

```bash
# Sign in with existing account
# Or create new account
# Same authentication as web/desktop
```

### 3. Start Chatting

```typescript
// Select an agent
// Type or speak your message
// Get instant response
```

---

## Integration with Other Products

### Desktop Sync

```
Phone                          Desktop
  │                               │
  ├─ Start agent ────────────────┼─ Continue on desktop
  │                               │
  ├─ Check status ───────────────┼─ Full view with logs
  │                               │
  └─ Review results ─────────────┼─ Deep dive
```

### Marty Bot Notifications

```typescript
// Get notified when Marty reviews a PR
{
  trigger: 'marty.pr.reviewed',
  agent: 'notifications',
  message: 'New PR review ready'
}
```

### Workflow Triggers

```typescript
// Trigger workflows from mobile
const run = await client.workflows.run('release-automation', {
  input: { pr: 123, branch: 'feature/test' }
});
```

---

## Security

### Biometric Authentication

```typescript
// Face ID / Touch ID / Fingerprint
await client.auth.enableBiometric();

// Or PIN fallback
await client.auth.setPIN('123456');
```

### End-to-End Encryption

- Messages encrypted in transit
- Local data encrypted on device
- Secure enclave for credentials

### Remote Wipe

```typescript
// Lost phone? Wipe from web
await client.account.remoteWipe();

// Or from another device
await client.devices.revoke('device-id');
```

---

## System Requirements

### iOS

- iOS 15 or later
- iPhone, iPad, iPod touch
- 100MB disk space

### Android

- Android 8.0 (API 26) or later
- 100MB disk space
- Play Services (for notifications)

---

## Pricing

Mobile app is included in all plans:
- **Free**: Basic chat, 1 agent
- **Pro**: Full access, unlimited agents
- **Enterprise**: SSO, audit logs

---

## FAQ

**Can I use it offline?**

Partially. You can view cached conversations and queue prompts, but responses require connection.

**Is it separate from Desktop?**

No. Same account, same agents. Sessions sync across all devices.

**What about voice commands?**

Yes. Siri shortcuts and Google Assistant integration for triggering agents.

**Can I manage all agents?**

Yes. Full CRUD for agents, contexts, and workflows from mobile.

---

## CTA

**Headline:** Take your agents everywhere.

- Primary CTA: Download on App Store
- Secondary CTA: Get on Google Play