import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DocumentList } from "@/components/docs/document-list";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

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
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground">
          Manage your organization's documents
        </p>
      </div>
      <DocumentList orgId={org.id} orgSlug={orgSlug} />
    </div>
  );
}
