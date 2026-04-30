# Next.js Caching

## What is it?

Next.js provides a comprehensive caching system that stores the result of data fetching and computations so future requests can be served faster without re-doing work. The caching system works at two levels:

- **Data-level**: Cache results of async functions (databases, APIs)
- **UI-level**: Cache entire components or pages

Next.js has two caching models:
1. **Cache Components** (modern, v16+): Uses `use cache` directive with `cacheLife`, `cacheTag`, and `updateTag`
2. **Previous Model** (fetch-based): Uses `fetch` options and `unstable_cache` with `revalidateTag` and `revalidatePath`

## Why use it?

Caching in Next.js provides several benefits:

- **Performance**: Serve cached responses instantly without re-computing
- **Reduced load**: Decrease database/API calls by serving cached data
- **Fresh content**: On-demand revalidation ensures content stays current when needed
- **Partial Prerendering (PPR)**: Static shell with dynamic holes for streaming content

## How to use it (Step by Step)

### Enabling Cache Components (Next.js v16+)

Add `cacheComponents: true` to your Next config:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

### Data-level caching with `use cache`

Cache an async function that fetches data:

```tsx filename="app/lib/data.ts"
import { cacheLife } from 'next/cache'

export async function getUsers() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM users')
}
```

### UI-level caching

Cache an entire component or page:

```tsx filename="app/page.tsx"
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')

  const users = await db.query('SELECT * FROM users')

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Using `cacheTag` for on-demand invalidation

Tag cached data for targeted revalidation:

```tsx filename="app/lib/data.ts"
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query('SELECT * FROM products')
}
```

### Revalidating with `updateTag` (Server Actions only)

Immediately expire cache for read-your-own-writes:

```tsx filename="app/lib/actions.ts"
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
    },
  })

  updateTag('posts')
  redirect(`/posts/${post.id}`)
}
```

### Revalidating with `revalidateTag` (stale-while-revalidate)

Invalidate cache with background refresh - stale content served while fresh loads:

```tsx filename="app/lib/actions.ts"
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  revalidateTag('user', 'max') // Recommended: stale-while-revalidate
}
```

### Revalidating with `revalidatePath`

Invalidate all cached data for a specific route path:

```tsx filename="app/lib/actions.ts"
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  revalidatePath('/profile')
}
```

## When to use it?

### Use `use cache` when:
- Data does not depend on runtime APIs (cookies, headers, searchParams)
- You want to cache data independently from UI
- Same data is used across multiple components
- You want predictable caching behavior with explicit lifetime

### Use `<Suspense>` with streaming when:
- Data depends on runtime APIs
- Data is highly personalized per user
- You need fresh data on every request

### Use `updateTag` when:
- User should see their own write immediately (read-your-own-writes)
- Only within Server Actions

### Use `revalidateTag` when:
- Slight delay in updates is acceptable
- You want stale-while-revalidate behavior
- Can be used in Server Actions or Route Handlers

### Use `revalidatePath` when:
- You want to revalidate a route without knowing associated tags
- Prefer tag-based revalidation when possible for precision

## Code Examples

### Complete example with static, cached, and streaming content

```tsx filename="app/blog/page.tsx"
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      {/* Static content - prerendered automatically */}
      <header>
        <h1>Our Blog</h1>
      </header>

      {/* Cached dynamic content */}
      <BlogPosts />

      {/* Runtime dynamic content - streams */}
      <Suspense fallback={<p>Loading your preferences...</p>}>
        <UserPreferences />
      </Suspense>

      {/* Server Action that revalidates cache */}
      <Suspense fallback={<p>Loading...</p>}>
        <CreatePost />
      </Suspense>
    </>
  )
}

async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  const res = await fetch('https://api.example.com/blog')
  const posts = await res.json()

  return (
    <section>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </section>
  )
}

async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <p>Your theme: {theme}</p>
}

async function CreatePost() {
  async function createPost(formData: FormData) {
    'use server'
    await db.post.create({ data: { title: formData.get('title') } })
    updateTag('posts')
  }

  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <button type="submit">Publish</button>
    </form>
  )
}
```

### Passing runtime values to cached functions

```tsx filename="app/profile/page.tsx"
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}

