import { log } from "@clack/prompts";
import { loadCredentials, isExpired, clearCredentials, type StoredCredentials } from "../../lib/auth/storage.js";

/**
 * Verifies the user is logged in and returns credentials.
 * Exits if not authenticated or session expired.
 */
export function requireAuth(): StoredCredentials {
  const credentials = loadCredentials();

  if (!credentials) {
    log.error("You are not logged in.");
    log.step("Run 'nesalia auth login' to authenticate.");
    process.exit(1);
  }

  if (isExpired(credentials)) {
    log.warn("Your session has expired.");
    log.step("Run 'nesalia auth login' to authenticate again.");
    clearCredentials();
    process.exit(1);
  }

  return credentials;
}
