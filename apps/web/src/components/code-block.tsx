"use client"

import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export async function CodeBlock({ code, language = "python" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  });

  return (
    <div
      className="h-full w-full overflow-hidden p-3 text-xs leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}