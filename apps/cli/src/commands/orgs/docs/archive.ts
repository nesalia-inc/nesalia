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

const _archive = async (credentials: StoredCredentials, id: string): Promise<void> => {
  log.info(`Archiving document "${id}"...`);

  try {
    await trpcClient.organizationDocuments.archive.mutate({ id });
    log.success("Document archived.");
  } catch (err) {
    log.error(`Failed to archive document: ${getErrorMessage(err)}`);
  }
};

export const archive = withAuth(_archive);
