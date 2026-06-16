import Link from "next/link";
import { FileText, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabelChip } from "@/components/labels/label-chip";
import { trpc } from "@/trpc";

interface DocumentCardProps {
  id: string;
  name: string;
  type: string;
  visibility: string;
  archivedAt: string | null;
  orgSlug: string;
  documentId?: string; // the actual document ID (different from org doc ID)
}

const typeColors: Record<string, string> = {
  handbook: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  policy: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  template: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  note: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  knowledge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

function DocumentLabels({ documentId }: { documentId: string }) {
  const { data: labels } = trpc.organizationDocuments.labels.list.useQuery(
    { documentId },
    { enabled: !!documentId }
  );

  if (!labels || labels.length === 0) return null;

  const displayLabels = labels.slice(0, 3);
  const extraCount = labels.length - 3;

  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-2">
      {displayLabels.map((label) => (
        <LabelChip key={label.id} label={label} size="sm" />
      ))}
      {extraCount > 0 && (
        <span className="text-xs text-muted-foreground">+{extraCount} more</span>
      )}
    </div>
  );
}

export function DocumentCard({
  id,
  name,
  type,
  visibility,
  archivedAt,
  orgSlug,
  documentId,
}: DocumentCardProps) {
  return (
    <Link
      href={`/${orgSlug}/docs/${id}`}
      className="block"
    >
      <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium truncate">{name}</h3>
              <Badge
                variant="secondary"
                className={typeColors[type] ?? ""}
              >
                {type}
              </Badge>
              {visibility === "admins_only" && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Admin
                </Badge>
              )}
              {archivedAt && (
                <Badge variant="outline" className="text-muted-foreground">
                  Archived
                </Badge>
              )}
            </div>
            {documentId && <DocumentLabels documentId={documentId} />}
          </div>
        </div>
      </div>
    </Link>
  );
}
