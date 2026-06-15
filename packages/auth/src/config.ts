import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { apiKey } from "@better-auth/api-key";
import { bearer } from "better-auth/plugins/bearer";
import { deviceAuthorization } from "better-auth/plugins/device-authorization";
import { organization } from "better-auth/plugins";
import { db, user, session, account, verification, apikey, deviceCode, organization as organizationTable, member, invitation, eq } from "@complete-web-template/db";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const auth = betterAuth({
  baseURL: BASE_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      apikey,
      deviceCode,
      organization: organizationTable,
      member,
      invitation,
    },
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (userData) => {
          // Create personal org with user's name as default
          const name = userData.name ?? userData.email?.split("@")[0] ?? "Personal";
          const slug = generateSlug(name);

          const org = await db.insert(organizationTable).values({
            name,
            slug,
          }).returning({ id: organizationTable.id });

          // Add user as owner
          if (org[0]) {
            await db.insert(member).values({
              organizationId: org[0].id,
              userId: userData.id,
              role: "owner",
            });
          }
        },
      },
    },
    session: {
      create: {
        after: async (sessionData) => {
          // Auto-set the user's first org as active
          const firstOrg = await db
            .select({ id: member.organizationId })
            .from(member)
            .where(eq(member.userId, sessionData.userId))
            .limit(1);

          if (firstOrg[0]) {
            await db
              .update(session)
              .set({ activeOrganizationId: firstOrg[0].id })
              .where(eq(session.id, sessionData.id));
          }
        },
      },
    },
  },
  plugins: [
    apiKey({
      enableSessionForAPIKeys: true,
      apiKeyHeaders: ["x-api-key"],
    }),
    deviceAuthorization({
      schema: {},
      expiresIn: "30m",
      interval: "5s",
      userCodeLength: 8,
      deviceCodeLength: 40,
      verificationUri: (BASE_URL || "http://localhost:3000") + "/device",
    }),
    bearer(),
    organization({
      creatorRole: "owner",
    }),
  ],
});