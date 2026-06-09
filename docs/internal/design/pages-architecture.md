# Page Architecture — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Vercel Pattern Analysis

Vercel organizes their navigation into clear categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Products** | Infrastructure capabilities | AI Gateway, Sandbox, Agent, SDK, Workflow |
| **Solutions** | Customer use cases | AI Apps, Commerce, Marketing, Web Apps |
| **Resources** | Learning + ecosystem | Docs, Blog, Academy, Integrations |
| **Pricing** | Commercial | Pricing page |

### Key Insight: Products ≠ Solutions

- **Products** = What the platform provides (infrastructure)
- **Solutions** = How customers use it (use cases)

---

## Navigation Structure for Nesalia

### Header Nav

```
Products ▾          Solutions ▾          Learn ▾          Pricing    Blog    Docs
─────────────────────────────────────────────────────────────────────────────────
```

### Products Dropdown

| Product | One-Liner | URL | Status |
|---------|-----------|-----|--------|
| **Agents** | AI agents that work for you | /agents | 🔴 MVP |
| **Workflows** | Automate any process | /workflows | 🔴 MVP |
| **LLM Gateway** | One endpoint, all your models | /llm-gateway | 🟡 Future |
| **Sandbox** | Isolated, safe code execution | /sandbox | 🟡 Future |
| **SDK / CLI** | Build with Nesalia | /sdk | 🔴 MVP |
| **Marty Bot** | Your AI code reviewer | /marty | 🟡 Post-MVP |
| **GitHub Action** | Trigger agents from CI/CD | /github-action | 🟡 Post-MVP |
| **Fluid Compute** | Servers in serverless form | /fluid | 🟢 Future |

### Solutions Dropdown

| Solution | One-Liner | URL | Status |
|----------|-----------|-----|--------|
| **Autonomous Agents** | Agents that work 24/7 | /solutions/autonomous-agents | 🟡 Future |
| **GitHub Automation** | Automate code review & tasks | /solutions/github | 🟡 Future |
| **Content Creation** | Automated content pipelines | /solutions/content | 🟢 Future |
| **Software Factory** | Full SDLC with AI | /solutions/factory | 🟢 Future |
| **Workflow Automation** | Business process automation | /solutions/automation | 🟢 Future |

### Learn Dropdown

| Resource | URL | Status |
|----------|-----|--------|
| **Documentation** | /docs | 🔴 MVP |
| **Blog** | /blog | 🟡 Post-MVP |
| **Changelog** | /changelog | 🟡 Post-MVP |
| **Academy** | /academy | 🟢 Future |
| **DeesseJS** | /deessejs | 🟡 Post-MVP |

---

## Page Architecture by Tier

### Tier 1: MVP (Build first)

| Page | URL | Type | Purpose |
|------|-----|------|---------|
| **Homepage** | / | Landing | Main landing + mission |
| **Agents** | /agents | Product | Agent platform deep-dive |
| **Workflows** | /workflows | Product | Workflow engine deep-dive |
| **Docs** | /docs | Resource | Documentation hub |
| **Pricing** | /pricing | Commercial | Pricing page |

### Tier 2: Post-MVP Products

| Page | URL | Type | Purpose |
|------|-----|------|---------|
| **SDK / CLI** | /sdk | Product | Developer tools landing |
| **Marty Bot** | /marty | Product | GitHub bot landing |
| **GitHub Action** | /github-action | Product | CI/CD integration |

### Tier 3: Future Products

| Page | URL | Type | Purpose |
|------|-----|------|---------|
| **LLM Gateway** | /llm-gateway | Product | Multi-provider routing |
| **Sandbox** | /sandbox | Product | Isolated code execution |
| **Fluid Compute** | /fluid | Product | Serverless-like compute |

### Tier 4: Solutions (Use Cases)

| Page | URL | Purpose |
|------|-----|---------|
| **Autonomous Agents** | /solutions/autonomous-agents | Use case for autonomous agents |
| **GitHub Automation** | /solutions/github | Use case for code review & automation |
| **Content Creation** | /solutions/content | Use case for content pipelines |
| **Software Factory** | /solutions/factory | Use case for full SDLC |

### Tier 5: Ecosystem

| Page | URL | Purpose |
|------|-----|---------|
| **DeesseJS** | /deessejs | Framework landing (OSS) |
| **Academy** | /academy | Learning platform |
| **Blog** | /blog | Content marketing |
| **Changelog** | /changelog | Product updates |

### Tier 6: Corporate

| Page | URL | Purpose |
|------|-----|---------|
| **About** | /about | Company info |
| **Careers** | /careers | Job listings |
| **Enterprise** | /enterprise | Enterprise solutions |
| **Integrations** | /integrations | Third-party integrations |

