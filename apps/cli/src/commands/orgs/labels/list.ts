import { log } from "@clack/prompts";
import { TRPCClientError } from "@trpc/client";
import { authClient } from "../../../lib/auth/client.js";
import { trpcClient } from "../../../lib/api/client.js";
import { withAuth } from "../with-auth.js";
import type { StoredCredentials } from "../../../lib/auth/storage.js";

const LABEL_COLORS = [
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

function colorSwatch(color: string): string {
  const colorMap: Record<string, string> = {
    red: "🔴",
    orange: "🟠",
    yellow: "🟡",
    green: "🟢",
    teal: "🔵",
    blue: "🔵",
    indigo: "🟣",
    purple: "🟪",
    pink: "🌸",
    brown: "🟫",
    gray: "⚫",
    black: "⚫",
  };
  return colorMap[color] ?? "⚪";
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

const _list = async (credentials: StoredCredentials, orgSlug: string): Promise<void> => {
  log.info(`Fetching labels for "${orgSlug}"...`);

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);

    const result = await trpcClient.labels.list.query({
      orgId,
      sort: "title",
      perPage: 100,
    });

    if (result.data.length === 0) {
      log.info("No labels yet. Create your first label with:");
      log.info(`  nesalia labels create "Legal" --color red`);
      return;
    }

    log.info(`Found ${result.data.length} label${result.data.length > 1 ? "s" : ""}:`);
    for (const label of result.data) {
      const swatch = colorSwatch(label.color);
      const count = label.documentCount > 0 ? ` (${label.documentCount} doc${label.documentCount > 1 ? "s" : ""})` : "";
      const desc = label.description ? ` — ${label.description}` : "";
      log.info(`  ${swatch} ${label.title}${count}${desc}`);
    }
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to fetch labels: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to fetch labels: ${err.message}`);
    } else {
      log.error(`Failed to fetch labels: ${String(err)}`);
    }
  }
};

export const list = withAuth(_list);