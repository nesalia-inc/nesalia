"use client"

import { useState } from "react"
import { Clipboard, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface NpxPillProps {
  command: string
  className?: string
}

export function NpxPill({ command, className }: NpxPillProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      data-copied={copied}
      className={cn(
        "group inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      <span className="text-primary/60 group-data-[copied=true]:hidden">$</span>
      <span className="group-data-[copied=true]:hidden">{command}</span>
      <span className="hidden group-data-[copied=true]:inline text-primary">
        Copied
      </span>
      <span className="ml-auto shrink-0">
        <Clipboard className="h-4 w-4 text-muted-foreground group-data-[copied=true]:hidden" />
        <Check className="h-4 w-4 text-primary hidden group-data-[copied=true]:block" />
      </span>
    </button>
  )
}