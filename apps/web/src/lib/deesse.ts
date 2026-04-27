import { getDeesse } from "deesse";
import { config } from "@deesse-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deesse = await getDeesse(config as any);
export const deesseAuth = deesse.auth;