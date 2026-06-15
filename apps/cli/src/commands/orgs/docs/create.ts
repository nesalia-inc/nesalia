import { log } from "@clack/prompts";
import { TRPCClientError } from "@trpc/client";
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

const _create = async (
  credentials: StoredCredentials,
  orgSlug: string,
  name: string,
  opts: { type?: string; content?: string; tags?: string; visibility?: string },
): Promise<void> => {
  log.info(`Creating document "${name}"...`);

  try {
    const result = await trpcClient.organizationDocuments.create.mutate({
      orgId: orgSlug,
      name,
      type: (opts.type as "handbook" | "policy" | "template" | "note" | "knowledge") ?? "note",
      content: opts.content,
      tags: opts.tags ? opts.tags.split(",").map((t) => t.trim()) : undefined,
      visibility: (opts.visibility as "all" | "admins_only") ?? "all",
    });

    log.success(`Document created: ${result.name}`);
    log.info(`ID: ${result.id}`);
  } catch (err) {
    log.error(`Failed to create document: ${getErrorMessage(err)}`);
  }
};

export const create = withAuth(_create);
