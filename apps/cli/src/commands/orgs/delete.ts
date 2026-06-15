import { log } from "@clack/prompts";
import { text } from "@clack/prompts";
import { authClient } from "../../lib/auth/client.js";
import { isTransientError, AuthFlowError } from "../../lib/auth/device-flow/errors.js";
import { withAuth } from "./with-auth.js";
import type { StoredCredentials } from "../../lib/auth/storage.js";

async function deleteOrg(credentials: StoredCredentials, orgSlug: string, skipConfirm: boolean): Promise<void> {
  // 1. Fetch org to get the ID and verify it exists
  log.info(`Fetching organization "${orgSlug}"...`);

  let orgData: Awaited<ReturnType<typeof authClient.organization.getFullOrganization>>["data"];
  let orgError: Awaited<ReturnType<typeof authClient.organization.getFullOrganization>>["error"];

  try {
    const result = await authClient.organization.getFullOrganization({
      query: { organizationSlug: orgSlug },
      fetchOptions: {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      },
    });
    orgData = result.data;
    orgError = result.error;
  } catch (err) {
    if (isTransientError(err)) {
      throw AuthFlowError.network("Cannot reach the auth server. Check your connection.");
    }
    throw AuthFlowError.network(`Network error: ${(err as Error).message}`);
  }

  if (orgError) {
    const code = orgError.error ?? "unknown_error";
    const desc = orgError.error_description ?? JSON.stringify(orgError);
    throw new AuthFlowError(`[${code}] ${desc}`);
  }

  if (!orgData || !orgData.name) {
    throw new AuthFlowError(`Organization not found: ${orgSlug}`);
  }

  const orgName = orgData.name;
  const orgId = orgData.id;

  // 2. Confirmation unless --yes
  if (!skipConfirm) {
    log.warn(`This will permanently delete "${orgName}" and all its data.`);
    const confirm = await text({
      message: `Type "${orgSlug}" to confirm:`,
      validate: (value) => (value === orgSlug ? undefined : `Please type "${orgSlug}" to confirm.`),
    });

    if (confirm !== orgSlug) {
      log.info("Deletion cancelled.");
      return;
    }
  }

  // 3. Delete
  log.info(`Deleting organization "${orgName}"...`);

  let error: Awaited<ReturnType<typeof authClient.organization.delete>>["error"];

  try {
    const result = await authClient.organization.delete({
      organizationId: orgId,
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

  log.success(`Organization "${orgName}" deleted.`);
}

// Wrapped version for internal use (credentials injected by withAuth)
const _delete = async (credentials: StoredCredentials, orgSlug: string, skipConfirm: boolean) =>
  deleteOrg(credentials, orgSlug, skipConfirm);

// Commander action: receives (slug, options) from Commander
export const deleteAction = async (slug: string, opts: { yes?: boolean }) => {
  const { requireAuth } = await import("./require-auth.js");
  const credentials = requireAuth();
  await deleteOrg(credentials, slug, opts.yes ?? false);
};
