"use client";

import * as React from "react";
import { trpc } from "@/trpc";
import { DocumentViewer } from "@/components/docs/document-viewer";
import { EditDocumentDialog } from "@/components/docs/edit-document-dialog";
import { DeleteDocumentDialog } from "@/components/docs/delete-document-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-6">
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
  );
}
