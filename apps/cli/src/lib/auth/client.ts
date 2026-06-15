import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient, organizationClient } from "better-auth/client/plugins";
import { resolve } from "node:path";

// Detect: running from local repo → local dev, else → prod
const getScriptPath = () => {
  // process.argv[1] is the script path; resolve it to absolute
  if (process.argv[1]) {
    return resolve(process.cwd(), process.argv[1]);
  }
  return "";
};
// Normalize backslashes to forward slashes for cross-platform matching
const isLocalDev = getScriptPath().replace(/\\/g, "/").includes("github/nsa");
export const BASE_URL = process.env.CLI_AUTH_API_URL ?? (isLocalDev ? "http://localhost:3000" : "https://nesalia.com");

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    deviceAuthorizationClient(),
    organizationClient(),
  ],
});

export type AuthClient = typeof authClient;
