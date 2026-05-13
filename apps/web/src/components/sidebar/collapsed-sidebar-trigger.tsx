"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { PanelLeftIcon } from "lucide-react"

export function CollapsedSidebarTrigger() {
  return (
    <SidebarTrigger className="fixed top-4 left-4 z-50 h-8 w-8">
      <PanelLeftIcon className="h-4 w-4" />
    </SidebarTrigger>
  )
}