"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@complete-web-template/api";

export const trpc = createTRPCReact<AppRouter>();

function getUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

let browserQueryClient: QueryClient | undefined;
let browserTrpcClient: ReturnType<typeof trpc.createClient> | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

function getTrpcClient() {
  if (typeof window === "undefined") {
    return trpc.createClient({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    });
  }
  if (!browserTrpcClient) {
    browserTrpcClient = trpc.createClient({
      links: [httpBatchLink({ url: "/api/trpc" })],
    });
  }
  return browserTrpcClient;
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const trpcClient = getTrpcClient();

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
