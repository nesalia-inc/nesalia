# Page Architecture — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Research Summary: What the Best Have

### Vercel Pages
| Page | URL | Purpose |
|------|-----|---------|
| Homepage | / | Main landing |
| Solutions | /solutions | Industry/customer solutions |
| AI Apps | /ai-apps | Specific use case |
| Products | /products | Product overview |
| AI SDK | /ai-sdk | Specific product |
| AI Gateway | /ai-gateway | Specific product |
| Docs | /docs | Documentation |
| Blog | /blog | Content |
| Pricing | /pricing | Pricing page |

### Supabase Pages
| Page | URL | Purpose |
|------|-----|---------|
| Homepage | / | Main landing |
| Developers | /developers | Developer-focused content |
| Docs | /docs | Documentation |
| Blog | /blog | Content |
| Pricing | /pricing | Pricing page |
| Changelog | /changelog | Product updates |

### Neon Pages
| Page | URL | Purpose |
|------|-----|---------|
| Homepage | / | Main landing |
| AI | /ai | AI-focused landing |
| Docs | /docs | Documentation |
| Blog | /blog | Content |
| Pricing | /pricing | Pricing page |

### Linear Pages
| Page | URL | Purpose |
|------|-----|---------|
| Homepage | / | Main landing |
| Agents | /agents | Agent-focused landing |
| Docs | /docs | Documentation |
| Blog | /blog | Content |
| Changelog | /changelog | Product updates |

### Midday Pages
| Page | URL | Purpose |
|------|-----|---------|
| Homepage | / | Main landing |
| Docs | /docs | Documentation |
| Blog | /blog | Content |
| Pricing | /pricing | Pricing page |

---

## Page Architecture for Nesalia

### Tier 1: Must-Have (MVP)

| Page | URL | Purpose | Priority |
|------|-----|---------|----------|
| **Homepage** | / | Main landing | 🔴 Critical |
| **Agents** | /agents | Agent platform landing | 🔴 Critical |
| **Workflows** | /workflows | Workflow engine landing | 🔴 Critical |
| **Docs** | /docs | Documentation | 🔴 Critical |
| **Pricing** | /pricing | Pricing page | 🔴 Critical |

### Tier 2: Important (Post-MVP)

| Page | URL | Purpose | Priority |
|------|-----|---------|----------|
| **Marty Bot** | /marty | GitHub bot landing | 🟡 Important |
| **SDK / CLI** | /sdk | Developer tools landing | 🟡 Important |
| **DeesseJS** | /deessejs | Framework landing | 🟡 Important |
| **Academy** | /academy | Learning platform | 🟡 Important |
| **Blog** | /blog | Content marketing | 🟡 Important |
| **Changelog** | /changelog | Product updates | 🟡 Important |

### Tier 3: Nice-to-Have (Future)

| Page | URL | Purpose | Priority |
|------|-----|---------|----------|
| **Use Cases** | /use-cases | Industry solutions | 🟢 Nice |
| **Integrations** | /integrations | Third-party integrations | 🟢 Nice |
| **Enterprise** | /enterprise | Enterprise solutions | 🟢 Nice |
| **Fresh** | /fresh | Knowledge engine | 🟢 Nice |
| **About** | /about | Company info | 🟢 Nice |
| **Careers** | /careers | Job listings | 🟢 Nice |

---

## Page Structure Breakdown

### 1. Homepage (/)

**Purpose:** First impression, mission statement, key features

**Content:**
- Hero: Mission headline + CTAs
- Social proof: Stats + testimonials
- Features: 3 columns (Agents, Workflows, Triggers)
- Products: Ecosystem overview
- How it works: 4-step process
- CTA: Final push
- Footer

**Competitors参考:** Vercel, Supabase, Neon

---

### 2. Agents (/agents)

**Purpose:** Deep dive on the agent platform

**Content:**
- Hero: "AI agents that work for you"
- What are agents: Explanation + visual
- Features: Memory, contexts, sandbox isolation
- Code example: Create + invoke agent
- Use cases: Code review, documentation, etc.
- Integrations: GitHub, CLI, SDK
- CTA: "Start building agents"

**Competitors参考:** Linear /agents, Neon /ai

---

### 3. Workflows (/workflows)

**Purpose:** Deep dive on workflow automation

**Content:**
- Hero: "Automate any process"
- What are workflows: Explanation + visual
- Features: Agent tasks, conditions, human-in-the-loop
- Code example: Define + trigger workflow
- Use cases: CI/CD, content creation, etc.
- Integrations: Webhooks, external services
- CTA: "Start automating"

**Competitors参考:** Vercel Workflow, n8n

---

### 4. Marty Bot (/marty)

**Purpose:** GitHub bot landing page

**Content:**
- Hero: "Your AI code reviewer"
- Features: PR review, issue triage, commands
- Code example: @marty review command
- Setup: Installation steps
- Commands: List of available commands
- CTA: "Add to GitHub"

**Competitors参考:** CodeRabbit, GitHub Copilot

---

### 5. SDK / CLI (/sdk)

**Purpose:** Developer tools landing

**Content:**
- Hero: "Build with Nesalia"
- Quick start: `npm install @nesalia/sdk`
- Code examples: Agent invoke, streaming, workflows
- CLI reference: Key commands
- API reference: Link to docs
- CTA: "Read the docs"

**Competitors参考:** Supabase /developers, Vercel /ai-sdk

---

