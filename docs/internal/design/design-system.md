# Design System — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Overview

Following Vercel's design philosophy:
- **Grid-first** — Content flows in grid, not margin-based
- **Max-width containers** — `max-w-*` for content boundaries
- **Border-x separators** — Horizontal dividers instead of margins
- **No external margins** — Elements stack without gaps
- **Dense layout** — Compact, information-rich pages

---

## Container System

### Max-Width Scale

```css
/* Tailwind max-width scale */
max-w-none        /* Full width */
max-w-xs    320px /* Narrow text */
max-w-sm    384px /* Card width */
max-w-md    448px /* Form inputs */
max-w-lg    512px /* Content blocks */
max-w-xl    576px /* Feature descriptions */
max-w-2xl   672px /* Article text */
max-w-3xl   768px /* Wide content */
max-w-4xl   896px /* Section content */
max-w-5xl  1024px /* Standard section */
max-w-6xl  1152px /* Wide section */
max-w-7xl  1280px /* Container max */
max-w-full 100%  /* Full width */
```

### Usage Pattern

```html
<!-- Centered container with max-width -->
<div class="max-w-7xl mx-auto">
  <!-- Content here -->
</div>

<!-- Full-bleed sections with inner max-width -->
<section class="border-x border-neutral-200">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Section content -->
  </div>
</section>
```

---

## Grid System

### Page Grid

```html
<div class="max-w-7xl mx-auto">
  <div class="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:gap-8">
    <!-- Sidebar -->
    <aside class="lg:col-span-3">...</aside>

    <!-- Main content -->
    <main class="lg:col-span-9">...</main>
  </div>
</div>
```

### Feature Grid (3-column)

```html
<div class="grid grid-cols-1 gap-0 md:grid-cols-3">
  <div class="border-x border-b border-neutral-200 p-8">
    Feature 1
  </div>
  <div class="border-x border-b border-neutral-200 p-8">
    Feature 2
  </div>
  <div class="border-x border-b border-neutral-200 p-8">
    Feature 3
  </div>
</div>
```

### Product Grid (2x2)

```html
<div class="grid grid-cols-1 gap-0 md:grid-cols-2">
  <div class="border-x border-b border-neutral-200 p-12">
    Product 1
  </div>
  <div class="border-x border-b border-neutral-200 p-12">
    Product 2
  </div>
  <div class="border-x border-b border-neutral-200 p-12">
    Product 3
  </div>
  <div class="border-x border-b border-neutral-200 p-12">
    Product 4
  </div>
</div>
```

---

## Border-x Pattern

### Section Separators

Instead of margins, use `border-x` for visual separation:

```html
<!-- ❌ Don't use margins -->
<section class="mt-16 mb-16">
  Content
</section>

<!-- ✅ Use border-x -->
<section class="border-x border-neutral-200">
  <div class="max-w-7xl mx-auto px-6">
    Content
  </div>
</section>
```

### Grid with Borders

```html
<!-- 3-column grid with vertical borders -->
<div class="grid grid-cols-1 gap-0 md:grid-cols-3">
  <div class="border-x border-b border-neutral-200 p-8 first:border-l-0 last:border-r-0">
    Column 1
  </div>
  <div class="border-x border-b border-neutral-200 p-8">
    Column 2
  </div>
  <div class="border-x border-b border-neutral-200 p-8 last:border-r-0">
    Column 3
  </div>
</div>
```

### Full-Bleed with Border

```html
<!-- Dark section -->
<section class="border-x border-white/10 bg-neutral-950">
  <div class="max-w-7xl mx-auto px-6 py-24">
    Content
  </div>
</section>

<!-- Light section -->
<section class="border-x border-neutral-200">
  <div class="max-w-7xl mx-auto px-6 py-24">
    Content
  </div>
</section>
```

---

## No External Margins

### Stack Elements Vertically

```html
<!-- ❌ Don't add top/bottom margins -->
<div class="mt-16 mb-8">
  <h2>Title</h2>
  <p class="mt-4">Description</p>
</div>

<!-- ✅ Stack without external margins -->
<div>
  <h2 class="text-3xl font-semibold text-white">Title</h2>
  <p class="mt-4 text-neutral-400">Description</p>
</div>
```

### Section Spacing with Border

```html
<!-- Border creates visual separation instead of margin -->
<section class="border-x border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <!-- No margin-top here, border from previous section creates separation -->
    <h2>Section Title</h2>
    <p>Section content</p>
  </div>
</section>

<section class="border-x border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <!-- Same py-24 creates consistent internal spacing -->
    <h2>Next Section</h2>
    <p>More content</p>
  </div>
</section>
```

---

## Page Structure

### Hero Section

```html
<section class="border-x border-b border-neutral-200 bg-white">
  <div class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
    <div class="max-w-3xl">
      <p class="text-sm font-medium text-neutral-500 uppercase tracking-wider">Products</p>
      <h1 class="mt-4 text-5xl font-semibold text-neutral-950">
        AI agents that work for you.
      </h1>
      <p class="mt-6 text-xl text-neutral-600">
        Deploy agents with personalities. Give them memory. Trigger them from anywhere.
      </p>
    </div>
  </div>
</section>
```

### Feature Grid (3 columns)

