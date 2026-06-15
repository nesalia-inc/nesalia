import { log } from "@clack/prompts";
import { authClient } from "../../../lib/auth/client.js";
import { isTransientError, AuthFlowError } from "../../../lib/auth/device-flow/errors.js";
import { withAuth } from "../with-auth.js";
import type { StoredCredentials } from "../../../lib/auth/storage.js";

const _listMembers = async (credentials: StoredCredentials, orgSlug?: string): Promise<void> => {
  const query = orgSlug ? { organizationSlug: orgSlug } : {};
  log.info(orgSlug ? `Fetching members of "${orgSlug}"...` : "Fetching members of active organization...");

  let data: Awaited<ReturnType<typeof authClient.organization.listMembers>>["data"];
  let error: Awaited<ReturnType<typeof authClient.organization.listMembers>>["error"];

  try {
    const result = await authClient.organization.listMembers({
      query,
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

  const members = data?.members ?? [];
  if (members.length === 0) {
    log.info("No members found.");
    return;
  }

  log.info(`Members (${members.length}):`);
  for (const member of members) {
    const name = member.user?.name ?? member.user?.email ?? "Unknown";
    log.info(`  • ${name} — ${member.role}`);
  }
};

export const listMembers = withAuth(_listMembers);
