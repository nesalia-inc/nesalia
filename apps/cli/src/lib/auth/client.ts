import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient, organizationClient } from "better-auth/client/plugins";

// Detect: running from node_modules (published) → prod, else → local dev
const isLocalDev = process.argv[1]?.includes("github/nsa") ?? false;
export const BASE_URL = process.env.CLI_AUTH_API_URL ?? (isLocalDev ? "http://localhost:3000" : "https://nesalia.com");

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    deviceAuthorizationClient(),
    organizationClient(),
  ],
});

export type AuthClient = typeof authClient;
