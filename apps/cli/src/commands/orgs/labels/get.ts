import { log } from "@clack/prompts";
import { TRPCClientError } from "@trpc/client";
import { authClient } from "../../../lib/auth/client.js";
import { trpcClient } from "../../../lib/api/client.js";
import { withAuth } from "../with-auth.js";
import type { StoredCredentials } from "../../../lib/auth/storage.js";

async function getOrgIdBySlug(credentials: StoredCredentials, orgSlug: string): Promise<string> {
  const result = await authClient.organization.getFullOrganization({
    query: { organizationSlug: orgSlug },
    fetchOptions: {
      headers: { Authorization: `Bearer ${credentials.sessionToken}` },
    },
  });

  if (result.error) {
    throw new Error(`Organization not found: ${orgSlug}`);
  }

  return result.data.id;
}

async function findLabelByTitleOrId(credentials: StoredCredentials, orgId: string, identifier: string) {
  // Try as ID first, then search by title
  const byId = await trpcClient.labels.get.query({ orgId, labelId: identifier, includeCount: true });
  return byId;
}

const _get = async (credentials: StoredCredentials, orgSlug: string, identifier: string, opts: { includeCount?: boolean }): Promise<void> => {
  log.info(`Fetching label "${identifier}"...`);

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const label = await findLabelByTitleOrId(credentials, orgId, identifier);

    log.success(`${label.title}`);
    log.info(`  ID:       ${label.id}`);
    log.info(`  Color:    ${label.color}`);
    if (label.description) {
      log.info(`  Description: ${label.description}`);
    }
    log.info(`  Documents: ${label.documentCount}`);
    log.info(`  Created:   ${new Date(label.createdAt).toLocaleDateString()}`);
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to fetch label: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to fetch label: ${err.message}`);
    } else {
      log.error(`Failed to fetch label: ${String(err)}`);
    }
  }
};

export const get = withAuth(_get);