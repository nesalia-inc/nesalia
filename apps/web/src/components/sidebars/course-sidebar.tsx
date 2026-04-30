'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, GalleryVerticalEnd, PanelLeftIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Chapter {
  slug: string;
  title: string;
  order: number;
}

interface Section {
  title: string;
  chapters: Chapter[];
}

const courses = [
  { slug: 'python-introduction', name: 'Introduction to Python', icon: '🐍' },
  { slug: 'advanced-python', name: 'Advanced Python', icon: '⚡' },
]

function CourseSwitcher() {
  const params = useParams()
  const router = useRouter()
  const currentCourse = params.course_slug as string

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">
                  {courses.find(c => c.slug === currentCourse)?.name || 'Course'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {courses.find(c => c.slug === currentCourse)?.icon}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {courses.map((course) => (
              <DropdownMenuItem
                key={course.slug}
                onSelect={() => router.push(`/courses/${course.slug}`)}
              >
                <span className="mr-2">{course.icon}</span>
                {course.name}
                {course.slug === currentCourse && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function getCourseSections(courseSlug: string): Section[] {
  const sections: Record<string, Section[]> = {
    'python-introduction': [
      {
        title: 'Introduction',
        chapters: [
          { slug: 'what-is-python', title: 'What is Python?', order: 1 },
          { slug: 'python-vs-other-languages', title: 'Python vs Other Languages', order: 2 },
          { slug: 'setting-up-environment', title: 'Setting Up Your Environment', order: 3 },
          { slug: 'first-python-script', title: 'Your First Python Script', order: 4 },
        ],
      },
      {
        title: 'Basic Syntax',
        chapters: [
          { slug: 'variables-and-data-types', title: 'Variables and Data Types', order: 1 },
          { slug: 'operators', title: 'Operators', order: 2 },
          { slug: 'comments-and-formatting', title: 'Comments and Code Formatting', order: 3 },
        ],
      },
      {
        title: 'Control Flow',
        chapters: [
          { slug: 'if-statements', title: 'Conditional Statements', order: 1 },
          { slug: 'for-loop', title: 'The for Loop and range()', order: 2 },
          { slug: 'while-loop', title: 'The while Loop', order: 3 },
          { slug: 'break-continue-pass', title: 'Break, Continue, and Pass', order: 4 },
          { slug: 'enumerate-and-zip', title: 'Enumerate and zip', order: 5 },
        ],
      },
      {
        title: 'Functions',
        chapters: [
          { slug: 'defining-functions', title: 'Defining Functions', order: 1 },
          { slug: 'parameters-and-return', title: 'Parameters and Return Values', order: 2 },
          { slug: 'variable-scope', title: 'Variable Scope', order: 3 },
          { slug: 'lambda-functions', title: 'Lambda Functions', order: 4 },
          { slug: 'type-annotations', title: 'Type Annotations Basics', order: 5 },
          { slug: 'positional-and-named-arguments', title: 'Positional and Named Arguments', order: 6 },
        ],
      },
      {
        title: 'Data Structures',
        chapters: [
          { slug: 'lists', title: 'Lists and List Operations', order: 1 },
          { slug: 'tuples', title: 'Tuples and Immutability', order: 2 },
          { slug: 'sets', title: 'Sets and Set Operations', order: 3 },
          { slug: 'dictionaries', title: 'Dictionaries', order: 4 },
        ],
      },
      {
        title: 'Strings',
        chapters: [
          { slug: 'string-creation', title: 'String Creation and Manipulation', order: 1 },
          { slug: 'string-methods', title: 'String Methods', order: 2 },
          { slug: 'string-formatting', title: 'String Formatting', order: 3 },
        ],
      },
      {
        title: 'File Operations',
        chapters: [
          { slug: 'reading-files', title: 'Reading Files', order: 1 },
          { slug: 'writing-files', title: 'Writing Files', order: 2 },
          { slug: 'working-with-paths', title: 'Working with Paths', order: 3 },
        ],
      },
      {
        title: 'Modules and Packages',
        chapters: [
          { slug: 'importing-modules', title: 'Importing Modules', order: 1 },
          { slug: 'standard-library-overview', title: 'Standard Library Overview', order: 2 },
          { slug: 'using-pip-and-virtual-environments', title: 'Using pip and Virtual Environments', order: 3 },
        ],
      },
      {
        title: 'Error Handling',
        chapters: [
          { slug: 'try-and-except-blocks', title: 'Try and Except Blocks', order: 1 },
          { slug: 'raising-exceptions', title: 'Raising Exceptions', order: 2 },
          { slug: 'custom-exceptions', title: 'Custom Exceptions', order: 3 },
        ],
      },
      {
        title: 'Introduction to OOP',
        chapters: [
          { slug: 'classes-and-objects', title: 'Classes and Objects', order: 1 },
          { slug: 'attributes-and-methods', title: 'Attributes and Methods', order: 2 },
          { slug: 'inheritance-basics', title: 'Inheritance Basics', order: 3 },
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
  const { state, toggleSidebar } = useSidebar();

  const sections = getCourseSections(courseSlug);

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <CourseSwitcher />
      </SidebarHeader>
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
      <SidebarFooter className="border-t border-border p-2">
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleSidebar()}
            aria-label="Toggle sidebar"
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}