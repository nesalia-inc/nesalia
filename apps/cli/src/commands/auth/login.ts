import { log } from "@clack/prompts";
import { saveCredentials, type StoredCredentials, startDeviceFlow } from "../../lib/auth/index.js";
import { AuthFlowError } from "../../lib/auth/device-flow/errors.js";

export const login = async (): Promise<void> => {
  try {
    const result = await startDeviceFlow();

    const credentials: StoredCredentials = {
      accessToken: result.accessToken,
      sessionToken: result.sessionToken,
      user: result.user,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    saveCredentials(credentials);
    log.success("Successfully logged in!");
  } catch (error) {
    if (error instanceof AuthFlowError) {
      if (error.isNetwork) {
        log.error(`Network error: ${error.message}`);
        log.step("Make sure the auth server is running and accessible.");
      } else {
        log.error(`Auth error: ${error.message}`);
      }
    } else {
      log.error(error instanceof Error ? error.message : "Unknown error");
    }
    process.exit(1);
  }
};