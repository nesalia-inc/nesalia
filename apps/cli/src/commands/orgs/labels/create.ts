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

const _create = async (
  credentials: StoredCredentials,
  orgSlug: string,
  title: string,
  opts: { color: string; description?: string },
): Promise<void> => {
  const color = opts.color.toLowerCase();

  if (!VALID_COLORS.includes(color as (typeof VALID_COLORS)[number])) {
    log.error(
      `Invalid color "${color}". Must be one of: ${VALID_COLORS.join(", ")}`,
    );
    process.exit(2);
  }

  if (!title || title.trim().length === 0) {
    log.error("Label title is required.");
    process.exit(2);
  }

  if (title.length > 50) {
    log.error("Label title must be 50 characters or fewer.");
    process.exit(2);
  }

  log.info(`Creating label "${title}"...`);

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);

    const result = await trpcClient.labels.create.mutate({
      orgId,
      title: title.trim(),
      color: color as (typeof VALID_COLORS)[number],
      description: opts.description,
    });

    log.success(`Label created: ${result.title}`);
    log.info(`ID: ${result.id}`);
  } catch (err) {
    if (err instanceof TRPCClientError) {
      if (err.message.includes("already exists")) {
        log.error(`A label with this title already exists.`);
        log.info(`Use "nesalia labels update "${title}" --color ${color}" to change it.`);
        process.exit(4);
      }
      log.error(`Failed to create label: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to create label: ${err.message}`);
    } else {
      log.error(`Failed to create label: ${String(err)}`);
    }
    process.exit(1);
  }
};

export const create = withAuth(_create);