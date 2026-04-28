'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen } from 'lucide-react';

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

async function getCourseChapters(courseSlug: string): Promise<Chapter[]> {
  // This is a simplified version - in production you'd want ISR or proper caching
  try {
    const chapters = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses/${courseSlug}/chapters`,
      { cache: 'no-store' }
    ).then((res) => res.json());
    return chapters;
  } catch {
    return [];
  }
}

function processContentDirectory(courseSlug: string): Chapter[] {
  // Static chapters for now - will be replaced by API
  const staticChapters: Record<string, Chapter[]> = {
    'python-introduction': [
      { slug: '01-introduction', title: 'Introduction to Python', order: 1 },
      { slug: '02-basic-syntax', title: 'Basic Syntax', order: 2 },
    ],
    'advanced-python': [
      { slug: '01-advanced-functions', title: 'Advanced Functions', order: 1 },
    ],
  };
  return staticChapters[courseSlug] || [];
}

export function CourseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const courseSlug = params.course_slug as string;
  const partSlug = params.part_slug as string;

  const chapters = processContentDirectory(courseSlug);

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Content
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapters.map((chapter) => (
                <SidebarMenuItem key={chapter.slug}>
                  <SidebarMenuButton asChild isActive={partSlug === chapter.slug}>
                    <Link href={`/courses/${courseSlug}/${chapter.slug}`}>
                      {chapter.order}. {chapter.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}