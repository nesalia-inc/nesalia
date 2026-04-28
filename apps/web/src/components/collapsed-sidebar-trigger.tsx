"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CollapsedSidebarTriggerProps {
  className?: string
}

export function CollapsedSidebarTrigger({ className }: CollapsedSidebarTriggerProps) {
  const { state, toggleSidebar } = useSidebar()

  if (state !== "collapsed") {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("bg-muted border-border border rounded-md", className)}>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">Toggle sidebar</TooltipContent>
    </Tooltip>
  )
}