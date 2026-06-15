"use client";

import { useMemo } from "react";
import { renderMarkdown } from "@/lib/markdown";

interface DocumentViewerProps {
  content: string | null | undefined;
}

export function DocumentViewer({ content }: DocumentViewerProps) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  if (!content) {
    return (
      <p className="text-muted-foreground italic">No content</p>
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
