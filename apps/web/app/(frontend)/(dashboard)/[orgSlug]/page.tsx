import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function OrgPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const org = await auth.api.getFullOrganization({
    query: { organizationSlug: orgSlug },
    headers: await headers(),
  });

  if (!org) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{org.name}</h1>
        <p className="text-muted-foreground">slug: {org.slug}</p>
      </div>

      {org.members && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Members ({org.members.length})
          </h2>
          <ul className="space-y-1">
            {org.members.map((member) => (
              <li key={member.id} className="text-sm">
                {member.user?.name} ({member.user?.email}) - {member.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}