---
name: architecture-sidebar-layout
description: Sidebar and layout patterns in Next.js App Router
type: project
---

# Sidebar and Layout Architecture

## Sidebar Structure

### Components Used
```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
```

### Required Wrapping
Sidebar requires `SidebarProvider` at the layout level:
```tsx
// layout.tsx
export default async function OrgLayout({ children, params }) {
  return (
    <SidebarProvider>
      <AppSidebar orgSlug={orgSlug} />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## AppSidebar Component

### Props
```tsx
interface AppSidebarProps {
  orgSlug?: string; // Required to show org-specific links
}
```

### Conditional Navigation Links
Org-specific links (like Documents) only show when `orgSlug` is provided:
```tsx
{orgSlug && (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <Link href={`/${orgSlug}/docs`}>
        <FileText className="mr-2 h-4 w-4" />
        <span>Documents</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
)}
```

## OrgSwitcher Component

### Pattern
- Client component using `useState` + `useEffect`
- Fetches organizations via `authClient.organization.list()`
- Uses DropdownMenu for switching

### Important
- Renders inside `SidebarHeader`
- Needs `currentSlug` prop to highlight current org
- Shows loading state while fetching

## Layout Deletion
- `apps/web/app/(frontend)/(dashboard)/layout.tsx` was deleted
- `apps/web/app/(frontend)/(dashboard)/home/page.tsx` was deleted
- Org-specific layout at `[orgSlug]/layout.tsx` now handles everything

## Next.js App Router Params

### Params are Promises
```tsx
// Next.js 15+ requires awaiting params
export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  // ...
}
```

### Client Component with Params
```tsx
export default function Page({ params }: { params: Promise<{ orgSlug: string }> }) {
  const [resolvedParams, setResolvedParams] = React.useState<ResolvedType | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return <Loading />;

  return <Content orgSlug={resolvedParams.orgSlug} />;
}
```
