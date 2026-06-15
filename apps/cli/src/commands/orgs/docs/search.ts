import { log } from "@clack/prompts";
import { TRPCClientError } from "@trpc/client";
import { authClient } from "../../../lib/auth/client.js";
import { trpcClient } from "../../../lib/api/client.js";
import { withAuth } from "../with-auth.js";
import type { StoredCredentials } from "../../../lib/auth/storage.js";

function getErrorMessage(err: unknown): string {
  if (err instanceof TRPCClientError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

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

const _search = async (
  credentials: StoredCredentials,
  orgSlug: string,
  query: string,
  opts: { type?: string; tags?: string },
): Promise<void> => {
  log.info(`Searching documents in "${orgSlug}" for "${query}"...`);

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);

    const result = await trpcClient.organizationDocuments.search.query({
      orgId,
      query,
      type: opts.type as "handbook" | "policy" | "template" | "note" | "knowledge" | undefined,
      tags: opts.tags ? opts.tags.split(",").map((t) => t.trim()) : undefined,
    });

    if (result.length === 0) {
      log.info("No documents found matching your search.");
      return;
    }

    log.info(`Found ${result.length} result${result.length > 1 ? "s" : ""}:`);
    for (const doc of result) {
      log.info(`  • ${doc.name} (${doc.type})`);
    }
  } catch (err) {
    log.error(`Failed to search documents: ${getErrorMessage(err)}`);
  }
};

export const search = withAuth(_search);
