# Page Architecture — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Navigation Structure

```
Products ▾          Solutions ▾          Learn ▾          Pricing    Blog    Docs
─────────────────────────────────────────────────────────────────────────────────
```

### Products Dropdown

| Product | One-Liner | URL | Status |
|---------|-----------|-----|--------|
| **Agents** | AI agents that work for you | /agents | 🔴 MVP |
| **Workflows** | Automate any process | /workflows | 🔴 MVP |
| **SDK** | Build with Nesalia anywhere | /sdk | 🔴 MVP |
| **CLI** | Control from terminal | /cli | 🔴 MVP |
| **Analytics** | Monitor agent performance | /analytics | 🟡 Future |
| **Desktop** | Native AI interface | /desktop | 🟡 Future |
| **Marty Bot** | Your AI code reviewer | /marty | 🟡 Post-MVP |
| **GitHub Action** | Trigger agents from CI/CD | /github-action | 🟡 Post-MVP |

### Solutions Dropdown

| Solution | One-Liner | URL | Status |
|----------|-----------|-----|--------|
| **GitHub Automation** | Automate code review & tasks | /solutions/github | 🟡 Future |
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
| **SDK** | /sdk | Product | TypeScript SDK |
| **CLI** | /cli | Product | Command-line tool |
| **Docs** | /docs | Resource | Documentation hub |
| **Pricing** | /pricing | Commercial | Pricing page |

### Tier 2: Post-MVP Products

| Page | URL | Type | Purpose |
|------|-----|------|---------|
| **Marty Bot** | /marty | Product | GitHub bot landing |
| **GitHub Action** | /github-action | Product | CI/CD integration |

### Tier 3: Solutions (Use Cases)

| Page | URL | Purpose |
|------|-----|---------|
| **GitHub Automation** | /solutions/github | Use case for code review & automation |
| **Software Factory** | /solutions/factory | Use case for full SDLC |
| **Workflow Automation** | /solutions/automation | Use case for business processes |

### Tier 4: Ecosystem

| Page | URL | Purpose |
|------|-----|---------|
| **DeesseJS** | /deessejs | Framework landing (OSS) |
| **Academy** | /academy | Learning platform |
| **Blog** | /blog | Content marketing |
| **Changelog** | /changelog | Product updates |

### Tier 5: Corporate

| Page | URL | Purpose |
|------|-----|---------|
| **About** | /about | Company info |
| **Careers** | /careers | Job listings |
| **Enterprise** | /enterprise | Enterprise solutions |

---

## Page Hierarchy

```
nesalia.com/
├── /                        (Homepage)
├── /agents                  (Product: Agent platform)
├── /workflows               (Product: Workflow engine)
├── /sdk                     (Product: TypeScript SDK)
├── /cli                     (Product: Command-line tool)
├── /analytics                (Product: Analytics) [Future]
├── /desktop                  (Product: Desktop app) [Future]
├── /marty                    (Product: GitHub bot)
├── /github-action            (Product: GitHub Action)
│
├── /solutions/              (Solutions: Use cases)
│   ├── /solutions/github
│   ├── /solutions/factory
│   └── /solutions/automation
│
├── /deessejs                (Ecosystem: Framework)
├── /academy                 (Ecosystem: Learning)
│
├── /docs                    (Resources: Documentation)
│   ├── /docs/getting-started
│   ├── /docs/agents
│   ├── /docs/workflows
│   └── /docs/...
│
├── /pricing                 (Commercial)
├── /blog                    (Content)
│   ├── /blog/[slug]
│   └── /blog/category/[category]
├── /changelog               (Product updates)
│
├── /about                   (Corporate) [Future]
├── /careers                 (Corporate) [Future]
└── /enterprise              (Corporate) [Future]
```

---

## Product Pages

| Product | File | Status |
|---------|------|--------|
| **Agents** | product-agents.md | ✅ Done |
| **Workflows** | product-workflows.md | ✅ Done |
| **SDK** | product-sdk.md | ✅ Done |
| **CLI** | product-cli.md | ✅ Done |
| **Marty Bot** | product-marty.md | ✅ Done |
| **GitHub Action** | product-github-action.md | ✅ Done |
| **Analytics** | product-analytics.md | 🟡 Future |
| **Desktop** | product-desktop.md | 🟡 Future |

---

## Implementation Priority

### Phase 1: MVP

1. **Homepage** — Landing page with all products overview
2. **/agents** — Detailed product page for agent platform
3. **/workflows** — Detailed product page for workflows
4. **/sdk** — Detailed product page for SDK
5. **/cli** — Detailed product page for CLI
6. **/pricing** — Pricing page
7. **/docs** — Documentation structure

### Phase 2: Growth

8. **/marty** — GitHub bot product page
9. **/github-action** — GitHub Action product page
10. **/blog** — Content marketing
11. **/changelog** — Product updates

### Phase 3: Expansion

12. **/solutions/github** — GitHub automation solution
13. **/deessejs** — Framework landing
14. **/solutions/factory** — Software factory solution

### Phase 4: Ecosystem

15. **/academy** — Learning platform
16. **/enterprise** — Enterprise solutions

---

## Next Steps

1. [x] Review navigation structure
2. [ ] Create product pages for Marty + GitHub Action
3. [ ] Design Homepage (start here)
4. [ ] Design Pricing page
5. [ ] Create solution pages