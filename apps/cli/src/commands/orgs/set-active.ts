import { log } from "@clack/prompts";
import { authClient } from "../../lib/auth/client.js";
import { isTransientError, AuthFlowError } from "../../lib/auth/device-flow/errors.js";
import { withAuth } from "./with-auth.js";
import type { StoredCredentials } from "../../lib/auth/storage.js";

const _setActive = async (credentials: StoredCredentials, orgSlug: string): Promise<void> => {
  log.info(`Setting active organization to "${orgSlug}"...`);

  let error: Awaited<ReturnType<typeof authClient.organization.setActive>>["error"];

  try {
    const result = await authClient.organization.setActive({
      organizationSlug: orgSlug,
      fetchOptions: {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      },
    });
    error = result.error;
  } catch (err) {
    if (isTransientError(err)) {
      throw AuthFlowError.network("Cannot reach the auth server. Check your connection.");
    }
    throw AuthFlowError.network(`Network error: ${(err as Error).message}`);
  }

  if (error) {
    const code = error.error ?? "unknown_error";
    const desc = error.error_description ?? JSON.stringify(error);
    throw new AuthFlowError(`[${code}] ${desc}`);
  }

  log.success(`Active organization set to "${orgSlug}".`);
};

export const setActive = withAuth(_setActive);
