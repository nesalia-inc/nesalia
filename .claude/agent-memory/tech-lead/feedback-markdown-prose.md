---
name: feedback-markdown-prose
description: Markdown rendering with marked, DOMPurify, and Tailwind prose
type: feedback
---

# Markdown Rendering in Web App

## Stack Chosen
- **marked** for parsing markdown → HTML
- **DOMPurify** for XSS sanitization
- **@tailwindcss/typography** for prose styling

## Why not react-markdown
User initially considered react-markdown to use shadcn Typography components, but:
1. Would require significant refactoring
2. prose + dangerouslySetInnerHTML works fine
3. Simpler to maintain

## Tailwind Typography Plugin

### Installation
```bash
pnpm add -D @tailwindcss/typography --filter @complete-web-template/web
```

### CSS Configuration
Add to `globals.css`:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

### Usage
```tsx
<div
  className="prose prose-sm max-w-none dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: html }}
/>
```

## Prose Classes
- `prose` — base prose styles
- `prose-sm`, `prose-lg`, `prose-xl` — size variants
- `prose-headings:font-semibold` — customize headings
- `prose-invert` — dark mode
- `max-w-none` — full container width

## marked Configuration
```typescript
import { marked } from "marked";

marked.setOptions({
  gfm: true,  // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
});
```

## DOMPurify
```typescript
import DOMPurify from "dompurify";

export function renderMarkdown(content: string): string {
  const rawHtml = marked(content) as string;
  return DOMPurify.sanitize(rawHtml);
}
```
