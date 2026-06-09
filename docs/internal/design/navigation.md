# Navigation Menu — nesalia.com

> **Status:** Draft
> **Last Updated:** 2026-06-09

---

## Header Structure

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Logo    Products ▾    Solutions ▾    Learn ▾    Pricing    Blog    Docs    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Desktop (sticky)

- Transparent on top, solid on scroll
- Max-width container
- Links with hover states
- Dropdowns on hover/click

### Mobile

- Hamburger menu (Sheet component)
- Full-screen overlay
- Accordion sections for Products/Solutions/Learn

---

## Products Dropdown

### Items

| Item | URL | Description |
|------|-----|-------------|
| **Agents** | /agents | AI agents with memory and contexts |
| **Workflows** | /workflows | Automate with agent-centric workflows |
| **SDK** | /sdk | Build with TypeScript |
| **CLI** | /cli | Control from terminal |

### Divider

| Item | URL | Description |
|------|-----|-------------|
| **Marty Bot** | /marty | GitHub code reviewer |
| **GitHub Action** | /github-action | CI/CD integration |

### Divider

| Item | URL | Description |
|------|-----|-------------|
| **Analytics** | /analytics | Monitor performance |
| **Desktop** | /desktop | Native app (future) |
| **Mobile** | /mobile | iOS/Android app (future) |

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Products                                                      │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐                 │
│   │ Agents            │  │ Marty Bot         │                 │
│   │ AI agents...      │  │ GitHub reviewer   │                 │
│   └───────────────────┘  └───────────────────┘                 │
│                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐                 │
│   │ Workflows         │  │ GitHub Action     │                 │
│   │ Automate...       │  │ CI/CD trigger     │                 │
│   └───────────────────┘  └───────────────────┘                 │
│                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐                 │
│   │ SDK               │  │ Analytics        │                 │
│   │ TypeScript        │  │ Monitor...        │                 │
│   └───────────────────┘  └───────────────────┘                 │
│                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐                 │
│   │ CLI               │  │ Desktop          │                 │
│   │ Terminal          │  │ Native app        │                 │
│   └───────────────────┘  └───────────────────┘                 │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   ┌───────────────────┐                                        │
│   │ Mobile            │                                        │
│   │ iOS/Android       │                                        │
│   └───────────────────┘                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Solutions Dropdown

### Items

| Item | URL | Description |
|------|-----|-------------|
| **GitHub Automation** | /solutions/github | Code review & CI automation |
| **Software Factory** | /solutions/factory | Full SDLC with AI agents |
| **Workflow Automation** | /solutions/automation | Business process automation |

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Solutions                                                     │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ GitHub Automation                                        │   │
│   │ Automate code review, issues, and CI/CD with agents.   │   │
│   │ → Explore                                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Software Factory                                        │   │
│   │ From spec to deployment — fully automated with AI.      │   │
│   │ → Explore                                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Workflow Automation                                     │   │
│   │ Automate business processes with human-in-the-loop.     │   │
│   │ → Explore                                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Learn Dropdown

### Items

| Item | URL | Description |
|------|-----|-------------|
| **Documentation** | /docs | Full documentation |
| **Blog** | /blog | Tutorials and updates |
| **Changelog** | /changelog | Product updates |
| **Academy** | /academy | Learning platform (future) |
| **DeesseJS** | /deessejs | Framework landing |

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Learn                                                         │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐                 │
│   │ Documentation     │  │ Blog              │                 │
│   │ Get started...    │  │ Tutorials...      │                 │
│   └───────────────────┘  └───────────────────┘                 │
│                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐                 │
│   │ Changelog         │  │ Academy           │                 │
│   │ Product updates   │  │ Learn AI dev      │                 │
│   └───────────────────┘  └───────────────────┘                 │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   ┌───────────────────┐                                        │
│   │ DeesseJS          │                                        │
│   │ Laravel for TS    │                                        │
│   └───────────────────┘                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Top-Level Links

### Pricing

- Single link: `/pricing`
- No dropdown
- Primary CTA style (filled)

### Blog

- Single link: `/blog`
- Opens blog listing page
- Recent posts shown on hover (optional)

### Docs

- Single link: `/docs`
- Opens documentation homepage
- Quick links dropdown (optional)

---

## Right Side

### Unauthenticated

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo    Products ▾    Solutions ▾    Learn ▾    Pricing    Blog    Docs    Sign in    Get Started    │
└─────────────────────────────────────────────────────────────────┘
```

- **Sign in** — Ghost button
- **Get Started** — Primary button

### Authenticated

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo    Products ▾    Solutions ▾    Learn ▾    Pricing    Blog    Docs    🔔    Avatar ▾    │
└─────────────────────────────────────────────────────────────────┘
```

- **Bell icon** — Notifications
- **Avatar** — Dropdown menu:
  - Dashboard
  - Settings
  - API Keys
  - Sign out

---

## Mobile Menu

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  ✕                                                              │
│                                                                 │
│   Products ▾                                                    │
│   ├── Agents                                                    │
│   ├── Workflows                                                 │
│   ├── SDK                                                       │
│   ├── CLI                                                       │
│   ├── Marty Bot                                                 │
│   └── GitHub Action                                             │
│                                                                 │
│   Solutions ▾                                                   │
│   ├── GitHub Automation                                         │
│   ├── Software Factory                                          │
│   └── Workflow Automation                                       │
│                                                                 │
│   Learn ▾                                                       │
│   ├── Documentation                                             │
│   ├── Blog                                                      │
│   ├── Changelog                                                 │
│   └── DeesseJS                                                  │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   Pricing                                                       │
│   Blog                                                          │
│   Docs                                                          │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   Sign in                                                       │
│   Get Started                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dropdown Behavior

### Trigger

- Desktop: Hover (with delay to prevent accidental open)
- Mobile: Click to expand accordion-style

### Close

- Click outside
- Press Escape
- Click on link
- Click on another dropdown

### Animation

- Fade in + slide down
- 150-200ms duration
- No jarring movement

---

## Implementation

### Components

- `NavigationMenu` from shadcn/ui
- `DropdownMenu` for avatar menu
- `Sheet` for mobile menu
- `Accordion` for mobile sections

### Accessibility

- Keyboard navigation (arrow keys, Enter, Escape)
- ARIA labels on all interactive elements
- Focus trap in dropdowns
- Screen reader support

---

## Next Steps

1. [ ] Implement desktop dropdowns
2. [ ] Implement mobile menu
3. [ ] Add animations
4. [ ] Test responsive behavior