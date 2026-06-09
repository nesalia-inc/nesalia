# Analytics — nesalia.com/analytics

> **Status:** Future
> **Last Updated:** 2026-06-09

---

## Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ANALYTICS                                                     │
│                                                                 │
│   Understand how your agents perform.                           │
│                                                                 │
│   Track usage, costs, latency, and quality.                     │
│   Get insights to optimize your agents.                         │
│                                                                 │
│   [Get Started]  [Read the Docs]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Headline:** Understand how your agents perform.

**Subheadline:**
```
Track usage, costs, latency, and quality.
Get insights to optimize your agents.
```

**CTAs:**
- Primary: Get Started
- Secondary: Read the Docs

---

## What is Analytics?

Analytics provides **visibility** into your agent and workflow performance.

### Key Benefits

- **Usage tracking** — See who's using what
- **Cost optimization** — Understand spending
- **Performance metrics** — Latency, success rates
- **Quality insights** — Output quality over time

---

## Features

### 1. Usage Dashboard

See all agent activity at a glance.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   This Month                                                   │
│   ─────────────                                               │
│   Agents:        12                                           │
│   Invocations:   45,231                                        │
│   Tokens:        12.4M                                         │
│   Cost:          $47.82                                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐ │
│   │                                                          │ │
│   │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                         │ │
│   │                                                          │ │
│   └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│   Usage over time                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Per-Agent Metrics

Dive into individual agent performance.

```typescript
// Agent metrics
{
  agent: 'code-reviewer',
  period: '7d',

  invocations: 342,
  successRate: 98.5%,

  latency: {
    p50: 2.1s,
    p95: 5.8s,
    p99: 12.3s
  },

  cost: {
    total: '$12.45',
    perInvocation: '$0.036'
  },

  quality: {
    thumbsUp: 89%,
    thumbsDown: 11%
  }
}
```

### 3. Cost Attribution

Understand where your money goes.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Cost by Agent                                                 │
│   ─────────────                                                 │
│   code-reviewer     ████████████████████  $24.50 (51%)          │
│   tech-writer       ████████████        $12.30 (26%)          │
│   support-agent     ████████            $8.20 (17%)           │
│   data-analyst      ████                $2.82 (6%)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Latency Tracking

Monitor response times.

```typescript
// Latency by time of day
{
  morning: { avg: 1.8s, p95: 3.2s },
  afternoon: { avg: 2.1s, p95: 4.1s },
  evening: { avg: 1.9s, p95: 3.5s },
  night: { avg: 1.5s, p95: 2.8s }
}
```

### 5. Error Analysis

Understand failures.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Errors (Last 7 Days)                                          │
│   ───────────────────                                           │
│   Rate limit          ████████████████  45%                   │
│   Timeout             ████████████      30%                   │
│   Invalid prompt      ██████            15%                   │
│   Model unavailable   ████              10%                   │
│                                                                 │
│   Top Error: "Rate limit exceeded"                              │
│   Affected agents: support-agent, data-analyst                  │
│   Suggestion: Add retry logic or scale plan                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Custom Dashboards

Build your own views.

```typescript
// Custom dashboard config
const dashboard = await client.analytics.createDashboard({
  name: 'Team Dashboard',
  widgets: [
    { type: 'metric', metric: 'total_invocations' },
    { type: 'chart', chart: 'usage_over_time' },
    { type: 'table', query: 'top_agents_by_cost' },
    { type: 'alert', condition: 'error_rate > 5%' }
  ]
});
```

---

## Metrics Tracked

### Agent Metrics

| Metric | Description |
|--------|-------------|
| **Invocations** | Number of agent calls |
| **Success rate** | % of successful calls |
| **Latency p50/p95/p99** | Response time percentiles |
| **Token usage** | Input + output tokens |
| **Cost** | Calculated from tokens |
| **Context switches** | Context changes |

### Workflow Metrics

| Metric | Description |
|--------|-------------|
| **Runs** | Total workflow executions |
| **Duration** | Average run time |
| **Step success** | Per-step success rates |
| **Human approvals** | Approval gate stats |
| **Retries** | Automatic retry counts |

### System Metrics

| Metric | Description |
|--------|-------------|
| **Uptime** | Service availability |
| **Error rate** | API error percentage |
| **Rate limits** | Limit utilization |
| **Queue depth** | Pending requests |

---

## Integrations

### Data Export

```typescript
// Export to CSV
const csv = await client.analytics.export({
  format: 'csv',
  metrics: ['invocations', 'cost', 'latency'],
  period: '30d'
});

// Export to JSON
const json = await client.analytics.export({
  format: 'json',
  metrics: ['*']
});

// Webhook to external systems
await client.analytics.webhooks.create({
  url: 'https://my-dashboard.com/webhook',
  events: ['error', 'budget_alert']
});
```

### Connected Tools

| Tool | Integration |
|------|-------------|
| **Datadog** | Metrics export |
| **Grafana** | Dashboard import |
| **Slack** | Alert notifications |
| **PagerDuty** | Incident alerts |
| **Google Sheets** | Data sync |

---

## Pricing

Included in all plans:
- **Free**: Basic metrics, 7-day retention
- **Pro**: Full metrics, 90-day retention, custom dashboards
- **Enterprise**: Unlimited retention, SSO, audit logs

---

## FAQ

**What data is tracked?**

We track: invocations, latency, token usage, cost, errors, and context switches. We do NOT track the content of prompts or responses.

**How long is data retained?**

Free: 7 days. Pro: 90 days. Enterprise: Unlimited.

**Can I export data?**

Yes. Export to CSV, JSON, or stream to external systems via webhooks.

**Is analytics enabled by default?**

Yes. All usage is tracked automatically.

---

## CTA

**Headline:** See how your agents are performing.

- Primary CTA: Get Started
- Secondary CTA: Read the Docs