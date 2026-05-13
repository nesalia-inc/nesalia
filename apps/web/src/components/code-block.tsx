import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language?: string
  size?: "sm" | "lg"
}

const sizeClasses = {
  sm: "p-3 text-xs",
  lg: "p-6 text-sm",
}

export async function CodeBlock({ code, language = "python", size = "sm" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  })

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-md border ${sizeClasses[size]}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}