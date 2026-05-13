"use client"

import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export async function CodeBlock({ code, language = "python" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });

  return (
    <div
      className="h-full w-full overflow-hidden p-3 text-xs leading-relaxed"
      style={{ backgroundColor: "var(--shiki-dark-bg, #24292e)" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}