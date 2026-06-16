"use client";

import * as React from "react";
import { trpc } from "@/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentViewer } from "@/components/docs/document-viewer";
import { EditDocumentDialog } from "@/components/docs/edit-document-dialog";
import { DeleteDocumentDialog } from "@/components/docs/delete-document-dialog";
import { LabelChip } from "@/components/labels/label-chip";
import { LabelPicker } from "@/components/labels/label-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface DocumentPageProps {
  params: Promise<{ orgSlug: string; docId: string }>;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const [resolvedParams, setResolvedParams] = React.useState<{
    orgSlug: string;
    docId: string;
  } | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <DocumentPageContent
      orgSlug={resolvedParams.orgSlug}
      docId={resolvedParams.docId}
    />
  );
}

function DocumentPageContent({
  orgSlug,
  docId,
}: {
  orgSlug: string;
  docId: string;
}) {
  const { data: document, isLoading } = trpc.organizationDocuments.get.useQuery(
    { id: docId },
    {
      refetchOnWindowFocus: false,
    }
  );

  const [orgId, setOrgId] = React.useState<string | null>(null);

  React.useEffect(() => {
    authClient.organization.getFullOrganization({
      query: { organizationSlug: orgSlug },
    }).then((result) => {
      if (result?.data) {
        setOrgId(result.data.id);
      }
    });
  }, [orgSlug]);

  const { data: labels, isLoading: labelsLoading } = trpc.organizationDocuments.labels.list.useQuery(
    { documentId: document?.documentId ?? "" },
    { enabled: !!document?.documentId }
  );

  const queryClient = useQueryClient();

  const removeLabelMutation = trpc.organizationDocuments.labels.remove.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["organizationDocuments", "labels", "list"]] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Document not found</p>
        <Button variant="link" asChild className="mt-4">
          <Link href={`/${orgSlug}/docs`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to documents
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${orgSlug}/docs`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{document.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <EditDocumentDialog
              documentId={docId}
              currentName={document.name}
              currentType={document.type}
              currentContent={document.content}
              currentVisibility={document.visibility}
            />
            <DeleteDocumentDialog
              documentId={docId}
              documentName={document.name}
              orgSlug={orgSlug}
            />
          </div>
        </div>
        <DocumentViewer content={document.content} />
      </div>

      {/* Labels sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-4 space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Labels
              </h3>
              {orgId && document.documentId && (
                <LabelPicker
                  orgId={orgId}
                  documentId={document.documentId}
                  trigger={
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      + Add
                    </Button>
                  }
                />
              )}
            </div>
            {labelsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : labels && labels.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {labels.map((label) => (
                  <LabelChip
                    key={label.id}
                    label={label}
                    size="sm"
                    onRemove={() =>
                      removeLabelMutation.mutate({
                        documentId: document.documentId,
                        labelId: label.id,
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No labels — add one to categorize this document.
              </p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-sm mb-3">Document Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="capitalize">{document.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Visibility</dt>
                <dd className="capitalize">
                  {document.visibility === "admins_only" ? "Admins only" : "All members"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </aside>
    </div>
  );
}
