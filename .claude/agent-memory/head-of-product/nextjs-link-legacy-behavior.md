---
name: nextjs-link-legacy-behavior
description: Next.js 16 removes legacyBehavior - use asChild pattern
type: reference
---

## Problem

Next.js 16 removes `legacyBehavior` prop from `<Link>`. Old pattern causes deprecation warning:

```tsx
// ❌ Deprecated
<Link href="/pricing" legacyBehavior passHref>
  <NavigationMenuLink>...</NavigationMenuLink>
</Link>
```

## Solution

Use `asChild` on the child component instead:

```tsx
// ✅ New pattern
<NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
  <Link href="/pricing">Pricing</Link>
</NavigationMenuLink>
```

## Why

- Next.js Link now handles `<a>` tag automatically
- Radix NavigationMenuLink needs `asChild` to pass props to Link
- Order reverses: child component with `asChild`, Link inside

## Applicable To

All Radix-based shadcn components that wrap Link:
- NavigationMenuLink
- DropdownMenuItem
- TabsTrigger
- etc.

**Source:** https://github.com/shadcn-ui/ui/discussions/7266