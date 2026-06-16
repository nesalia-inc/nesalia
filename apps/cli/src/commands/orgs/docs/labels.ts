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

async function findDocumentByNameOrId(credentials: StoredCredentials, orgId: string, identifier: string) {
  // Try as ID first
  try {
    return await trpcClient.organizationDocuments.get.query({ id: identifier });
  } catch {
    // Search by name
    const list = await trpcClient.organizationDocuments.list.query({ orgId });
    const match = list.find(
      (d) => d.name.toLowerCase() === identifier.toLowerCase(),
    );
    if (!match) {
      throw new Error(`Document not found: ${identifier}`);
    }
    return await trpcClient.organizationDocuments.get.query({ id: match.id });
  }
}

async function findLabelByTitleOrId(credentials: StoredCredentials, orgId: string, identifier: string) {
  try {
    return await trpcClient.labels.get.query({ orgId, labelId: identifier });
  } catch {
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

const _labelsList = async (credentials: StoredCredentials, orgSlug: string, identifier: string): Promise<void> => {
  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const doc = await findDocumentByNameOrId(credentials, orgId, identifier);

    const labels = await trpcClient.organizationDocuments.labels.list.query({
      documentId: doc.documentId,
    });

    if (labels.length === 0) {
      log.info(`No labels on document "${doc.name}".`);
      return;
    }

    log.info(`Labels on "${doc.name}":`);
    for (const label of labels) {
      log.info(`  • ${label.title} (${label.color})`);
    }
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to list labels: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to list labels: ${err.message}`);
    } else {
      log.error(`Failed to list labels: ${String(err)}`);
    }
  }
};

const _labelsSet = async (credentials: StoredCredentials, orgSlug: string, identifier: string, opts: { labels?: string }): Promise<void> => {
  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const doc = await findDocumentByNameOrId(credentials, orgId, identifier);

    const labelTitles = opts.labels ? opts.labels.split(",").map((t) => t.trim()) : [];
    const labelIds: string[] = [];

    for (const title of labelTitles) {
      const label = await findLabelByTitleOrId(credentials, orgId, title);
      labelIds.push(label.id);
    }

    log.info(`Setting ${labelIds.length} label${labelIds.length !== 1 ? "s" : ""} on "${doc.name}"...`);

    const result = await trpcClient.organizationDocuments.labels.set.mutate({
      documentId: doc.documentId,
      labelIds,
    });

    if (result.labels.length === 0) {
      log.success(`Labels cleared on "${doc.name}".`);
    } else {
      log.success(`Labels set on "${doc.name}":`);
      for (const label of result.labels) {
        log.info(`  • ${label.title}`);
      }
    }
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to set labels: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to set labels: ${err.message}`);
    } else {
      log.error(`Failed to set labels: ${String(err)}`);
    }
  }
};

const _labelsAdd = async (credentials: StoredCredentials, orgSlug: string, identifier: string, opts: { label?: string; labelId?: string }): Promise<void> => {
  const labelIdentifier = opts.label ?? opts.labelId;
  if (!labelIdentifier) {
    log.error("Provide --label <title> or --label-id <id>.");
    process.exit(2);
  }

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const doc = await findDocumentByNameOrId(credentials, orgId, identifier);
    const label = await findLabelByTitleOrId(credentials, orgId, labelIdentifier);

    log.info(`Adding label "${label.title}" to "${doc.name}"...`);

    const result = await trpcClient.organizationDocuments.labels.add.mutate({
      documentId: doc.documentId,
      labelId: label.id,
    });

    log.success(`Label added. Current labels on "${doc.name}":`);
    for (const l of result.labels) {
      log.info(`  • ${l.title}`);
    }
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to add label: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to add label: ${err.message}`);
    } else {
      log.error(`Failed to add label: ${String(err)}`);
    }
  }
};

const _labelsRemove = async (credentials: StoredCredentials, orgSlug: string, identifier: string, opts: { label?: string; labelId?: string }): Promise<void> => {
  const labelIdentifier = opts.label ?? opts.labelId;
  if (!labelIdentifier) {
    log.error("Provide --label <title> or --label-id <id>.");
    process.exit(2);
  }

  try {
    const orgId = await getOrgIdBySlug(credentials, orgSlug);
    const doc = await findDocumentByNameOrId(credentials, orgId, identifier);
    const label = await findLabelByTitleOrId(credentials, orgId, labelIdentifier);

    log.info(`Removing label "${label.title}" from "${doc.name}"...`);

    const result = await trpcClient.organizationDocuments.labels.remove.mutate({
      documentId: doc.documentId,
      labelId: label.id,
    });

    log.success(`Label removed. Current labels on "${doc.name}":`);
    if (result.labels.length === 0) {
      log.info(`  (none)`);
    } else {
      for (const l of result.labels) {
        log.info(`  • ${l.title}`);
      }
    }
  } catch (err) {
    if (err instanceof TRPCClientError) {
      log.error(`Failed to remove label: ${err.message}`);
    } else if (err instanceof Error) {
      log.error(`Failed to remove label: ${err.message}`);
    } else {
      log.error(`Failed to remove label: ${String(err)}`);
    }
  }
};

export const labelsList = withAuth(_labelsList);
export const labelsSet = withAuth(_labelsSet);
export const labelsAdd = withAuth(_labelsAdd);
export const labelsRemove = withAuth(_labelsRemove);