'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

interface Chapter {
  slug: string;
  title: string;
  order: number;
}

interface Section {
  title: string;
  chapters: Chapter[];
}

function getCourseSections(courseSlug: string): Section[] {
  const sections: Record<string, Section[]> = {
    'python-introduction': [
      {
        title: 'Introduction',
        chapters: [
          { slug: '01-introduction', title: 'Introduction to Python', order: 1 },
          { slug: '02-basic-syntax', title: 'Basic Syntax', order: 2 },
        ],
      },
      {
        title: 'Control Flow',
        chapters: [
          { slug: 'if-statements', title: 'If Statements', order: 1 },
        ],
      },
    ],
    'advanced-python': [
      {
        title: 'Advanced Functions',
        chapters: [
          { slug: '01-advanced-functions', title: 'Advanced Functions', order: 1 },
        ],
      },
    ],
  };
  return sections[courseSlug] || [];
}

export function CourseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const courseSlug = params.course_slug as string;
  const section = params.section as string;
  const chapterSlug = params.chapter_slug as string;

  const sections = getCourseSections(courseSlug);

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarContent className="bg-background">
        {sections.map((sec) => {
          const sectionSlug = sec.title.toLowerCase().replace(/\s+/g, '-');
          return (
            <SidebarGroup key={sec.title}>
              <SidebarGroupLabel className="text-muted-foreground">
                {sec.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sec.chapters.map((chapter) => {
                    const isActive = section === sectionSlug && chapterSlug === chapter.slug;
                    return (
                      <SidebarMenuItem key={chapter.slug}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={`/courses/${courseSlug}/${sectionSlug}/${chapter.slug}`}>
                            {chapter.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}