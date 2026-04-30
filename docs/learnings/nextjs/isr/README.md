# ISR (Incremental Static Regeneration)

## What is it?

ISR enables you to update static pages at runtime after deployment, without rebuilding the entire site. Pages are generated at build time (or on-demand) and cached globally, reducing server load while ensuring content stays fresh through revalidation.

## Why use it?

- Update static content without a full rebuild - ideal for content that changes after deployment
- Reduce server load by serving prerendered, cached pages for most requests
- Automatic `cache-control` headers are added to pages
- Handle large amounts of content pages without long `next build` times
- Pages are generated on-demand for paths not known at build time

## How to use it (Step by Step)

### 1. Time-based ISR with `revalidate`

Export the `revalidate` constant from any page or layout to enable ISR with automatic revalidation:

```tsx filename="app/blog/[id]/page.tsx"
export const revalidate = 60 // Revalidate at most once every 60 seconds

interface Post {
  id: string
  title: string
  content: string
}

export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then(res => res.json())
  return posts.map(post => ({ id: String(post.id) }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post: Post = await fetch(`https://api.vercel.app/blog/${id}`).then(res => res.json())
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

### 2. On-Demand Revalidation with `revalidatePath`

Invalidate cached pages on-demand from a Server Action:

```ts filename="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  await db.post.create({ data: { title: 'New Post' } })
  revalidatePath('/posts')
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
  revalidatePath(`/posts/${id}`)
}
```

Revalidate specific paths from a Route Handler:

```ts filename="app/api/revalidate/route.ts"
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')
  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }
  return Response.json({ revalidated: false, message: 'Missing path param' })
}
```

### 3. Tag-based Revalidation with `revalidateTag`

Tag data in `fetch` calls for granular invalidation:

```tsx filename="app/blog/page.tsx"
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  return <BlogList posts={posts} />
}
```

Invalidate all data tagged with a specific tag:

```ts filename="app/actions.ts"
'use server'
import { revalidateTag } from 'next/cache'

export async function createPost() {
  await db.post.create({ data: { title: 'New Post' } })
  revalidateTag('posts', 'max') // Recommended: stale-while-revalidate
}
```

## When to use it?

**Use ISR when:**
- Content updates infrequently (blog posts, product pages, documentation)
- You want static performance with the ability to update after deployment
- You have many pages that can be generated at build time and updated lazily

**Do NOT use ISR when:**
- Content changes in real-time (stock prices, live sports scores)
- Content is personalized per user (use dynamic rendering instead)
- You need immediate consistency for all users after an update

## Code Examples

### On-Demand ISR with Webhook

```ts filename="app/api/webhook/route.ts"
import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const payload = await request.json()

  // Verify webhook signature (example)
  if (!verifyWebhook(payload)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Invalidate the products cache when inventory changes
  if (payload.type === 'product.updated') {
    revalidateTag('products', { expire: 0 }) // Immediate expiration for webhooks
  }

  return Response.json({ success: true })
}
```

### Dynamic Routes with ISR

```tsx filename="app/products/[category]/[product]/page.tsx"
export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const categories = await getCategories()
  const paths = []
  for (const category of categories) {
    const products = await getProductsByCategory(category.id)
    for (const product of products) {
      paths.push({ category: category.slug, product: product.slug })
    }
  }
  return paths
}

export default async function ProductPage({ params }) {
  const { category, product } = await params
  const data = await getProduct(category, product)
  return <ProductDetail product={data} />
}
```

### Using `unstable_cache` with Tags (for ORMs)

```tsx filename="app/blog/page.tsx"
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

export default async function Page() {
  const posts = await getCachedPosts()
  return <BlogList posts={posts} />
}
```

### Combining `revalidatePath` and `revalidateTag`

