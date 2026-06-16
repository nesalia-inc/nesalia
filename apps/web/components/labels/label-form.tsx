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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const LABEL_COLORS = [
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "brown", label: "Brown", class: "bg-amber-700" },
  { value: "gray", label: "Gray", class: "bg-gray-500" },
  { value: "black", label: "Black", class: "bg-gray-900" },
] as const;

interface LabelFormDialogProps {
  orgId: string;
  mode: "create" | "edit";
  label?: {
    id: string;
    title: string;
    color: string;
    description: string | null;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function LabelFormDialog({
  orgId,
  mode,
  label,
  trigger,
  onSuccess,
}: LabelFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(label?.title ?? "");
  const [color, setColor] = useState(label?.color ?? "blue");
  const [description, setDescription] = useState(label?.description ?? "");
  const [titleError, setTitleError] = useState("");

  const queryClient = useQueryClient();

  const createMutation = trpc.labels.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["labels", "list"]] });
      handleClose();
      onSuccess?.();
    },
  });

  const updateMutation = trpc.labels.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["labels", "list"]] });
      handleClose();
      onSuccess?.();
    },
  });

  const handleClose = () => {
    setOpen(false);
    if (mode === "create") {
      setTitle("");
      setColor("blue");
      setDescription("");
      setTitleError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }
    if (trimmedTitle.length > 50) {
      setTitleError("Title must be 50 characters or fewer");
      return;
    }
    setTitleError("");

    if (mode === "create") {
      createMutation.mutate({
        orgId,
        title: trimmedTitle,
        color: color as "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "indigo" | "purple" | "pink" | "brown" | "gray" | "black",
        description: description.trim() || undefined,
      });
    } else if (label) {
      updateMutation.mutate({
        orgId,
        labelId: label.id,
        title: trimmedTitle,
        color: color as "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "indigo" | "purple" | "pink" | "brown" | "gray" | "black",
        description: description.trim() || undefined,
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            {mode === "create" ? "New Label" : "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create Label" : "Edit Label"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Create a new label for your organization."
                : "Update the label details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="e.g. Legal, Finance, Onboarding"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError("");
                }}
                maxLength={50}
                required
              />
              {titleError && (
                <p className="text-xs text-red-500">{titleError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {title.length}/50 characters
              </p>
            </div>

            {/* Color */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-transform
                      ${c.class}
                      ${color === c.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                      }
                    `}
                    title={c.label}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                id="description"
                placeholder="Describe when to use this label..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] text-sm"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}