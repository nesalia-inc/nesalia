---
name: session-architecture
description: Human-like agent memory model — long-term tasks, individual contexts, selective forgetting, transfer learning
type: project
---

# Session Architecture — Human Mental Model

**Date:** 2026-06-09
**Status:** Design Decision — Human analogy adopted

---

## Core Insight (Human Analogy)

Think of an agent like a **human colleague**:

- You have **long-term tasks** that persist
- You have **individual contexts** with different people (Martin vs François — different topics)
- You can **forget things** when switching contexts
- You can **return to any context** anytime
- You **learn things in one context** that can be useful in another

```
┌─────────────────────────────────────────────────────────────┐
│                    Human (Agent)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Long-term Memory:                                          │
│  - "I know how to code review"                             │
│  - "I prefer concise outputs"                               │
│  - "I worked on PR #123 last week"                         │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│                                                             │
│  Context "Martin"              Context "François"          │
│  ┌────────────────────┐       ┌────────────────────┐      │
│  │ "Let's review PR #456" │   │ "Can you write     │      │
│  │ [active conversation] │   │ the docs for API"  │      │
│  │                       │   │ [paused, 3 days    │      │
│  │                       │   │  ago]              │      │
│  └───────────────────────┘   └────────────────────┘      │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│                                                             │
│  Transfer learning:                                         │
│  - Learned from Martin: "PR #456 has a bug"               │
│  - Can use it with François: "Based on PR #456 learning..." │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Behaviors (from human analogy)

### 1. Individual Contexts
```
Context = Relationship / Workspace with specific topic
- Different conversations don't interfere
- Each context has its own history
- Can be active OR paused
- Can be picked up anytime
```

### 2. Selective Forgetting
```
Memory is not perfect:
- Some things fade over time (weight decay)
- Context-dependent recall
- Not everything needs to be remembered
- Focus on relevant information
```

### 3. Transfer Learning
```
Learnings cross contexts:
- Learned in Context A → useful in Context B
- Explicit memory (facts) vs implicit memory (skills)
- Can "teach" the agent new things
```

### 4. Multi-tasking / Context Switching
```
Can switch anytime:
- Drop context → pick up another
- Long-running tasks continue in background
- Can have multiple "active" contexts
```

---

## Proposed Model (Revised)

```
┌─────────────────────────────────────────────────────────────┐
│                         Agent                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Long-Term Memory (Shared across all contexts)      │   │
│  │  - Identity, Skills, Preferences                    │   │
│  │  - Important facts, Learned patterns                │   │
│  │  - Weighted by recency/relevance                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │  Context A    │  │  Context B    │  │  Context C    │   │
│  │  (PR #123)    │  │  (Slack DM)   │  │  (François)   │   │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤   │
│  │ - History     │  │ - History     │  │ - History     │   │
│  │ - State       │  │ - State       │  │ - State       │   │
│  │ - Active/Pause│  │ - Active      │  │ - Paused      │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                             │
│  Sessions exist within contexts (like message threads)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Hierarchy
```
Agent
├── Identity (name, role, persona)
├── Long-Term Memory (shared, persistent)
└── Contexts (multiple, independent)
    ├── Context A
    │   ├── Session 1 (thread)
    │   └── Session 2 (thread)
    └── Context B
        └── Session 1 (thread)
```

---

## Comparison with Previous Models

| Aspect | Flue (current) | Sessions per Agent | **Human Model** |
|--------|---------------|-------------------|-----------------|
| Sessions | 1 per agent | Multiple | **Multiple contexts** |
| Memory | Per session | Shared | **Shared + selective** |
| Forgetting | ❌ No | ❌ No | **✅ Yes** |
| Transfer | ❌ No | ❌ No | **✅ Yes** |
| Context switch | N/A | Limited | **✅ Seamless** |

---

## Implementation Implications

### 1. Memory Layer
- Need weighted memory (recency + relevance)
- Not all memory is equal
- Some things fade, others persist

### 2. Context Management
- Create/delete/pause contexts
- Each context = scoped conversation
- Contexts can be named (like Slack channels)

### 3. Session within Context
- Message threads within a context
- Can have multiple threads in same context
- Like a Slack channel with multiple conversations

### 4. Transfer Mechanism
- How does learning in Context A flow to Context B?
- Explicit memory injection
- Skill acquisition

---

## Open Questions

1. **Forgetting strategy:** How do we decide what to forget? (LRU, importance score, time decay?)

2. **Context naming:** How are contexts identified? (UUID, string name, auto-generated?)

3. **Active vs paused:** What determines if a context is active? User activity? Time?

4. **Transfer triggers:** When does learning in one context apply to another? (Explicit request? Automatic?)

---

## Resolved

- **Sandbox lifecycle:** Modern services allow pausing sandbox. Technical problem, not product.
- **Auth:** Already handled in the codebase.
- **Session persistence:** Must persist but reset capability needed.

---

## Status

✅ Human mental model adopted as guiding principle.

Next steps:
1. Define memory architecture (weighted, selective)
2. Define context lifecycle (create, pause, resume, delete)
3. Define transfer mechanism (explicit vs implicit)