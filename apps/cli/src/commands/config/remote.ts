import { log } from "@clack/prompts";
import { BASE_URL } from "../../lib/auth/client.js";

export const remote = (): void => {
  log.info(BASE_URL);
};
