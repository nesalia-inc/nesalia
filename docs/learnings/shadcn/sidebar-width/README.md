# Sidebar Width Customization in shadcn/ui

## What is it?

shadcn/ui's sidebar component uses CSS custom properties (variables) to control its width. The default width values are defined as constants in the component and can be overridden via the `style` prop on `SidebarProvider`.

## Why use it?

You would customize the sidebar width when:
- The default 16rem (256px) is too narrow or too wide for your layout
- You need a wider sidebar for more navigation items or longer labels
- You want a narrower sidebar to save screen space
- You need different widths for desktop vs mobile views

## How to use it (Step by Step)

### Method 1: Via SidebarProvider style prop (Recommended)

Pass CSS variables directly to the `SidebarProvider` component:

```tsx
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar"

export function MyLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "20rem",        // Desktop width (default: 16rem)
        "--sidebar-width-mobile": "18rem",  // Mobile width (default: 18rem)
      }}
    >
      <Sidebar>
        {/* Your sidebar content */}
      </Sidebar>
    </SidebarProvider>
  )
}
```

### Method 2: Inline style on Sidebar

For a specific sidebar instance without affecting the global provider:

```tsx
<Sidebar
  style={{
    "--sidebar-width": "20rem",
  }}
>
  {/* Your sidebar content */}
</Sidebar>
```

### Method 3: CSS class with Tailwind arbitrary values

```tsx
<div
  className="w-[20rem]"  // Using Tailwind arbitrary value
  data-slot="sidebar"
>
  {/* Your sidebar content */}
</Sidebar>
```

## Default Width Values

From `components/ui/sidebar.tsx`:

| Constant | Default Value | Purpose |
|----------|---------------|---------|
| `SIDEBAR_WIDTH` | `"16rem"` | Desktop sidebar width |
| `SIDEBAR_WIDTH_MOBILE` | `"18rem"` | Mobile sidebar width |
| `SIDEBAR_WIDTH_ICON` | `"3rem"` | Collapsed icon-only sidebar width |

## Code Examples

### Basic: Simple width increase

```tsx
<SidebarProvider style={{ "--sidebar-width": "18rem" }}>
  <Sidebar>
    <SidebarHeader>
      <AppLogo />
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>Navigation</SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

### Advanced: Different widths for different layouts

```tsx
function AdaptiveSidebar() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <SidebarProvider
      open={isExpanded}
      onOpenChange={setIsExpanded}
      style={{
        "--sidebar-width": isExpanded ? "20rem" : "4rem",
        "--sidebar-width-mobile": "20rem",
      }}
    >
      <Sidebar>
        <SidebarHeader>
          {isExpanded ? <FullLogo /> : <IconLogo />}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {isExpanded ? <FullMenu /> : <IconMenu />}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  )
}
```

### Using with collapsible="icon" mode

When using icon collapse mode, the sidebar transitions between full width and icon width:

```tsx
<SidebarProvider
  style={{
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",  // Width when collapsed to icons
  }}
>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarMenuButton tooltip="Dashboard">
        <DashboardIcon />
        <span>Dashboard</span>
      </SidebarMenuButton>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

## Configuration Options

### CSS Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `--sidebar-width` | Desktop sidebar width | `16rem` |
| `--sidebar-width-mobile` | Mobile sidebar width | `18rem` |
| `--sidebar-width-icon` | Collapsed icon sidebar width | `3rem` |

### Sidebar Props

| Prop | Values | Description |
|------|--------|-------------|
| `side` | `"left"` / `"right"` | Side of the sidebar |
| `variant` | `"sidebar"` / `"floating"` / `"inset"` | Visual style |
| `collapsible` | `"offcanvas"` / `"icon"` / `"none"` | Collapse behavior |
| `dir` | `"rtl"` / `"ltr"` | Text direction |

### SidebarProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `defaultOpen` | `boolean` | Default open state |
| `open` | `boolean` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | State change callback |

## Common Patterns

### Wide sidebar for documentation sites

```tsx
<SidebarProvider
  style={{
    "--sidebar-width": "18rem",
    "--sidebar-width-mobile": "16rem",
  }}
>
```

### Narrow sidebar for toolbars

```tsx
<SidebarProvider
  style={{
    "--sidebar-width": "12rem",
  }}
>
```

### Adjusting with responsive layouts

The sidebar automatically handles mobile vs desktop via the `--sidebar-width-mobile` variable. On mobile devices, the sidebar is shown as an off-canvas sheet.

## Gotchas and Troubleshooting

1. **Width not changing**: Make sure you're setting the CSS variable on the `SidebarProvider`, not just the `Sidebar` component. The sidebar container uses the variable from context.

2. **Mobile sidebar still showing old width**: Set both `--sidebar-width` and `--sidebar-width-mobile` separately - they control different rendering paths.

3. **Collapsed state has wrong width**: Use `--sidebar-width-icon` to control the icon-only collapsed width.

4. **Tailwind arbitrary values may not work**: The sidebar uses `w-(--sidebar-width)` which is a CSS variable reference. Direct Tailwind arbitrary values like `w-[20rem]` bypass the CSS variable system and may not work with the component's internal sizing.

5. **Width transition animation**: The sidebar already has smooth width transitions built in via `transition-[width]` classes. You don't need to add additional transition classes.

## Related Concepts

- [shadcn/ui Sidebar Component](https://ui.shadcn.com/docs/components/sidebar)
- Radix UI primitives used internally
- CSS custom properties (variables)

## Sources

- [shadcn/ui Sidebar Documentation](https://ui.shadcn.com/docs/components/sidebar)