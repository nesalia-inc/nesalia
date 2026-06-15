import { log } from "@clack/prompts";
import open from "open";
import type { AuthClient } from "../client.js";
import { CLIENT_ID, SCOPE } from "./config.js";
import { AuthFlowError, isTransientError } from "./errors.js";

export interface DeviceCodeResult {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  interval: number;
}

export const requestDeviceCode = async (client: AuthClient): Promise<DeviceCodeResult> => {
  log.info("Requesting device authorization...");

  let data: Awaited<ReturnType<AuthClient["device"]["code"]>>["data"];
  let error: Awaited<ReturnType<AuthClient["device"]["code"]>>["error"];

  try {
    const result = await client.device.code({
      client_id: CLIENT_ID,
      scope: SCOPE,
    });
    data = result.data;
    error = result.error;
  } catch (err) {
    if (isTransientError(err)) {
      throw AuthFlowError.network(
        `Cannot reach the auth server. Check your internet connection or the server may be down.`,
      );
    }
    throw AuthFlowError.network(
      `Network error while requesting device code: ${(err as Error).message}`,
    );
  }

  if (error) {
    const code = error.error ?? "unknown_error";
    const desc = error.error_description ?? "No description provided";
    throw new AuthFlowError(`[${code}] ${desc}`);
  }

  if (!data) {
    throw new AuthFlowError(
      "Empty response from server. The auth server may be misconfigured.",
    );
  }

  return {
    deviceCode: data.device_code,
    userCode: data.user_code,
    verificationUri: data.verification_uri_complete,
    interval: data.interval ?? 5,
  };
};

export const openBrowser = async (uri: string): Promise<void> => {
  await open(uri).catch(() => {
    // Non-fatal: browser may fail to open, user can still use the URL
  });
};