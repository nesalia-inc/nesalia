"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroBadgeProps {
  version: string
  message: string
  className?: string
}

export function HeroBadge({ version, message, className }: HeroBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-none border border-border p-1 text-sm text-muted-foreground",
        className
      )}
    >
      <div className="rounded-none border border-border/50 text-background bg-primary text-xs px-2 py-0.5 font-medium">
        <p>{version}</p>
      </div>
      <p className="pr-3">{message}</p>
      <ChevronRight className="h-4 w-4 shrink-0" />
    </div>
  )
}