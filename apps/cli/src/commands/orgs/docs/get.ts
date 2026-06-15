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

const _get = async (credentials: StoredCredentials, id: string): Promise<void> => {
  log.info(`Fetching document "${id}"...`);

  try {
    const result = await trpcClient.organizationDocuments.get.query({ id });

    log.success(`Document: ${result.name}`);
    log.info(`Type: ${result.type}`);
    log.info(`Visibility: ${result.visibility}`);
    log.info(`Tags: ${result.tags?.join(", ") ?? "none"}`);

    if (result.content) {
      log.info("\n--- Content ---");
      log.info(result.content);
      log.info("--- End ---");
    }
  } catch (err) {
    log.error(`Failed to fetch document: ${getErrorMessage(err)}`);
  }
};

export const get = withAuth(_get);
