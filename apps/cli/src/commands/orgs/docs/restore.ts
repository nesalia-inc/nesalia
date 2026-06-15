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

const _restore = async (credentials: StoredCredentials, id: string): Promise<void> => {
  log.info(`Restoring document "${id}"...`);

  try {
    await trpcClient.organizationDocuments.restore.mutate({ id });
    log.success("Document restored.");
  } catch (err) {
    log.error(`Failed to restore document: ${getErrorMessage(err)}`);
  }
};

export const restore = withAuth(_restore);
