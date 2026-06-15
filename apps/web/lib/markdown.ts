import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render markdown content to sanitized HTML.
 * Uses DOMPurify to prevent XSS attacks from user-generated content.
 */
export function renderMarkdown(content: string | null | undefined): string {
  if (!content) return "";
  const rawHtml = marked(content) as string;
  return DOMPurify.sanitize(rawHtml);
}