```ts filename="app/actions.ts"
'use server'
import { revalidatePath, updateTag } from 'next/cache'

export async function updatePost(id: string) {
  await updatePostInDatabase(id)
  revalidatePath('/blog')           // Refresh the blog listing page
  revalidatePath(`/blog/${id}`)     // Refresh the individual post page
  updateTag('posts')                // Also invalidate all other pages using 'posts' tag
}
```

## Configuration Options

### Route Segment Config

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `revalidate` | `number \| false` | `false` | Seconds between revalidations (time-based ISR) |
| `dynamicParams` | `boolean` | `true` | Whether new paths not in `generateStaticParams` can be generated on-demand |

### `revalidateTag` and `revalidatePath` Comparison

| | `revalidatePath` | `revalidateTag` / `updateTag` |
|--|--|--|
| **What it invalidates** | Specific page or layout path | Data with specific cache tag(s) |
| **Scope** | Single path and its children (for layouts) | All pages using that tag across the app |
| **Use case** | When you know the exact path | When you want granular, tag-based invalidation |
| **Granularity** | Coarse (path-level) | Fine (data-level) |

### `updateTag` vs `revalidateTag` (stale-while-revalidate)

| | `updateTag` | `revalidateTag` |
|--|--|--|
| **Where** | Server Actions only | Server Actions and Route Handlers |
| **Behavior** | Immediately expires cache | Stale-while-revalidate (serves stale while fetching) |
| **When** | Read-your-own-writes scenarios | Background refresh is acceptable |
| **Second arg** | N/A | `profile="max"` recommended |

## Gotchas and Troubleshooting

### Cache invalidation is per-instance by default

When running multiple Next.js instances, on-demand `revalidatePath`/`revalidateTag` only invalidates the instance that receives the call. Use a [custom cache handler](/docs/app/api-reference/config/next-config-js/cacheHandlers) to coordinate across instances.

### Rewrites require destination paths

When using [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites), you must revalidate the destination path, not the source path:

```ts
// Correct: use the destination path
revalidatePath('/news')

// Incorrect: won't match the cache entry
revalidatePath('/blog')
```

### ISR only works with Node.js runtime

ISR is not supported with Edge Runtime or Static Exports (`output: 'export'`).

### On-demand revalidation triggers on next visit

Calling `revalidatePath` marks the path for revalidation, but regeneration happens on the next request to that path - not immediately.

### `revalidateTag` requires two arguments (recommended)

The single-argument form `revalidateTag(tag)` is deprecated. Use `revalidateTag(tag, 'max')` for stale-while-revalidate or `revalidateTag(tag, { expire: 0 })` for immediate expiration (e.g., from webhooks).

### Debug cache in local development

Add to `next.config.js` to see cache hits/misses in dev:

```js
module.exports = {
  logging: {
    fetches: { fullUrl: true },
  },
}
```

Run `next build && next start` to test ISR behavior locally as it works in production. Add `NEXT_PRIVATE_DEBUG_CACHE=1` to see ISR cache hits/misses in console output.

### Check `x-nextjs-cache` header

Response header values:
- `HIT` - served from cache
- `STALE` - served from cache, revalidating in background
- `MISS` - not in cache, rendered fresh
- `REVALIDATED` - regenerated via on-demand revalidation

## Related Concepts

- [Caching](/docs/learnings/nextjs/caching) - Full caching overview including `use cache` directive, `cacheLife`, `cacheTag`
- [revalidatePath](/docs/app/api-reference/functions/revalidatePath) - API reference
- [revalidateTag](/docs/app/api-reference/functions/revalidateTag) - API reference
- [cacheTag](/docs/app/api-reference/functions/cacheTag) - Tagging cached data
- [updateTag](/docs/app/api-reference/functions/updateTag) - Immediate cache expiration for Server Actions

## Sources

- [ISR Guide (App Router)](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Revalidating Data](https://nextjs.org/docs/app/getting-started/revalidating)
- [revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [revalidateTag API](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [cacheTag API](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- [updateTag API](https://nextjs.org/docs/app/api-reference/functions/updateTag)