### 6. DeesseJS (/deessejs)

**Purpose:** Framework landing page

**Content:**
- Hero: "The Laravel for TypeScript"
- Packages: List of packages with descriptions
- Quick start: `npm create deesse@latest`
- Code examples: Collections, RPC, Admin
- Philosophy: Modular, OSS, own your code
- CTA: "View packages"

**Competitors参考:** N/A (unique positioning)

---

### 7. Academy (/academy)

**Purpose:** Learning platform landing

**Content:**
- Hero: "Learn to build with AI agents"
- Courses: List of courses
- Challenges: Practice challenges
- Certifications: Get certified
- Pricing: Free vs Paid tiers
- CTA: "Start learning"

**Competitors参考:** Codecademy, LeetCode

---

### 8. Docs (/docs)

**Purpose:** Documentation hub

**Content:**
- Quick start: Get started in 5 minutes
- Guides: Step-by-step tutorials
- API reference: Full API documentation
- Concepts: Core concepts explained
- Examples: Code examples
- Integrations: How to connect external services

**Competitors参考:** Supabase /docs, Neon /docs, Linear /docs

---

### 9. Pricing (/pricing)

**Purpose:** Pricing information

**Content:**
- Hero: "Simple, transparent pricing"
- Tiers: Free, Starter, Pro, Enterprise
- Comparison table: What's included in each tier
- FAQ: Common questions
- Calculator: Usage-based calculator (future)
- CTA: "Start free" or "Contact sales"

**Competitors参考:** Vercel /pricing, Supabase /pricing, Neon /pricing

---

### 10. Blog (/blog)

**Purpose:** Content marketing

**Content:**
- Categories: Product updates, tutorials, use cases
- Featured: Latest posts
- Newsletter: Subscribe CTA
- Authors: Team members

**Competitors参考:** All competitors have blogs

---

### 11. Changelog (/changelog)

**Purpose:** Product updates

**Content:**
- Timeline: Chronological updates
- Categories: New features, improvements, fixes
- Versioning: Semantic versioning

**Competitors参考:** Linear /changelog, Supabase /changelog

---

## Page Hierarchy

```
nesalia.com/
├── /                    (Homepage)
├── /agents              (Agent platform)
├── /workflows           (Workflow engine)
├── /marty               (GitHub bot)
├── /sdk                 (Developer tools)
├── /deessejs            (Framework)
├── /academy             (Learning platform)
├── /docs                (Documentation)
│   ├── /docs/getting-started
│   ├── /docs/agents
│   ├── /docs/workflows
│   ├── /docs/api
│   └── /docs/...
├── /pricing             (Pricing)
├── /blog                (Blog)
│   ├── /blog/[slug]
│   └── /blog/category/[category]
├── /changelog           (Product updates)
├── /use-cases           (Use cases) [Future]
├── /integrations        (Integrations) [Future]
├── /enterprise          (Enterprise) [Future]
├── /about               (About) [Future]
└── /careers             (Careers) [Future]
```

---

## Content Structure Patterns

### Landing Page Pattern

```
1. Hero
   - Headline (mission or product)
   - Subheadline (what it does)
   - CTAs (primary + secondary)

2. Social Proof
   - Stats (numbers)
   - Testimonials (quotes)
   - Logos (companies)

3. Features (3 columns)
   - Icon + Title
   - Short description
   - Visual/code example

4. How It Works
   - 3-4 steps
   - Visual + text

5. Products/Ecosystem
   - Main product (prominent)
   - Secondary products (links)

6. CTA
   - Headline
   - Primary CTA
   - Secondary CTA

7. Footer
   - Links organized by category
   - Social links
   - Legal
```

### Documentation Pattern

```
1. Sidebar Navigation
   - Getting Started
   - Guides
   - API Reference
   - Concepts
   - Examples

2. Content Area
   - Title
   - Description
   - Code examples
   - Step-by-step instructions
   - Related links

3. On-page Navigation
   - Table of contents
   - Previous/Next links
```

---

## Design System Requirements

### Global Elements

| Element | Specification |
|---------|---------------|
| **Navigation** | Sticky, transparent → solid on scroll |
| **Footer** | 5-6 columns + bottom bar |
| **Dark mode** | Default (similar to Linear/Neon) |
| **Colors** | Purple/blue accents |
| **Typography** | Inter or similar sans-serif |
| **Icons** | Minimal outlined (Lucide/Phosphor) |

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column |
| Tablet | 640-1024px | 2 columns |
| Desktop | > 1024px | Full layout |

---

## Implementation Priority

### Phase 1: MVP (Build these first)

1. **Homepage** — Everything starts here
2. **Docs** — Developers need this
3. **Pricing** — Need to convert
4. **Agents** — Core product
5. **Workflows** — Core product

### Phase 2: Growth (Build after MVP)

6. **Marty Bot** — Key differentiator
7. **SDK / CLI** — Developer experience
8. **Blog** — Content marketing
9. **Changelog** — Community engagement

### Phase 3: Expansion (Future)

10. **DeesseJS** — Framework landing
11. **Academy** — Learning platform
12. **Use Cases** — Industry solutions
13. **Enterprise** — Sales enablement

---

## Next Steps

1. [ ] Approve page architecture
2. [ ] Prioritize Phase 1 pages
3. [ ] Design Homepage (start here)
4. [ ] Design Docs structure
5. [ ] Design Pricing page
6. [ ] Implement and iterate