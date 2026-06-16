import { log } from "@clack/prompts";
import { TRPCClientError } from "@trpc/client";
import { authClient } from "../../../lib/auth/client.js";
import { trpcClient } from "../../../lib/api/client.js";
import { withAuth } from "../with-auth.js";
import type { StoredCredentials } from "../../../lib/auth/storage.js";

const VALID_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
  "gray",
  "black",
] as const;

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
  // Try as ID first
  try {
    return await trpcClient.labels.get.query({ orgId, labelId: identifier });
  } catch {
    // Try by title
    const list = await trpcClient.labels.list.query({ orgId, perPage: 100 });
    const match = list.data.find(
      (l) => l.title.toLowerCase() === identifier.toLowerCase(),
    );
    if (!match) {
      throw new Error(`Label not found: ${identifier}`);
    }
    return await trpcClient.labels.get.query({ orgId, labelId: match.id });
  }
}

const _update = async (
  credentials: StoredCredentials,
  orgSlug: string,
  identifier: string,
  opts: { to?: string; color?: string; description?: string },
): Promise<void> => {
  if (!opts.to && !opts.color && opts.description === undefined) {
    log.error("No updates provided. Use --to, --color, or --description.");
    process.exit(2);
  }

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const label = await findLabelByTitleOrId(credentials, orgId, identifier);

    log.info(`Updating label "${label.title}"...`);

    const result = await trpcClient.labels.update.mutate({
      orgId,
      labelId: label.id,
      title: opts.to,
      color: opts.color as (typeof VALID_COLORS)[number] | undefined,
      description: opts.description,
    });

    log.success(`Label updated: ${result.title}`);
  } catch (err) {
    if (err instanceof TRPCClientError) {
      if (err.message.includes("already exists")) {
        log.error(`A label with this title already exists.`);
        process.exit(4);
      }
      log.error(`Failed to update label: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to update label: ${err.message}`);
    } else {
      log.error(`Failed to update label: ${String(err)}`);
    }
    process.exit(1);
  }
};

export const update = withAuth(_update);