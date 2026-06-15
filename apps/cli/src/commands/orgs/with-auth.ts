import { requireAuth } from "./require-auth.js";
import type { StoredCredentials } from "../../lib/auth/storage.js";

export function withAuth<T extends unknown[]>(
  fn: (credentials: StoredCredentials, ...args: T) => Promise<void>,
): (...args: T) => Promise<void> {
  return async (...args) => {
    const credentials = requireAuth();
    await fn(credentials, ...args);
  };
}