---

## Page Hierarchy

```
nesalia.com/
├── /                        (Homepage)
├── /agents                   (Product: Agent platform)
├── /workflows                 (Product: Workflow engine)
├── /sdk                      (Product: SDK / CLI)
├── /marty                    (Product: GitHub bot)
├── /github-action            (Product: GitHub Action)
├── /llm-gateway              (Product: LLM gateway) [Future]
├── /sandbox                  (Product: Sandbox) [Future]
├── /fluid                    (Product: Fluid compute) [Future]
│
├── /solutions/               (Solutions: Use cases)
│   ├── /solutions/autonomous-agents
│   ├── /solutions/github
│   ├── /solutions/content
│   └── /solutions/factory
│
├── /deessejs                 (Ecosystem: Framework)
├── /academy                  (Ecosystem: Learning)
│
├── /docs                     (Resources: Documentation)
│   ├── /docs/getting-started
│   ├── /docs/agents
│   ├── /docs/workflows
│   └── /docs/...
│
├── /pricing                  (Commercial)
├── /blog                     (Content)
│   ├── /blog/[slug]
│   └── /blog/category/[category]
├── /changelog               (Product updates)
│
├── /about                    (Corporate) [Future]
├── /careers                  (Corporate) [Future]
├── /enterprise               (Corporate) [Future]
└── /integrations             (Corporate) [Future]
```

---

## Product Page Template

Each product page follows Vercel's pattern:

### Structure

```
1. Hero
   - Headline (product name + benefit)
   - One-liner description
   - CTAs (Get Started + Read Docs)

2. What it is
   - Explanation paragraph
   - Key value proposition

3. Features (3-4 columns)
   - Icon + Title
   - Short description
   - Code example or visual

4. How it works
   - Step-by-step with visuals
   - Code example

5. Integrations
   - How it connects to other products
   - Ecosystem diagram

6. Use cases
   - Real-world examples
   - Customer quotes (when available)

7. FAQ
   - Common questions
   - Technical details

8. CTA
   - Final push
   - Alternative: Demo for enterprise
```

### Product Pages to Create

| Product | Status | Priority |
|---------|--------|----------|
| **Agents** | Existing spec | 🔴 High |
| **Workflows** | Existing spec | 🔴 High |
| **SDK / CLI** | Existing spec | 🔴 High |
| **Marty Bot** | Existing spec | 🟡 Medium |
| **LLM Gateway** | New spec needed | 🟡 Medium |
| **Sandbox** | New spec needed | 🟢 Low |
| **Fluid Compute** | New spec needed | 🟢 Low |
| **GitHub Action** | New spec needed | 🟡 Medium |

---

## Solution Page Template

Solutions are customer-centric, showing use cases:

### Structure

```
1. Hero
   - Industry/use case headline
   - "Built for [audience]"
   - Primary CTA

2. Problem
   - What's the pain point?
   - Why is it hard?

3. Solution
   - How Nesalia solves it
   - Step-by-step flow

4. Features for this use case
   - What's relevant
   - Code examples

5. Customer story
   - Quote
   - Results (metrics)

6. Templates / Starters
   - Pre-built examples
   - One-click deploy

7. Related products
   - Connect to products
   - Show ecosystem

8. CTA
   - Get started or Demo
```

---

## Implementation Priority

### Phase 1: Core (This sprint)

1. **Homepage** — Landing page with all products overview
2. **/agents** — Detailed product page for agent platform
3. **/workflows** — Detailed product page for workflows
4. **/sdk** — Detailed product page for SDK/CLI
5. **/pricing** — Pricing page

### Phase 2: Growth (Next sprint)

6. **/marty** — GitHub bot product page
7. **/github-action** — GitHub Action product page
8. **/solutions/github** — GitHub automation solution
9. **/blog** — Content marketing
10. **/changelog** — Product updates

### Phase 3: Expansion (Future)

11. **/solutions/autonomous-agents** — Autonomous agents solution
12. **/solutions/factory** — Software factory solution
13. **/llm-gateway** — LLM gateway product
14. **/sandbox** — Sandbox product

### Phase 4: Ecosystem

15. **/deessejs** — Framework landing
16. **/academy** — Learning platform
17. **/enterprise** — Enterprise solutions

---

## Next Steps

1. [ ] Review and approve navigation structure
2. [ ] Prioritize Phase 1 product pages
3. [ ] Design /agents page (start here)
4. [ ] Design /workflows page
5. [ ] Design /sdk page
6. [ ] Create /solutions structure