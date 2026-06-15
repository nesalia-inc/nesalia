---
name: create-plan
description: Create a technical plan from a product spec. Use when Head of Product delivers a feature spec and you need to produce a technical design document.
disable-model-invocation: true
allowed-tools: Write, Read, Glob, Bash
argument-hint: <feature-name>
---

## Find the Product Spec

Look for the product spec in `docs/internal/product/features/<feature-name>/`

If the directory doesn't exist, check:
- `temp/` directory
- Ask the user for the spec location

If no spec exists, ask the user to provide one before proceeding.

## Read & Analyze

Read the product spec completely. Note:
- User stories (what the user can do)
- Use cases (concrete examples)
- Constraints (limits, requirements)
- Edge cases (what happens at boundaries)
- Success criteria

## Assess Current State

Inventory what exists and what needs to change across all layers:

| Layer | What Exists | What Needs to Change | What's New |
|-------|-------------|---------------------|------------|
| DB Schema | - | - | - |
| API (tRPC) | - | - | - |
| SDK | - | - | - |
| CLI | - | - | - |
| Web UI | - | - | - |

Use Glob and Read to check:
- `packages/db/src/db/schema/` for existing tables
- `packages/api/src/routers/` for existing routers
- `packages/sdk/src/` for SDK structure
- `apps/cli/src/commands/` for CLI commands
- `apps/web/app/` for existing pages

## Design Solution

### Data Model

For new tables, write the Drizzle schema:
```typescript
export const tableName = pgTable("table_name", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ... fields
});
```

For enhancements, describe migration needed.

### API Design

For each procedure, define:
- Name: `feature.action`
- Auth: `protectedProcedure` / `adminProcedure`
- Input: Zod schema
- Output: Response shape

### Web UI

Define pages and components needed.

## Identify Risks

List potential issues:
- Breaking changes to existing features
- Migration complexity
- Performance concerns
- Security implications
- Dependencies

## Estimate Effort

Estimate time per layer:
- Database: Xh
- API: Xh
- SDK: Xh
- CLI: Xh
- Web UI: Xh
- **Total: Xh**

## Write the Plan

Create the technical plan at `docs/internal/architecture/designs/<feature-name>.md`

Use this structure:
```markdown
# <Feature> Technical Plan

## Overview
Brief description of what we're building.

## Current State
Inventory table of existing vs new components.

## Data Model
New tables with Drizzle schema.

## API Design
Procedures table with inputs/outputs.

## Implementation Phases
Ordered checklist of steps per layer.

## Effort Estimate
Time and complexity table.

## Risks
Risk table with mitigation strategies.

## Open Questions for Product
Questions requiring clarification.
```

## Report

After writing the file, report:
```
✓ Created: docs/internal/architecture/designs/<feature-name>.md

Summary:
- Components new: [list]
- Components changed: [list]
- Estimated effort: Xh
- Risks identified: [list]
- Open questions: [list]
```

Then summarize any decisions made and ask the user to review.