async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
  return <CachedContent sessionId={session} />
}

async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // sessionId becomes part of the cache key
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

### Previous model: Using `unstable_cache` for non-fetch functions

```ts filename="app/lib/data.ts"
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id: string) => {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])
  },
  ['user'], // cache key prefix
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

### Previous model: Time-based revalidation with fetch

```tsx filename="app/page.tsx"
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

### Deduplicating requests with React `cache`

```tsx filename="app/lib/data.ts"
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

## Configuration Options

### `cacheLife` Profiles

| Profile   | `stale` | `revalidate` | `expire`    |
| --------- | ------- | ------------ | ----------- |
| `seconds` | 0       | 1s           | 60s         |
| `minutes` | 5m      | 1m           | 1h          |
| `hours`   | 5m      | 1h           | 1d          |
| `days`    | 5m      | 1d           | 1w          |
| `weeks`   | 5m      | 1w           | 30d         |
| `max`     | 5m      | 30d          | ~indefinite |

### `cacheLife` Custom Configuration

```tsx
'use cache'
cacheLife({
  stale: 3600,   // 1 hour until considered stale
  revalidate: 7200, // 2 hours until revalidated
  expire: 86400, // 1 day until expired
})
```

### Route segment config options (Previous model)

```tsx
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'

export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'

export const revalidate = false
// false | 0 | number (seconds)
```

## Common Patterns

### Preloading data with `server-only` and React `cache`

```ts filename="utils/get-item.ts"
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id: string) => {
  // ...
})

export const preload = (id: string) => {
  void getItem(id)
}
```

Then call `preload()` before blocking work:

```tsx filename="app/item/[id]/page.tsx"
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  preload(id)
  const isAvailable = await checkIsAvailable()
  return isAvailable ? <Item id={id} /> : null
}
```

### Handling non-deterministic operations

```tsx filename="page.tsx"
import { connection } from 'next/server'
import { Suspense } from 'react'

async function UniqueContent() {
  await connection()
  const uuid = crypto.randomUUID()
  return <p>Request ID: {uuid}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UniqueContent />
    </Suspense>
  )
}
```

### Opting out of static shell

```tsx filename="app/layout.tsx"
import { Suspense } from 'react'

export default function RootLayout({ children }) {
  return (
    <html>
      <Suspense fallback={null}>
        <body>{children}</body>
      </Suspense>
    </html>
  )
}
```

## Gotchas and Troubleshooting

### Cache key behavior
- Arguments and closed-over values from parent scopes become part of the cache key
- Different inputs produce separate cache entries
- This enables personalized or parameterized cached content

### Prerendering behavior
- Short-lived caches (seconds profile, `revalidate: 0`, or `expire` under 5 minutes) are automatically excluded from prerenders
- They become dynamic holes instead

### Runtime API handling
- Components using `cookies()`, `headers()`, or `searchParams()` should be wrapped in `<Suspense>`
- Extract runtime values and pass them as arguments to cached functions

### Static shell verification
- Check the build output summary during `next build` to verify routes were prerendered
- View page source in browser to see what content was added to the static shell

### revalidateTag vs updateTag

|              | `updateTag`                    | `revalidateTag`                |
| ------------ | ------------------------------ | ------------------------------ |
| **Where**    | Server Actions only            | Server Actions and Route Handlers |
| **Behavior** | Immediately expires cache      | Stale-while-revalidate         |
| **Use case** | Read-your-own-writes          | Background refresh             |

### Prefer tags over paths
- Tag-based revalidation (`revalidateTag`/`updateTag`) is more precise
- `revalidatePath` can over-invalidate since it clears all cached data for a route

## Related Concepts

- [Next.js Partial Prerendering (PPR)](/docs/learnings/nextjs/partial-prerendering)
- [Next.js Server Components](/docs/learnings/nextjs/server-components)
- [Next.js Server Actions](/docs/learnings/nextjs/server-actions)

## Sources

- [Next.js Caching Guide](https://nextjs.org/docs/app/getting-started/caching)
- [Next.js Revalidating Guide](https://nextjs.org/docs/app/getting-started/revalidating)
- [Next.js Caching without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)
