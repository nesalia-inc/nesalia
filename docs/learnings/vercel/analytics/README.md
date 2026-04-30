# Vercel Analytics

## What is it?

Vercel Analytics is a built-in web analytics solution provided by the Vercel platform. It provides detailed insights into your website's visitors without requiring third-party services. Key features include:

- **Visitor tracking**: Identifies unique visitors using a hash (not cookies), reset daily for privacy
- **Page view tracking**: Counts total page views per URL
- **Bounce rate metrics**: Percentage of visitors who leave without further action
- **Demographics**: Country, OS, browser, and device information
- **Custom events**: Track specific user interactions like button clicks, form submissions, or purchases
- **Privacy-friendly**: Anonymized data, no cookies, configurable data retention

## Why use it?

Vercel Analytics is the right choice when:

- You are deploying to Vercel and want a zero-configuration analytics solution
- You need privacy-compliant analytics without cookie consent banners
- You want to track basic metrics (page views, visitors, bounce rate) out of the box
- You need custom event tracking on Pro and Enterprise plans
- You want to avoid integrating third-party analytics services like Google Analytics

## How to use it (Step by Step)

### 1. Enable Web Analytics in Vercel Dashboard

1. Navigate to your project in the Vercel dashboard
2. Go to **Analytics** in the sidebar
3. Click the **Enable** button

This will add new routes (`/_vercel/insights/*` and `/<unique-path>/*`) after your next deployment.

### 2. Install the package

```bash
npm install @vercel/analytics
```

### 3. Add the Analytics component to your Next.js App Router project

In `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

For Next.js Pages Router, in `pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

### 4. Deploy to Vercel

```bash
vercel deploy
```

After deployment, analytics will start tracking visitors and page views automatically.

### 5. View your data

Go to your Vercel dashboard, select your project, and click **Analytics** in the sidebar.

## When to use it?

**Use Vercel Analytics when:**
- Your app is deployed on Vercel
- You need basic page view and visitor analytics
- Privacy compliance is important (no cookies, anonymized data)
- You want zero-configuration analytics for simple use cases

**Do NOT use Vercel Analytics when:**
- You need advanced analytics features like session recording or heatmaps
- You need cross-site user tracking across multiple domains
- You require real-time analytics with sub-minute granularity
- You are not deploying to Vercel

## Code Examples

### Basic Setup (Next.js App Router)

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Event Tracking (Client-Side)

```tsx
import { track } from '@vercel/analytics';

function SignupButton() {
  return (
    <button
      onClick={() => {
        track('Signup', { location: 'footer' });
      }}
    >
      Sign Up
    </button>
  );
}
```

### Custom Event Tracking (Server-Side / Server Actions)

```tsx
// app/actions.ts
'use server';
import { track } from '@vercel/analytics/server';

export async function purchase(formData: FormData) {
  // Your purchase logic here
  await track('Item purchased', {
    quantity: 1,
    productId: formData.get('productId'),
  });
}
```

### Advanced Configuration with beforeSend

```tsx
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics
          beforeSend={(event: BeforeSendEvent) => {
            // Remove sensitive query parameters
            const url = new URL(event.url);
            url.searchParams.delete('secret');
            url.searchParams.delete('token');

            // Ignore private routes
            if (url.pathname.includes('/private')) {
              return null;
            }

            return {
              ...event,
              url: url.toString(),
            };
          }}
        />
      </body>
    </html>
  );
}
```

### User Opt-Out

```tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics
          beforeSend={(event) => {
            if (localStorage.getItem('va-disable')) {
              return null;
            }
            return event;
          }}
        />
      </body>
    </html>
  );
}

// To opt-out, call: localStorage.setItem('va-disable', 'true')
```

### Debug Mode

```tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics debug />
      </body>
    </html>
  );
}
```

Debug mode is automatically enabled in development and test environments (`NODE_ENV=development` or `NODE_ENV=test`).

### Force Production Mode

```tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics mode="production" />
      </body>
    </html>
  );
}
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `mode` | `'auto' \| 'development' \| 'production'` | Override automatic environment detection |
| `debug` | `boolean` | Enable debug mode (console logging of events) |
| `beforeSend` | `(event: BeforeSendEvent) => BeforeSendEvent \| null` | Modify or filter events before sending |
| `eventEndpoint` | `string` | Custom endpoint for custom events |
| `viewEndpoint` | `string` | Custom endpoint for page views |
| `scriptSrc` | `string` | Custom script source URL |

### BeforeSendEvent Type

```ts
interface BeforeSendEvent {
  url: string;          // The page URL
  event: string;         // Event name (for custom events)
  // For page views, event is 'page_view'
}
```

## Common Patterns

### 1. Track button clicks

```tsx
import { track } from '@vercel/analytics';

<button onClick={() => track('Button Click', { button: 'signup' })}>
  Sign Up
</button>
```

### 2. Track form submissions

```tsx
import { track } from '@vercel/analytics';

async function handleSubmit(formData: FormData) {
  // Submit form logic
  await track('Form Submitted', {
    formName: 'contact',
    success: true,
  });
}
```

### 3. Track page views with metadata

```tsx
import { track } from '@vercel/analytics';

// In a page component
useEffect(() => {
  track('Page Viewed', {
    page: window.location.pathname,
  });
}, []);
```

### 4. Exclude internal traffic

```tsx
<Analytics
  beforeSend={(event) => {
    if (event.url.includes('_vercel')) {
      return null;
    }
    return event;
  }}
/>
```

## Gotchas and Troubleshooting

### Server-side events fail with 401 Unauthorized

If your project has Deployment Protection enabled (Vercel Authentication or Password Protection), server-side `track()` calls may fail. To resolve this:

1. Create a [Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) secret in your project settings
2. This sets the `VERCEL_AUTOMATION_BYPASS_SECRET` environment variable
3. The `@vercel/analytics/server` module automatically uses this header

### Debug mode not working on server-side events

Set the `VERCEL_WEB_ANALYTICS_DISABLE_LOGS` environment variable to `true` to disable server-side debug logs.

### Custom event data limitations

- Maximum number of custom data properties depends on your plan
- Nested objects are not supported
- Allowed values: strings, numbers, booleans, and null
- Maximum length for event names, keys, and values: 255 characters

### Bots are automatically excluded

Vercel Analytics automatically filters out bot traffic by inspecting the User-Agent header.

### Version 2 changes

- `@vercel/analytics` is now MIT licensed
- Uses Vercel's Resilient Intake for improved script loading
- For Nuxt: uses the new module system
- The `endpoint` option is deprecated; use `eventEndpoint` and `viewEndpoint` instead

## Related Concepts

- [Next.js Caching](../nextjs/caching/README.md) - Understanding how Next.js caching works complements analytics
- [ISR (Incremental Static Regeneration)](../nextjs/isr/README.md) - Static generation patterns that work well with analytics

## Sources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [Quickstart Guide](https://vercel.com/docs/analytics/quickstart)
- [Custom Events](https://vercel.com/docs/analytics/custom-events)
- [Package Configuration](https://vercel.com/docs/analytics/package)
- [Redacting Sensitive Data](https://vercel.com/docs/analytics/redacting-sensitive-data)