import { log } from "@clack/prompts";
import { authClient } from "../../lib/auth/client.js";
import { isTransientError, AuthFlowError } from "../../lib/auth/device-flow/errors.js";
import { withAuth } from "./with-auth.js";
import type { StoredCredentials } from "../../lib/auth/storage.js";

const _get = async (credentials: StoredCredentials, orgSlug: string): Promise<void> => {
  log.info(`Fetching organization "${orgSlug}"...`);

  let data: Awaited<ReturnType<typeof authClient.organization.getFullOrganization>>["data"];
  let error: Awaited<ReturnType<typeof authClient.organization.getFullOrganization>>["error"];

  try {
    const result = await authClient.organization.getFullOrganization({
      query: { organizationSlug: orgSlug },
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

  if (!data || !data.name) {
    throw new AuthFlowError(`Organization not found: ${orgSlug}`);
  }

  const createdAt = new Date(data.createdAt).toLocaleDateString();
  const members = data.members ?? [];

  log.success(`${data.name}`);
  log.info(`  Slug:     ${data.slug}`);
  log.info(`  Created:  ${createdAt}`);
  log.info(`  Members:  ${members.length}`);
};

export const get = withAuth(_get);
