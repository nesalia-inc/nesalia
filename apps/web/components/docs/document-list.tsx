"use client";

import { useState } from "react";
import { trpc } from "@/trpc";
import { DocumentCard } from "./document-card";
import { CreateDocumentDialog } from "./create-document-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2, Archive } from "lucide-react";

interface DocumentListProps {
  orgId: string;
  orgSlug: string;
}

const documentTypes = [
  { value: "all", label: "All Types" },
  { value: "handbook", label: "Handbook" },
  { value: "policy", label: "Policy" },
  { value: "template", label: "Template" },
  { value: "note", label: "Note" },
  { value: "knowledge", label: "Knowledge" },
] as const;

export function DocumentList({ orgId, orgSlug }: DocumentListProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);

  const { data: documents, isLoading } = trpc.organizationDocuments.list.useQuery(
    {
      orgId,
      type: typeFilter !== "all"
        ? (typeFilter as "handbook" | "policy" | "template" | "note" | "knowledge")
        : undefined,
      archived: showArchived,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? "Showing Archived" : "Archived"}
          </Button>
        </div>
        <CreateDocumentDialog orgId={orgId} orgSlug={orgSlug} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !documents || documents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm mt-1">
            {typeFilter !== "all" || showArchived
              ? "Try adjusting your filters or "
              : "Get started by "}
            creating a new document.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              name={doc.name}
              type={doc.type}
              visibility={doc.visibility}
              archivedAt={doc.archivedAt}
              orgSlug={orgSlug}
              documentId={doc.documentId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
