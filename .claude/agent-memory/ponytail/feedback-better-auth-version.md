---
name: better-auth-version-pinned
description: better-auth and all @better-auth/* packages are pinned to exact version 1.6.6 — this is intentional, do not suggest upgrading or changing
metadata:
  type: feedback
---

## Rule: Do not suggest changing `better-auth` version

**What happened:** An audit flagged `better-auth@1.6.6` as "possibly a typo" or a version that "may not exist."

**Why this is wrong:** `better-auth@1.6.6` is a real, published version. It is intentionally pinned as an exact version across all `@better-auth/*` packages in the monorepo (`better-auth`, `@better-auth/drizzle-adapter`, `@better-auth/api-key`).

**Why pinned exact matters:** Better Auth's API surface is still evolving. Patching to `^1.6.6` or `^1.7.x` would silently pick up breaking changes to auth flows, session handling, and plugin contracts.

**How to apply:**
- When reviewing dependency updates (`/version-monitor`, dependency PRs): the `better-auth` ecosystem (`better-auth`, `@better-auth/*`) must stay on `1.6.6` unless explicitly requested.
- If a new feature is needed that only exists in a later version, flag it — do not assume a newer version is safe.
- The `packages/auth/CLAUDE.md` documents the exact pin; keep it consistent with `package.json`.

**References:**
- `packages/auth/package.json` — `better-auth: "1.6.6"`, `@better-auth/drizzle-adapter: "1.6.6"`, `@better-auth/api-key: "1.6.6"` (all exact)
- `packages/auth/CLAUDE.md` — dependencies section documents the pin
- `packages/auth/CLAUDE.md` — `packages/auth/src/config.ts` uses `organization from "@better-auth/plugins"` (not versioned sub-package — comes bundled)
