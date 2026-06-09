# Design System — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Overview

Using **shadcn/ui** components with theme-based colors. No hardcoded colors — use semantic tokens that automatically support light/dark mode.

---

## Color Tokens

### Semantic Tokens

| Token | Use |
|-------|-----|
| `background` | Page background |
| `foreground` | Primary text |
| `primary` | Brand color (purple) |
| `primary-foreground` | Text on primary |
| `secondary` | Secondary color (blue) |
| `secondary-foreground` | Text on secondary |
| `muted` | Subtle background |
| `muted-foreground` | Secondary text |
| `border` | Borders and dividers |
| `card` | Card backgrounds |

### Rules

- **Never** hardcode colors like `text-neutral-950` or `bg-white`
- **Always** use theme tokens: `text-foreground`, `bg-background`, `border-border`

---

## Components (shadcn/ui)

### Install Command

```bash
npx shadcn@latest add button card input badge separator accordion tabs
```

### Available Components

| Component | Use |
|-----------|-----|
| **Button** | CTAs, links, actions |
| **Card** | Content containers |
| **Input** | Form fields |
| **Badge** | Labels, tags, status |
| **Separator** | Section dividers |
| **Accordion** | FAQ, collapsible content |
| **Tabs** | Content switching |

---

## Layout

### Container

- Max width: `max-w-7xl`
- Horizontal padding: `px-6`
- Centered: `mx-auto`

### Grid

- Features: 3-column grid (`md:grid-cols-3`)
- No gap between columns (`gap-0`)
- Vertical borders for separation (`border-x`)
- First column: no left border (`first:border-l-0`)
- Last column: no right border (`last:border-r-0`)

### Sections

- Separated by `border-x border-b border-border`
- Vertical padding: `py-24`
- No external margins

---

## Page Structure

### Hero Section

- Badge/label at top
- Large headline (4xl-5xl)
- Subtitle in muted
- CTAs with Button component

### Features Grid

- 3-column grid with borders
- Icon + title + description per column
- Icons use primary color with muted background

### Code Section

- Dark background (card or muted)
- 2-column layout: text + code block
- Code block with rounded corners and border

### FAQ Section

- Accordion component
- Max width constraint
- Single item open at a time

---

## Typography

| Size | Use |
|------|-----|
| 4xl-5xl | Hero headlines |
| 3xl | Section titles |
| 2xl | Subsection titles |
| lg | Feature titles |
| base | Body text |
| sm | Secondary text, captions |

---

## Dark Mode

- Components automatically support dark mode via theme
- Use `bg-card` or `bg-muted` for section backgrounds in dark mode
- Text uses `text-foreground` which adapts automatically

---

## Next Steps

1. Initialize shadcn/ui in project
2. Install required components
3. Build homepage
4. Build product pages