```html
<section class="border-x border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 gap-0 md:grid-cols-3">
      <div class="border-x border-b md:border-b-0 border-neutral-200 p-8 lg:p-12 first:border-l-0 last:border-r-0">
        <!-- Feature 1 -->
      </div>
      <div class="border-x border-b md:border-b-0 border-neutral-200 p-8 lg:p-12">
        <!-- Feature 2 -->
      </div>
      <div class="border-x border-b md:border-b-0 border-neutral-200 p-8 lg:p-12 last:border-r-0">
        <!-- Feature 3 -->
      </div>
    </div>
  </div>
</section>
```

### Code Example Section

```html
<section class="border-x border-b border-neutral-200 bg-neutral-950">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <div class="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 class="text-2xl font-semibold text-white">Simple to use</h2>
        <p class="mt-4 text-neutral-400">
          Just a few lines of code to get started.
        </p>
      </div>
      <div class="border-x border-neutral-800 rounded-lg overflow-hidden">
        <pre class="p-6 text-sm text-green-400 bg-black/50"><code>...</code></pre>
      </div>
    </div>
  </div>
</section>
```

### CTA Section

```html
<section class="border-x border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-6 py-24 text-center">
    <h2 class="text-3xl font-semibold text-neutral-950">
      Start building today.
    </h2>
    <p class="mt-4 text-neutral-600">
      Get started for free. No credit card required.
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <a href="/get-started" class="...">Get Started</a>
      <a href="/docs" class="...">Read the Docs</a>
    </div>
  </div>
</section>
```

---

## Responsive Breakpoints

```css
/* Mobile first */
/* Default: single column */

/* Tablet */
@media (min-width: 768px) {
  .md\:grid-cols-2  /* 2 columns */
  .md\:grid-cols-3  /* 3 columns */
  .md\:flex-row    /* Horizontal layout */
}

/* Desktop */
@media (min-width: 1024px) {
  .lg\:grid-cols-12  /* 12-column grid */
  .lg\:col-span-3   /* Sidebar */
  .lg\:col-span-9   /* Main content */
  .lg\:gap-16       /* Larger gaps */
}

/* Wide */
@media (min-width: 1280px) {
  /* Use max-width containers */
}
```

---

## Color Palette

```css
/* Neutral scale (for text, borders) */
--neutral-50:  #fafafa
--neutral-100: #f5f5f5
--neutral-200: #e5e5e5
--neutral-300: #d4d4d4
--neutral-400: #a3a3a3
--neutral-500: #737373
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717
--neutral-950: #0a0a0a

/* Brand colors */
--brand-purple: #7c3aed  /* Primary */
--brand-blue:  #2563eb  /* Secondary */

/* Dark mode */
.bg-neutral-950   /* Dark backgrounds */
.text-white       /* Light text on dark */
.border-white/10  /* Subtle borders */
```

---

## Typography Scale

```css
/* Font sizes */
text-xs    12px /* Labels, captions */
text-sm    14px /* Secondary text */
text-base  16px /* Body text */
text-lg    18px /* Lead paragraphs */
text-xl    20px /* Feature titles */
text-2xl   24px /* Section titles */
text-3xl   30px /* Page titles */
text-4xl   36px /* Hero headlines */
text-5xl   48px /* Hero display */
text-6xl   60px /* Landing hero */

/* Font weights */
font-normal    400
font-medium    500
font-semibold  600
font-bold      700
```

---

## Component Patterns

### Button

```html
<!-- Primary -->
<button class="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-white bg-neutral-950 rounded-lg hover:bg-neutral-800">
  Get Started
</button>

<!-- Secondary -->
<button class="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-neutral-950 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
  Read the Docs
</button>
```

### Card

```html
<!-- No card styling - use border-x grid instead -->
<div class="border-x border-b border-neutral-200 p-8">
  Content
</div>
```

### Input

```html
<input
  type="text"
  placeholder="Search..."
  class="h-10 px-4 text-sm bg-transparent border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
/>
```

---

## Dark Mode

```html
<!-- Dark section -->
<section class="border-x border-b border-white/10 bg-neutral-950">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <h2 class="text-3xl font-semibold text-white">Headline</h2>
    <p class="mt-4 text-neutral-400">Description</p>
  </div>
</section>

<!-- Light section -->
<section class="border-x border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-6 py-24">
    <h2 class="text-3xl font-semibold text-neutral-950">Headline</h2>
    <p class="mt-4 text-neutral-600">Description</p>
  </div>
</section>
```

---

## Layout Examples

### Homepage Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, transparent → solid)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ HERO (border-b)                                                 │
│ max-w-7xl, py-24 lg:py-32                                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ SOCIAL PROOF (border-b)                                         │
│ Grid 3-col stats                                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ FEATURES (border-b)                                             │
│ Grid 3-col with border-x separators                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CODE EXAMPLE (bg-neutral-950, border-b)                         │
│ Grid 2-col: text + code block                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CTA (border-b)                                                  │
│ Centered text                                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER                                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Product Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ HERO (border-b)                                                 │
│ max-w-3xl                                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ WHAT IT IS (border-b)                                           │
│ 2-col grid: text + visual                                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ FEATURES (border-b)                                             │
│ 3-col grid with border-x                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ HOW IT WORKS (border-b)                                         │
│ Step-by-step with code                                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ INTEGRATIONS (border-b)                                         │
│ Logo grid                                                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ FAQ (border-b)                                                  │
│ Accordion or simple list                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CTA (border-b)                                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER                                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. [ ] Create Tailwind config with design tokens
2. [ ] Build reusable components
3. [ ] Create page templates
4. [ ] Implement Homepage
5. [ ] Implement product pages