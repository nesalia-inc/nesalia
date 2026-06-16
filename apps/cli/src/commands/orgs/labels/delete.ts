import { isCancel, confirm } from "@clack/prompts";
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
  try {
    return await trpcClient.labels.get.query({ orgId, labelId: identifier, includeCount: true });
  } catch {
    const list = await trpcClient.labels.list.query({ orgId, perPage: 100 });
    const match = list.data.find(
      (l) => l.title.toLowerCase() === identifier.toLowerCase(),
    );
    if (!match) {
      throw new Error(`Label not found: ${identifier}`);
    }
    return await trpcClient.labels.get.query({ orgId, labelId: match.id, includeCount: true });
  }
}

const _deleteAction = async (
  credentials: StoredCredentials,
  orgSlug: string,
  identifier: string,
  opts: { force?: boolean; yes?: boolean },
): Promise<void> => {
  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const label = await findLabelByTitleOrId(credentials, orgId, identifier);

    if (label.documentCount > 0 && !opts.force) {
      log.error(
        `This label is in use by ${label.documentCount} document${label.documentCount > 1 ? "s" : ""}.`,
      );
      log.info(`Use --force to detach the label from all documents, then delete.`);
      process.exit(5);
    }

    if (!opts.yes) {
      const confirmed = await confirm({
        message: `Delete label "${label.title}"?${label.documentCount > 0 ? ` ${label.documentCount} document${label.documentCount > 1 ? "s" : ""} will lose this label.` : ""}`,
        active: "Delete",
        inactive: "Cancel",
      });

      if (isCancel(confirmed) || !confirmed) {
        log.info("Cancelled.");
        return;
      }
    }

    log.info(`Deleting label "${label.title}"...`);

    await trpcClient.labels.delete.mutate({
      orgId,
      labelId: label.id,
      force: opts.force ?? false,
    });

    log.success(`Label deleted: ${label.title}`);
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to delete label: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to delete label: ${err.message}`);
    } else {
      log.error(`Failed to delete label: ${String(err)}`);
    }
    process.exit(1);
  }
};

export const deleteAction = withAuth(_deleteAction);