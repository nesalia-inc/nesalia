'use client';

import Link from 'next/link';
import { ColoredBadge } from '@/components/colored-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
} from '@/components/ui/sidebar';

interface CourseSidebarProps {
  courseSlug: string;
  chapterSlug: string;
  partSlug: string;
}

const courseStructure = [
  {
    title: 'Chapter 1: Getting Started',
    items: [
      { title: 'Introduction', slug: 'introduction' },
      { title: 'Installation', slug: 'installation' },
      { title: 'Quick Start', slug: 'quick-start' },
    ],
  },
  {
    title: 'Chapter 2: Core Concepts',
    items: [
      { title: 'Architecture', slug: 'architecture' },
      { title: 'Configuration', slug: 'configuration' },
      { title: 'Best Practices', slug: 'best-practices' },
    ],
  },
  {
    title: 'Chapter 3: Advanced Topics',
    items: [
      { title: 'Performance', slug: 'performance' },
      { title: 'Security', slug: 'security' },
      { title: 'Deployment', slug: 'deployment' },
    ],
  },
];

export function CourseSidebar({ courseSlug, chapterSlug, partSlug }: CourseSidebarProps) {
  return (
    <Sidebar
      variant="floating"
      className="top-(--header-height) bottom-(--header-height) h-[calc(100svh-var(--header-height)-var(--footer-height))]!"
    >
      <SidebarContent className="bg-background rounded-lg">
        {courseStructure.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = item.slug === partSlug;
                  return (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton isActive={isActive} asChild>
                        <a
                          href={`/courses/${courseSlug}/${chapterSlug}/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
