"use client";

import { useState } from "react";
import { trpc } from "@/trpc";
import { LabelChip } from "./label-chip";
import { LabelFormDialog } from "./label-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Loader2, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LabelListProps {
  orgId: string;
}

export function LabelList({ orgId }: LabelListProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"title" | "document-count">("title");

  const queryClient = trpc.useUtils();

  const { data, isLoading } = trpc.labels.list.useQuery({
    orgId,
    sort,
    perPage: 100,
  });

  const deleteMutation = trpc.labels.delete.useMutation({
    onSuccess: () => {
      queryClient.labels.list.invalidate();
    },
  });

  const filteredLabels = data?.data.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[300px]"
          />
          <Select value={sort} onValueChange={(v) => setSort(v as "title" | "document-count")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="document-count">Document Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <LabelFormDialog orgId={orgId} mode="create" />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredLabels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            {search ? "No labels match your search" : "No labels yet"}
          </p>
          <p className="text-sm mt-1">
            {search
              ? "Try a different search term."
              : "Create your first label to start organizing documents."}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {filteredLabels.map((label) => (
            <div
              key={label.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Color swatch */}
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: `${label.color}20`,
                  border: `2px solid ${label.color}`,
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{label.title}</span>
                  <LabelChip label={label} size="sm" />
                </div>
                {label.description && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {label.description}
                  </p>
                )}
              </div>

              {/* Document count */}
              <div className="text-sm text-muted-foreground text-right flex-shrink-0">
                {label.documentCount} doc{label.documentCount !== 1 ? "s" : ""}
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <LabelFormDialog
                      orgId={orgId}
                      mode="edit"
                      label={label}
                      trigger={
                        <button className="flex items-center gap-2 w-full">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      }
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex items-center gap-2 w-full text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Label</AlertDialogTitle>
                          <AlertDialogDescription>
                            {label.documentCount > 0 ? (
                              <>
                                This label is used by {label.documentCount} document
                                {label.documentCount !== 1 ? "s" : ""}. Delete it
                                anyway?
                              </>
                            ) : (
                              <>
                                Are you sure you want to delete "{label.title}"?
                              </>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteMutation.mutate({
                                orgId,
                                labelId: label.id,
                                force: label.documentCount > 0,
                              })
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}