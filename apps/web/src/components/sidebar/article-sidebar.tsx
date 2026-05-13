"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, BookMarked, Clock, ChevronRight } from "lucide-react"
import { ColoredBadge } from "@/components/colored-badge";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarRail,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]! bg-background">
      <SidebarContent className="bg-background">
        {articleStructure.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>
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
      <SidebarFooter className="bg-background p-4">
        <Card className="p-0 rounded-md">
          <CardContent className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Start Building</span>
              <ColoredBadge color="violet">Free</ColoredBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              Join thousands of developers learning Python with our interactive guides.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}