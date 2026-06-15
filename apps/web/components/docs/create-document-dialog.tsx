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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";

interface CreateDocumentDialogProps {
  orgId: string;
  orgSlug: string;
  trigger?: React.ReactNode;
}

const documentTypes = [
  { value: "handbook", label: "Handbook" },
  { value: "policy", label: "Policy" },
  { value: "template", label: "Template" },
  { value: "note", label: "Note" },
  { value: "knowledge", label: "Knowledge" },
] as const;

export function CreateDocumentDialog({
  orgId,
  trigger,
}: CreateDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("note");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<string>("all");

  const queryClient = useQueryClient();

  const createMutation = trpc.organizationDocuments.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      setOpen(false);
      setName("");
      setType("note");
      setContent("");
      setVisibility("all");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({
      orgId,
      name: name.trim(),
      type: type as "handbook" | "policy" | "template" | "note" | "knowledge",
      content: content.trim() || undefined,
      visibility: visibility as "all" | "admins_only",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Document</DialogTitle>
            <DialogDescription>
              Create a new document for your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Document name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content (Markdown)
              </label>
              <Textarea
                id="content"
                placeholder="Write your document content in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="visibility" className="text-sm font-medium">
                Visibility
              </label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="admins_only">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
            >
              {createMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
