# Design System — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Overview

Using **shadcn/ui** components with theme-based colors:
- Colors via **CSS variables** (theme system)
- **No hardcoded colors** — use semantic tokens
- Components from shadcn/ui library
- Tailwind utility classes for layout

---

## shadcn/ui Setup

### Theme Configuration

```json
// components.json
{
  "style": "default",
  "rounded": "rounded-lg",
  "baseColor": "neutral",
  "cssVariables": true,
  "theme": {
    "default": {
      "background": "0 0 100%",
      "foreground": "0 0 100%",
      "primary": "262 83% 58%",
      "primary-foreground": "0 0 100%",
      "secondary": "217 91% 60%",
      "secondary-foreground": "0 0 100%"
    }
  }
}
```

### CSS Variables (Theme)

```css
/* Light mode */
:root {
  --background: 0 0 100%;
  --foreground: 0 0 100%;

  --card: 0 0 100%;
  --card-foreground: 0 0 100%;

  --popover: 0 0 100%;
  --popover-foreground: 0 0 100%;

  --primary: 262 83% 58%;      /* Purple */
  --primary-foreground: 0 0 100%;

  --secondary: 217 91% 60%;    /* Blue */
  --secondary-foreground: 0 0 100%;

  --muted: 0 0 100%;
  --muted-foreground: 0 0 100%;

  --accent: 0 0 100%;
  --accent-foreground: 0 0 100%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0 100%;

  --border: 0 0 90%;
  --input: 0 0 90%;
  --ring: 262 83% 58%;

  --radius: 0.5rem;
}

/* Dark mode */
.dark {
  --background: 0 0 100%;
  --foreground: 0 0 100%;

  --card: 0 0 100%;
  --card-foreground: 0 0 100%;

  --primary: 263 70% 58%;
  --primary-foreground: 0 0 100%;

  --secondary: 217 91% 60%;
  --secondary-foreground: 0 0 100%;

  --muted: 0 0 100%;
  --muted-foreground: 0 0 100%;

  --accent: 0 0 100%;
  --accent-foreground: 0 0 100%;

  --border: 0 0 90%;
  --input: 0 0 90%;
  --ring: 263 70% 58%;
}
```

---

## Color Usage

### Semantic Tokens

```html
<!-- Background -->
<div class="bg-background">...</div>

<!-- Foreground (text) -->
<p class="text-foreground">...</p>

<!-- Primary (brand color) -->
<button class="bg-primary text-primary-foreground">...</button>

<!-- Secondary -->
<button class="bg-secondary text-secondary-foreground">...</button>

<!-- Muted (subtle) -->
<p class="text-muted-foreground">Subtitle text</p>

<!-- Border -->
<div class="border-border">...</div>
```

### Never Hardcode Colors

```html
<!-- ❌ Don't use hardcoded colors -->
<div class="text-neutral-950">...</div>
<div class="bg-white border-neutral-200">...</div>

<!-- ✅ Use theme tokens -->
<div class="text-foreground">...</div>
<div class="bg-background border-border">...</div>
```

---

## Component Library (shadcn/ui)

### Install Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add accordion
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sonner
```

### Available Components

| Component | Use Case |
|-----------|----------|
| `Button` | CTAs, actions |
| `Card` | Content containers |
| `Input` | Form fields |
| `Badge` | Labels, tags |
| `Separator` | Section dividers |
| `Accordion` | FAQ, collapsible |
| `Tabs` | Content switching |
| `Dialog` | Modals |
| `Sheet` | Mobile menu |
| `DropdownMenu` | Navigation menus |
| `Sonner` | Toast notifications |

---

## Layout System

### Container

```html
<div class="max-w-7xl mx-auto px-6">
  <!-- Content -->
</div>
```

### Grid

```html
<!-- 3-column features -->
<div class="grid grid-cols-1 gap-0 md:grid-cols-3">
  <div class="border-x border-b md:border-b-0 border-border p-8 first:border-l-0 last:border-r-0">
    Feature
  </div>
  <div class="border-x border-b md:border-b-0 border-border p-8">
    Feature
  </div>
  <div class="border-x border-b md:border-b-0 border-border p-8 last:border-r-0">
    Feature
  </div>
</div>
```

### Sections

```html
<!-- Light section -->
<section class="border-x border-b border-border">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <h2 class="text-3xl font-semibold text-foreground">Title</h2>
    <p class="mt-4 text-muted-foreground">Description</p>
  </div>
</section>

<!-- Dark section -->
<section class="border-x border-b border-border bg-card">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <h2 class="text-3xl font-semibold text-foreground">Title</h2>
    <p class="mt-4 text-muted-foreground">Description</p>
  </div>
