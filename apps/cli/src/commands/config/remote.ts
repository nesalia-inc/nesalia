import { log } from "@clack/prompts";
import { BASE_URL } from "../../lib/auth/client.js";

export const remote = (): void => {
  // BASE_URL is the configured default; show the effective URL
  const effectiveUrl = process.env.CLI_AUTH_API_URL ?? BASE_URL;
  log.info(effectiveUrl);
};
