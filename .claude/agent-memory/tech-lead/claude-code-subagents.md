---
name: claude-code-subagents
description: Claude Code subagents concepts - spawning, isolation, parallelization, tool restrictions
type: reference
---

# Claude Code Subagents — Reference

## What is a Subagent?

A subagent is a separate agent instance that the main agent can "spawn" to handle focused subtasks. Each subagent has:
- Its own context (fresh conversation)
- Its own system prompt
- Restricted or full tools

## 3 Ways to Create Subagents

| Method | When to use |
|--------|-------------|
| **Programmatic** (SDK) | Dynamically define agents in code |
| **Filesystem-based** (`.claude/agents/`) | Persistent agents in project |
| **Built-in** (`general-purpose`) | Auto-delegation without config |

## Benefits

| Benefit | Description |
|---------|-------------|
| **Context isolation** | Each subagent has its own context — tool calls don't accumulate in parent |
| **Parallelization** | Multiple subagents can run simultaneously |
| **Specialized instructions** | Each subagent can have its own expertise |
| **Tool restrictions** | Limit tools (e.g., read-only for a reviewer) |

## AgentDefinition Fields

```typescript
{
  description: string,       // "Expert code review specialist"
  prompt: string,           // Subagent's system prompt
  tools?: string[],        // Allowed tools (or all if omitted)
  model?: string,          // "opus", "sonnet", "haiku", "fable"
  skills?: string[],       // Skills to preload
  maxTurns?: number,       // Max turns before stop
  background?: boolean,     // Non-blocking mode
  effort?: 'low'|'medium'|'high'|'xhigh'|'max',
  mcpServers?: (string|object)[],
  initialPrompt?: string,
  permissionMode?: PermissionMode,
}
```

## TypeScript Example

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Review this codebase",
  options: {
    allowedTools: ["Read", "Grep", "Glob", "Agent"],
    agents: {
      "code-reviewer": {
        description: "Expert code review specialist",
        prompt: "You are a code review expert...",
        tools: ["Read", "Grep", "Glob"], // read-only
      },
      "test-runner": {
        description: "Runs test suites",
        prompt: "Run tests and analyze results...",
        tools: ["Bash", "Read", "Grep"],
        model: "sonnet"
      }
    }
  }
})) {
  if ("result" in message) console.log(message.result);
}
```

## What Subagents RECEIVE vs DON'T RECEIVE

| Receives ✅ | Doesn't receive ❌ |
|-------------|-------------------|
| Its own prompt + system prompt | Parent conversation history |
| Project CLAUDE.md | Preloaded skill content (unless listed) |
| Tool definitions | Parent system prompt |
| Tools listed in `tools` array | Parent tool call history |

## Common Tool Combinations

| Use case | Tools |
|----------|-------|
| Read-only analysis | `Read`, `Grep`, `Glob` |
| Test execution | `Bash`, `Read`, `Grep` |
| Code modification | `Read`, `Edit`, `Write`, `Grep`, `Glob` |
| Full access | All tools (omit `tools` field) |

## Subagents vs Workflows

| Aspect | Subagents | Workflows |
|--------|-----------|-----------|
| Usage | Few delegated tasks | Dozens to hundreds of agents |
| Orchestration | Turn-by-turn via Agent tool | External script executed by runtime |
| Complexity | Simple | High |

## Key Points

1. **Tool name**: Changed from `"Task"` to `"Agent"` in v2.1.63
2. **Resume capability**: Subagents can be resumed with session_id + agentId
3. **Nested subagents**: Up to 5 levels deep (background), unlimited (foreground)
4. **Windows limit**: Long prompts may fail due to 8191 char command line limit
5. **Filesystem agents**: Loaded at startup only — restart to pick up new files

## Source

[Claude Code SDK Docs](https://code.claude.com/docs/en/agent-sdk/subagents)
