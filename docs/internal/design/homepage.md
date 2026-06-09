# Homepage Design — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Research: What the Best Do

### Vercel, Supabase, Neon, Linear, Midday — Common Patterns

---

## Section 1: Hero

### Pattern from Research

| Company | Headline Style |
|---------|----------------|
| **Vercel** | Mission + Product ("Build and deploy on the AI Cloud") |
| **Supabase** | Benefit + Proof ("Build in a weekend. Scale to millions.") |
| **Neon** | Product + Audience ("Ship faster on the backend platform for apps and agents") |
| **Linear** | System + AI-era ("The product development system for teams and agents") |
| **Midday** | Audience + Benefit ("The business stack for modern founders") |

### Key Insights

1. **Clear value proposition in 1 line** — No jargon, immediate understanding
2. **Include the audience** — "for teams", "for modern founders", "for apps and agents"
3. **Mission-driven OR product-focused** — Both work, depends on brand personality
4. **Social proof nearby** — Stats immediately after hero

---

### Recommended Headline

**Option A (Mission-driven):**
```
Make software development a commodity.
```

**Option B (Product + Audience):**
```
Modern agent infrastructure for developers.
```

**Option C (System + AI-era):**
```
The agent platform for the AI engineering era.
```

**Recommended: Option A** — Mission-driven, memorable, unique.

---

### Subheadline Pattern

```
[What it is] + [What it does] + [How it works]

Examples:
• "Deploy, scale, and manage AI agents without managing infrastructure."
• "Build agents. Automate workflows. Trigger from anywhere."
• "Create agents with personalities. Deploy them anywhere. Scale infinitely."
```

---

### CTAs

| Company | Primary CTA | Secondary CTA |
|---------|-------------|----------------|
| Vercel | "Deploy" | "Get a Demo" |
| Supabase | "Start your project" | "Documentation" |
| Neon | "Get started" | "Read the docs" |
| Linear | "Get started" | "Request a demo" |
| Midday | "14-day free trial" | "Learn more" |

**Recommended:**
- Primary: "Get Started" or "Start Building"
- Secondary: "Read the docs"

---

## Section 2: Social Proof

### Pattern from Research

| Company | Stats Placement |
|---------|----------------|
| **Vercel** | Right after hero, testimonial nearby |
| **Supabase** | Embedded in hero ("Build in a weekend. Scale to millions.") |
| **Neon** | Bottom section with logos + "Trusted by the best" |
| **Linear** | Testimonials from named companies (OpenAI, Ramp) |
| **Midday** | Time saved stats ("4-6 hours per week") |

### Key Insights

1. **Stats should be specific** — "4-6 hours saved" > "Faster"
2. **Named testimonials > generic** — "From OpenAI engineering team" > "From a developer"
3. **Company logos add credibility** — Even pre-launch, can show "Backed by" or "Built by"

---

### Recommended Stats

```
• [X,XXX] agents deployed
• [X,XXX] workflows automated
• [X,XXX] developers building
```

### Recommended Testimonial Format

```
"[Specific benefit/result]"

— [Name], [Role] at [Company]

Example:
"Nesalia transformed how we handle code reviews.
Marty reviews every PR automatically, and I just approve."

— [Name], Engineering Lead at [Company]
```

---

## Section 3: Features

### Pattern from Research

| Company | Features Layout |
|---------|-----------------|
| **Vercel** | 3-column grid with icons + short descriptions |
| **Supabase** | Products list with descriptions |
| **Neon** | 3 featured features with visual + explanation |
| **Linear** | Feature cards with product preview screenshots |
| **Midday** | Process flow ("How it works") + features below |

### Key Insights

1. **3 features max** — Don't overwhelm, pick the most important
2. **Icon + short title + description** — Easy to scan
3. **Include a code example** — Developers want to see code
4. **Visual + text** — Show, don't just tell

---

### Recommended Features (3 columns)

#### Column 1: Agents as Individuals
```
Icon: Bot/User

Your agents have memory.

They remember. They learn.
They switch contexts seamlessly.

Like having a team member
who never forgets.
```

#### Column 2: Workflow Automation
```
Icon: Flowchart

Automate any process.

Build workflows with:
• Agent tasks
• Conditions
• Human-in-the-loop
• External integrations

Like n8n, but agent-centric.
```

#### Column 3: Trigger from Anywhere
```
Icon: Webhook/Integration

Your entire stack, connected.

• GitHub Actions
• GitHub Bot
• CLI
• SDK
• Webhook
• Mobile

HTTP API is the universal interface.
```

---

### Code Example Pattern

| Company | Code Example Style |
|---------|-------------------|
| Vercel | AI SDK usage with streaming |
| Supabase | Database schema + API call |
| Neon | CLI command + SQL query |
| Linear | Code diff for PR review |

**Recommended for Nesalia:**
```typescript
import { createClient } from '@nesalia/sdk';

const client = createClient({ apiKey: process.env.NESALIA_API_KEY });

// Create an agent
const agent = await client.agents.create({
  name: 'code-reviewer',
  model: 'anthropic/claude-sonnet-4-6',
  instructions: 'You are a code reviewer...',
});

// Invoke with streaming
for await (const chunk of client.agents.stream(agent.id, {
  prompt: 'Review PR #123',
})) {
  console.log(chunk.text);
}
```

---

## Section 4: Products (Ecosystem)

### Pattern from Research

| Company | Products Section |
|---------|-----------------|
| Vercel | Products grid with icons + brief descriptions |
| Supabase | Products list with detailed descriptions |
| Neon | Products + features side by side |
| Linear | Feature cards with tabs/navigation |

### Key Insights

1. **Show the ecosystem** — Not just one product
2. **Clear hierarchy** — Main product prominent, others secondary
3. **Links to each product** — "Learn more" for each

