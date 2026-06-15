---
name: ui-typography-components
description: shadcn Typography components - shadcn doesn't ship them, just examples
type: project
---

# shadcn Typography Components

## Important Finding
**shadcn/ui does NOT ship Typography components.** They provide example Tailwind classes that you copy-paste into your own components.

Source: https://ui.shadcn.com/docs/components/typography

## Available Styles (Tailwind Classes Only)

| Element | Classes |
|---------|---------|
| **h1** | `scroll-m-20 text-4xl font-extrabold tracking-tight` |
| **h2** | `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0` |
| **h3** | `scroll-m-20 text-2xl font-semibold tracking-tight` |
| **h4** | `scroll-m-20 text-xl font-semibold tracking-tight` |
| **p** | `leading-7 [&:not(:first-child)]:mt-6` |
| **Lead** | `text-xl text-muted-foreground` |
| **Small** | `text-sm font-medium leading-none` |
| **Muted** | `text-sm text-muted-foreground` |
| **Large** | `text-lg font-semibold` |
| **Blockquote** | `mt-6 border-l-2 pl-6 italic` |
| **Inline Code** | `rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold` |
| **List** | `my-6 ml-6 list-disc [&>li]:mt-2` |
| **ListOrdered** | `my-6 ml-6 list-decimal [&>li]:mt-2` |

## Implementation in Project

Created `apps/web/components/ui/typography.tsx` with React components wrapping these classes:
```tsx
import { H1, H2, H3, H4, P, Lead, Small, Muted, Large, Blockquote, Code, List, ListOrdered, Table } from "@/components/ui/typography"
```

Each component:
- Uses `React.forwardRef` for ref forwarding
- Uses `cn()` utility for className merging
- Has proper `displayName` for React DevTools

## Usage Example
```tsx
<H1>My Document Title</H1>
<P>Some paragraph text with <Code>inline code</Code> in it.</P>
<Blockquote>This is a quote</Blockquote>
<List>
  <li>Item 1</li>
  <li>Item 2</li>
</List>
```
