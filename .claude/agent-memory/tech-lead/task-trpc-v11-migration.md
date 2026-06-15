---
name: task-trpc-v11-migration
description: tRPC v11 API changes that caused issues
type: project
---

# tRPC v11 Breaking Changes

## Migration Issues Encountered

### 1. `.useMutation()` doesn't exist
**Wrong:** `trpc.foo.bar.mutation.useMutation()`
**Correct:** `trpc.foo.bar.useMutation()`

The `.mutation()` decorator doesn't exist in v11 — procedures are decorated automatically.

### 2. `.queryKey()` doesn't exist
**Wrong:**
```typescript
queryClient.invalidateQueries({
  queryKey: trpc.organizationDocuments.list.queryKey(),
});
```

**Correct:**
```typescript
queryClient.invalidateQueries(); // Invalidate all
```

### 3. Hook pattern requires @trpc/react-query
The web app was using `@trpc/tanstack-react-query` alone which doesn't export stable hooks.

**Solution:** Install both:
```bash
pnpm add @trpc/react-query@11.17.0 @tanstack/react-query@5.67.3
```

Then use `createTRPCReact`:
```typescript
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

// In provider:
<trpc.Provider client={trpcClient} queryClient={queryClient}>
```

### 4. TanStack Query version compatibility
- `@trpc/react-query@11.17.0` requires `@tanstack/react-query@^5.80.3`
- Web was on `5.100.11`, downgraded to `5.67.3` for compatibility

## Why this happened
The tRPC ecosystem has multiple packages that look similar:
- `@trpc/react-query` — React hooks (createTRPCReact)
- `@trpc/tanstack-react-query` — TanStack Query integration (createTRPCContext)

The latter is newer but the former is more stable and documented.