---

### Recommended Products Section

#### Nesalia (Main)
```
The Platform

Deploy, scale, manage agents.

→ Explore Nesalia
→ See pricing
```

#### DeesseJS (Secondary)
```
The Framework

The Laravel for TypeScript.

OSS packages for:
• Collections
• RPC
• Admin
• And more...

→ View packages
→ Read documentation
```

#### Académie (Secondary)
```
The Learning Platform

Learn. Practice. Certify.

"Codecademy for AI developers"
Courses • Challenges • Certifications

→ Browse courses
→ Start for free
```

---

## Section 5: How It Works

### Pattern from Research

| Company | How It Works Style |
|---------|-------------------|
| Vercel | Framework-defined infrastructure diagram |
| Supabase | Product features list |
| Neon | 3-step process with visual |
| Linear | Feature cards with preview |
| Midday | "How it works" with screenshots |

### Key Insights

1. **3-4 steps max** — Keep it simple
2. **Visual + text** — Show the process
3. **Terminal/code when relevant** — Developers like seeing commands

---

### Recommended How It Works

```
1. Create an agent
   Define role, model, tools, sandbox.
   Connect your own LLM provider.

2. Build workflows
   Chain agent tasks with conditions.
   Add human approval gates.
   Connect external services.

3. Trigger from anywhere
   GitHub Actions. CLI. SDK. Webhook.
   Your entire stack, integrated.

4. Scale automatically
   We handle the infrastructure.
   You focus on what you build.
```

---

## Section 6: CTA

### Pattern from Research

| Company | CTA Style |
|---------|-----------|
| Vercel | Two CTAs: "Start Deploying" + "Get a Demo" |
| Supabase | "Start your project" + "Documentation" |
| Neon | "Get started" + "Read the docs" |
| Linear | "Get started" + "Request a demo" |
| Midday | "14-day free trial" (emphasized) |

### Key Insights

1. **Clear action** — "Get started", "Start building"
2. **Secondary option** — Demo for enterprise, docs for devs
3. **Benefit in CTA** — "Start deploying" > "Submit"

---

### Recommended CTA

```
Headline: "Ready to automate with AI agents?"

Primary CTA: "Get Started Free"
Secondary CTA: "Read the docs"
```

---

## Section 7: Footer

### Pattern from Research

| Company | Footer Structure |
|---------|-----------------|
| Vercel | Products, Resources, Company, Legal + Community |
| Supabase | Quick links + Community + Legal |
| Neon | Products, Resources, Company + Social |
| Linear | Product, Developers, Company + Legal |
| Midday | Products, Company, Legal + Social |

### Key Insights

1. **Organize by category** — Products, Learn, Company, Legal
2. **Include social links** — GitHub, Twitter/X, LinkedIn
3. **Consistent across pages** — Don't change footer structure

---

### Recommended Footer

#### Products
- Agents
- Workflows
- Marty Bot
- SDK / CLI
- GitHub Action

#### DeesseJS
- Errors
- DRPC
- Collections
- FP (Functional Programming)
- Admin
- Cloud

#### Learn
- Documentation
- Blog
- Changelog
- Academy
- Community

#### Use Cases
- Autonomous Agents
- Workflows
- GitHub Bot
- Content Creation

#### Company
- About
- Help
- Legal
- Privacy Policy

#### Community
- Open Source Program
- Students
- GitHub
- LinkedIn
- X

#### Bottom
```
© 2026 Nesalia Inc. All rights reserved.
```

---

## Visual Design Notes

### Colors

| Company | Color Scheme |
|---------|--------------|
| Vercel | Black/white with green accents |
| Supabase | White with subtle gradients, green/purple |
| Neon | Dark mode default, purple/blue accents |
| Linear | Dark mode, purple accents |
| Midday | Light mode, warm colors |

**Recommendation:** Dark mode with purple/blue accents (similar to Linear/Neon — fits AI developer audience)

### Typography

| Company | Font Style |
|---------|------------|
| Vercel | Inter (sans-serif) |
| Supabase | Inter or system fonts |
| Neon | Inter or similar |
| Linear | Inter or similar |
| Midday | Inter or similar |

**Recommendation:** Inter or similar modern sans-serif

### Icons

| Company | Icon Style |
|---------|------------|
| Vercel | Minimal, outlined |
| Supabase | Consistent set, outlined |
| Neon | Minimal, filled |
| Linear | Minimal, outlined |
| Midday | Minimal, outlined |

**Recommendation:** Minimal outlined icons (Lucide, Phosphor, or custom)

---

## Homepage Structure (Final)

1. **Navigation** — Products, Learn, Use Cases, Pricing, Blog
2. **Hero** — Mission headline + subheadline + CTAs
3. **Social Proof** — Stats + Testimonials
4. **Features** — 3 columns (Agents, Workflows, Triggers) + Code example
5. **Products** — Ecosystem (Nesalia, DeesseJS, Académie)
6. **How It Works** — 4-step process
7. **CTA** — Final push
8. **Footer** — Links + Legal

---

## A/B Testing Ideas

### Hero Headline Test

**A:** "Make software development a commodity"
**B:** "Modern agent infrastructure for developers"
**C:** "The agent platform for the AI engineering era"

### CTA Test

**A:** "Get Started Free"
**B:** "Start Building"
**C:** "Try for free"

### Visual Test

**A:** Code snippet in hero
**B:** Animated agent diagram
**C:** Product showcase (Marty bot in action)

---

## Next Steps

1. [ ] Finalize copy with stakeholders
2. [ ] Design visual mockups (dark mode + purple accents)
3. [ ] A/B test headline variations
4. [ ] Implement landing page
5. [ ] Add analytics (conversion tracking)