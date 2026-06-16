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

const _update = async (
  credentials: StoredCredentials,
  id: string,
  opts: { name?: string; content?: string },
): Promise<void> => {
  log.info(`Updating document "${id}"...`);

  try {
    const result = await trpcClient.organizationDocuments.update.mutate({
      id,
      name: opts.name,
      content: opts.content,
    });

    log.success(`Document updated: ${result.name}`);
  } catch (err) {
    log.error(`Failed to update document: ${getErrorMessage(err)}`);
  }
};

export const update = withAuth(_update);
