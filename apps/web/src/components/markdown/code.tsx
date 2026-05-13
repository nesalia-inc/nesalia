"use client"

import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"
import { Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface CodeProps {
  children: string
  className?: string
  language?: string
}

export function Code({
  children,
  className,
  language = "python",
}: CodeProps) {
  const [hasCopied, setHasCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [html, setHtml] = useState<string>("")
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function highlight() {
      const isDark = resolvedTheme === "dark"
      const highlighted = await codeToHtml(children.trim(), {
        lang: language,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
      })
      setHtml(highlighted)
    }
    if (mounted) {
      highlight()
    }
  }, [mounted, resolvedTheme, children, language])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setHasCopied(true)
      toast.success("Code copied to clipboard")
      setTimeout(() => setHasCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy text: ", error)
      toast.error("Failed to copy code")
    }
  }

  if (!mounted) {
    return (
      <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 mt-6 text-sm font-mono">
        <code>{children.trim()}</code>
      </pre>
    )
  }

  return (
    <div className="relative group mt-6 rounded-lg border overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b bg-muted/30">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Copy code"
        >
          {hasCopied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>

        <div
          className="overflow-x-auto text-sm font-mono p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}