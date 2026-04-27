# DeesseJS Type Compatibility Issue Report

**Date:** 2026-04-27
**Project:** nesalia (apps/web)
**Component:** deesse (authentication library)
**Severity:** Medium
**Status:** Awaiting resolution from DeesseJS team

## Issue Summary

The project experiences TypeScript compilation errors due to incompatible types between the local `drizzle-orm` version (0.45.2) and the version bundled with DeesseJS (0.38.4). This manifests as type mismatches in the database configuration and authentication setup.

## Error Messages

### Error 1: Database Type Mismatch
```
src/deesse.config.ts:8:3 - error TS2322: Type 'NodePgDatabase<...>' is not assignable to type 'PostgresJsDatabase<...>'
```

The local installation uses `pg` (node-postgres) driver, but DeesseJS expects `postgres-js` driver.

### Error 2: Session Type Incompatibility
```
The types of '_.session' are incompatible between these types.
Property 'dialect' is protected but type 'PgSession<...>' is not a class derived from 'PgSession<...>'.
```

### Error 3: Config Schema Type Mismatch
```
Type 'InternalConfig<{ user: ... }>' is not assignable to type 'InternalConfig'.
The types of 'database._.fullSchema' are incompatible.
```

## Root Cause

DeesseJS internally depends on `drizzle-orm@0.38.4` with `postgres-js` driver, while our project uses:
- `drizzle-orm@0.45.2` (top-level)
- `pg@8.13.0` (Postgres driver via Pool)

Version mismatch causes internal types to be incompatible between packages.

## Current Workaround

The project uses `// @ts-ignore` and `as any` type assertions to bypass TypeScript's type checking for the database configuration:

**File: `src/deesse.config.ts`**
```typescript
import postgres from 'postgres';
const client = postgres(process.env.DATABASE_URL!);

export const config = defineConfig({
  name: "DeesseJS App",
  database: drizzle(client, { schema }) as any,  // Workaround: bypass type check
  secret: process.env.DEESSE_SECRET!,
  auth: { ... },
});
```

**File: `src/lib/deesse.ts`**
```typescript
export const deesse = await getDeesse(config as any);  // Workaround: bypass type check
```

Downgrading `drizzle-orm` to `0.38.4` did not resolve the issue due to persistent type incompatibility at the session level.

## Impact

1. **Type Safety:** Bypassing TypeScript checks reduces code safety
2. **Maintenance:** Workarounds may need updates when DeesseJS is upgraded
3. **Build Warnings:** TypeScript passes but relies on runtime type coercion

## Recommended Solution

The DeesseJS team should:

1. **Export their internal `drizzle-orm` schema types** so consumers can match them exactly, OR
2. **Accept broader database type definitions** using TypeScript's utility types (e.g., `Partial`, generic constraints), OR
3. **Document the exact versions and drivers** required for compatibility

## Steps to Reproduce

1. Clone nesalia repository
2. Run `npm install`
3. Run `npx tsc --noEmit`
4. Observe type errors in `src/deesse.config.ts` and `src/lib/deesse.ts`

## Environment

- **OS:** Windows 11 / Vercel deployment (iad1)
- **Node:** Next.js 16.2.4 with Turbopack
- **Package Manager:** npm
- **TypeScript:** 5.x

## Timeline

- **2026-04-27:** Issue identified during Vercel deployment build failure
- **2026-04-27:** Workaround applied to unblock build (using `as any`)

## Contact

For questions regarding this issue, contact the Nesalia backend team who is using DeesseJS for authentication.