</section>
```

---

## Component Usage

### Button

```tsx
import { Button } from "@/components/ui/button"

// Primary CTA
<Button>Get Started</Button>

// Secondary
<Button variant="secondary">Read the Docs</Button>

// Outline
<Button variant="outline">Learn More</Button>

// Ghost
<Button variant="ghost">Cancel</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Feature Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p class="text-muted-foreground">Feature description</p>
  </CardContent>
</Card>
```

### Input

```tsx
import { Input } from "@/components/ui/input"

<Input placeholder="Search..." />
<Input type="email" placeholder="Email" />
```

### Badge

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>New</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="outline">Coming Soon</Badge>
```

### Separator

```tsx
import { Separator } from "@/components/ui/separator"

<Separator />
```

### Accordion

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It uses Radix UI...</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Page Structure

### Hero Section

```tsx
<section class="border-x border-b border-border">
  <div class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
    <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Products</p>
    <h1 class="mt-4 text-4xl lg:text-5xl font-semibold text-foreground">
      AI agents that work for you.
    </h1>
    <p class="mt-6 text-lg text-muted-foreground max-w-2xl">
      Deploy agents with personalities. Give them memory. Trigger them from anywhere.
    </p>
    <div class="mt-8 flex gap-4">
      <Button size="lg">Get Started</Button>
      <Button variant="secondary" size="lg">Read the Docs</Button>
    </div>
  </div>
</section>
```

### Features Grid (3 columns)

```tsx
<section class="border-x border-b border-border">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 gap-0 md:grid-cols-3">
      <div class="border-x border-b md:border-b-0 border-border p-8 lg:p-12 first:border-l-0 last:border-r-0">
        <div class="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
          <Bot className="h-5 w-5" />
        </div>
        <h3 class="mt-6 text-lg font-semibold text-foreground">Agent Memory</h3>
        <p class="mt-2 text-muted-foreground">
          Agents remember context across sessions.
        </p>
      </div>
      <div class="border-x border-b md:border-b-0 border-border p-8 lg:p-12">
        <div class="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
          <Workflow className="h-5 w-5" />
        </div>
        <h3 class="mt-6 text-lg font-semibold text-foreground">Workflows</h3>
        <p class="mt-2 text-muted-foreground">
          Chain agents into powerful automations.
        </p>
      </div>
      <div class="border-x border-b md:border-b-0 border-border p-8 lg:p-12 last:border-r-0">
        <div class="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
          <Zap className="h-5 w-5" />
        </div>
        <h3 class="mt-6 text-lg font-semibold text-foreground">Any Trigger</h3>
        <p class="mt-2 text-muted-foreground">
          GitHub, CLI, SDK, webhooks, and more.
        </p>
      </div>
    </div>
  </div>
</section>
```

### Code Section (Dark)

```tsx
<section class="border-x border-b border-border bg-card">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 class="text-2xl font-semibold text-foreground">Simple to use</h2>
        <p class="mt-4 text-muted-foreground">
          Just a few lines of code to get started.
        </p>
      </div>
      <div class="border border-border rounded-lg overflow-hidden">
        <pre class="p-6 text-sm bg-muted overflow-x-auto">
          <code>{`import { createClient } from '@nesalia/sdk';

const client = createClient({ apiKey: '...' });

const response = await client.agents.invoke('my-agent', {
  prompt: 'Hello!'
});`}</code>
        </pre>
      </div>
    </div>
  </div>
</section>
```

### FAQ (Accordion)

```tsx
<Accordion type="single" collapsible className="max-w-2xl">
  <AccordionItem value="item-1">
    <AccordionTrigger>How is this different from just calling an LLM?</AccordionTrigger>
    <AccordionContent>
      <p class="text-muted-foreground">
        Agents have memory and state. Each agent maintains context
        across sessions, unlike stateless API calls.
      </p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Typography

### Scale

```tsx
// Display
<h1 className="text-4xl lg:text-5xl font-semibold">Title</h1>

// Section Title
<h2 className="text-3xl font-semibold">Section</h2>

// Feature Title
<h3 className="text-lg font-semibold">Feature</h3>

// Body
<p className="text-base">Body text</p>

// Muted
<p className="text-muted-foreground">Subtitle</p>

// Small
<p className="text-sm">Caption</p>
```

---

## Next Steps

1. [ ] Initialize shadcn/ui in project
2. [ ] Configure theme (purple/blue brand colors)
3. [ ] Install required components
4. [ ] Build homepage with shadcn components
5. [ ] Build product pages