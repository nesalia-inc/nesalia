import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@complete-web-template/api";

export interface SDKOptions {
  /** Base URL of the API (default: http://localhost:3000) */
  baseUrl?: string;
  /** Custom headers (e.g., Authorization: Bearer token) */
  headers?: Record<string, string>;
}

export interface SDKClient {
  // Add tRPC routers here
}

export function createClient(options: SDKOptions = {}): SDKClient {
  const baseUrl = options.baseUrl ?? "http://localhost:3000";
  const headers = options.headers ?? {};

  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${baseUrl}/api/trpc`,
        headers: () => headers,
      }),
    ],
  });

  return {
    // Add tRPC procedures here
  };
}