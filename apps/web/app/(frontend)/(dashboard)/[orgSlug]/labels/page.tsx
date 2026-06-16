"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { LabelList } from "@/components/labels/label-list";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function LabelsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [org, setOrg] = React.useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    authClient.organization.getFullOrganization({
      query: { organizationSlug: orgSlug },
    }).then((result) => {
      if (result?.data) {
        setOrg({ id: result.data.id, name: result.data.name });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [orgSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!org) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold">Labels</h1>
        <p className="text-muted-foreground mt-1">
          Manage labels for {org.name}
        </p>
      </div>
      <LabelList orgId={org.id} />
    </div>
  );
}