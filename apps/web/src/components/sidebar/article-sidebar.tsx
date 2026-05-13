"use client"

import * as React from "react"
import { FileText, BookMarked, Clock, ChevronRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

interface ArticleSidebarProps {
  topicSlug: string
  articleSlug: string
}

const articleStructure = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "Installation", slug: "installation" },
      { title: "Quick Start", slug: "quick-start" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Architecture", slug: "architecture" },
      { title: "Configuration", slug: "configuration" },
      { title: "Best Practices", slug: "best-practices" },
    ],
  },
  {
    title: "Advanced Topics",
    items: [
      { title: "Performance", slug: "performance" },
      { title: "Security", slug: "security" },
      { title: "Deployment", slug: "deployment" },
    ],
  },
]

export function ArticleSidebar({ topicSlug, articleSlug }: ArticleSidebarProps) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <FileText className="size-4" />
          <span className="text-sm font-medium">Navigation</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {articleStructure.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>
              <BookMarked className="size-3 mr-1" />
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = item.slug === articleSlug
                  return (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton isActive={isActive} asChild>
                        <a
                          href={`/articles/${topicSlug}/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          {isActive && <ChevronRight className="size-3" />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}