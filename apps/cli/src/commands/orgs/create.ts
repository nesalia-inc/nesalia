import { log } from "@clack/prompts";
import { authClient } from "../../lib/auth/client.js";
import { isTransientError, AuthFlowError } from "../../lib/auth/device-flow/errors.js";
import { withAuth } from "./with-auth.js";
import type { StoredCredentials } from "../../lib/auth/storage.js";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const _create = async (credentials: StoredCredentials, name: string): Promise<void> => {
  const slug = generateSlug(name);

  if (!slug) {
    throw new AuthFlowError("Invalid organization name. Use letters, numbers, and hyphens only.");
  }

  log.info(`Creating organization "${name}"...`);

  let data: Awaited<ReturnType<typeof authClient.organization.create>>["data"];
  let error: Awaited<ReturnType<typeof authClient.organization.create>>["error"];

  try {
    const result = await authClient.organization.create({
      name,
      slug,
      fetchOptions: {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      },
    });
    data = result.data;
    error = result.error;
  } catch (err) {
    if (isTransientError(err)) {
      throw AuthFlowError.network("Cannot reach the auth server. Check your connection.");
    }
    throw AuthFlowError.network(`Network error: ${(err as Error).message}`);
  }

  if (error) {
    const code = error.error ?? "unknown_error";
    const desc = error.error_description ?? JSON.stringify(error);
    throw new AuthFlowError(`[${code}] ${desc}`);
  }

  if (!data) {
    throw new AuthFlowError("Empty response from server.");
  }

  log.success(`Created organization: ${data.name} (${data.slug})`);
};

export const create = withAuth(_create);
