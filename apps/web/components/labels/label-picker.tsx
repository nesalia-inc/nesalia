"use client";

import { useState } from "react";
import { trpc } from "@/trpc";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

const LABEL_COLORS = [
  { value: "red", class: "bg-red-500" },
  { value: "orange", class: "bg-orange-500" },
  { value: "yellow", class: "bg-yellow-500" },
  { value: "green", class: "bg-green-500" },
  { value: "teal", class: "bg-teal-500" },
  { value: "blue", class: "bg-blue-500" },
  { value: "indigo", class: "bg-indigo-500" },
  { value: "purple", class: "bg-purple-500" },
  { value: "pink", class: "bg-pink-500" },
  { value: "brown", class: "bg-amber-700" },
  { value: "gray", class: "bg-gray-500" },
  { value: "black", class: "bg-gray-900" },
] as const;

interface LabelPickerProps {
  orgId: string;
  documentId: string;
  trigger?: React.ReactNode;
}

export function LabelPicker({ orgId, documentId, trigger }: LabelPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const { data: labels, isLoading: labelsLoading } = trpc.labels.list.useQuery(
    { orgId, perPage: 100 },
    { enabled: open }
  );

  const { data: currentLabels, isLoading: currentLoading } = trpc.organizationDocuments.labels.list.useQuery(
    { documentId },
    { enabled: open }
  );

  // Initialize selected IDs when current labels load
  useState(() => {
    if (currentLabels) {
      setSelectedIds(new Set(currentLabels.map((l) => l.id)));
    }
  });

  const setLabelsMutation = trpc.organizationDocuments.labels.set.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["organizationDocuments", "labels", "list"]] });
      setOpen(false);
      setSearch("");
      setSelectedIds(new Set());
    },
  });

  const filteredLabels = labels?.data.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const hasChanges = currentLabels
    ? selectedIds.size !== currentLabels.length ||
      !currentLabels.every((l) => selectedIds.has(l.id))
    : selectedIds.size > 0;

  const toggleLabel = (labelId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(labelId)) {
        next.delete(labelId);
      } else {
        next.add(labelId);
      }
      return next;
    });
  };

  const handleApply = () => {
    setLabelsMutation.mutate({
      documentId,
      labelIds: Array.from(selectedIds),
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
    // Reset to current labels on close
    if (currentLabels) {
      setSelectedIds(new Set(currentLabels.map((l) => l.id)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => o ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Label
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Labels</DialogTitle>
          <DialogDescription>
            Select labels to categorize this document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Search labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {labelsLoading || currentLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLabels.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No labels found. Create one from the Labels page.
            </p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredLabels.map((label) => {
                const colorClass = LABEL_COLORS.find((c) => c.value === label.color)?.class ?? "bg-gray-500";
                return (
                  <div key={label.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`label-${label.id}`}
                      checked={selectedIds.has(label.id)}
                      onCheckedChange={() => toggleLabel(label.id)}
                    />
                    <span
                      className={`w-4 h-4 rounded-full ${colorClass}`}
                    />
                    <Label
                      htmlFor={`label-${label.id}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {label.title}
                    </Label>
                    {label.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {label.description}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={setLabelsMutation.isPending || !hasChanges}
          >
            {setLabelsMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}