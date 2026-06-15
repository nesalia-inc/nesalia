import { log } from "@clack/prompts";
import { authClient } from "../../lib/auth/client.js";
import { isTransientError, AuthFlowError } from "../../lib/auth/device-flow/errors.js";
import { withAuth } from "./with-auth.js";
import type { StoredCredentials } from "../../lib/auth/storage.js";

const _list = async (credentials: StoredCredentials): Promise<void> => {
  log.info("Fetching your organizations...");

  let data: Awaited<ReturnType<typeof authClient.organization.list>>["data"];
  let error: Awaited<ReturnType<typeof authClient.organization.list>>["error"];

  try {
    const result = await authClient.organization.list({
      fetchOptions: {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      },
    });
    data = result.data;
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

  if (!data || data.length === 0) {
    log.info("You have no organizations yet.");
    return;
  }

  log.info(`You have ${data.length} organization${data.length > 1 ? "s" : ""}:`);
  for (const org of data) {
    const prefix = org.isOwner ? "•" : "○";
    log.info(`  ${prefix} ${org.name} (${org.slug})`);
  }
};

export const list = withAuth(_list);
