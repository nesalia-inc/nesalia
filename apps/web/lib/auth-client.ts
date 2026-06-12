import { createAuthClient } from "better-auth/react"
import { deviceAuthorizationClient, organizationClient } from "better-auth/client/plugins"
import { env } from "@/lib/env"

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [
    deviceAuthorizationClient(),
    organizationClient(),
  ],
})

export const { signIn, signUp, useSession, getSession, listSessions, revokeSession, revokeOtherSessions, signOut, organization } = authClient