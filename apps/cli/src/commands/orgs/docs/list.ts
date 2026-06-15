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

const _list = async (credentials: StoredCredentials, orgSlug: string, opts: { type?: string; archived?: boolean }): Promise<void> => {
  log.info(`Fetching documents for "${orgSlug}"...`);

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);

    const result = await trpcClient.organizationDocuments.list.query({
      orgId,
      type: opts.type as "handbook" | "policy" | "template" | "note" | "knowledge" | undefined,
      archived: opts.archived ?? false,
    });

    if (result.length === 0) {
      log.info("No documents found.");
      return;
    }

    log.info(`Found ${result.length} document${result.length > 1 ? "s" : ""}:`);
    for (const doc of result) {
      const visibility = doc.visibility === "admins_only" ? " [admin]" : "";
      const archived = doc.archivedAt ? " [archived]" : "";
      log.info(`  • ${doc.name} (${doc.type})${visibility}${archived}`);
    }
  } catch (err) {
    log.error(`Failed to fetch documents: ${getErrorMessage(err)}`);
  }
};

export const list = withAuth(_list);
