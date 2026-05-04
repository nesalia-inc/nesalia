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
  { slug: 'python-introduction', name: 'Introduction to Python' },
  { slug: 'advanced-python', name: 'Advanced Python' },
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
          { slug: 'decorators', title: 'Decorators and Decorator Patterns', order: 1 },
          { slug: 'functools-module', title: 'functools Module', order: 2 },
          { slug: 'generators', title: 'Generators and Generator Expressions', order: 3 },
          { slug: 'context-managers', title: 'Context Managers and the with Statement', order: 4 },
          { slug: 'walrus-operator', title: 'The Walrus Operator', order: 5 },
        ],
      },
      {
        title: 'Advanced Data Structures',
        chapters: [
          { slug: 'collections-module', title: 'Collections Module', order: 1 },
          { slug: 'chainmap-namedtuple', title: 'ChainMap and namedtuple', order: 2 },
          { slug: 'comprehensions', title: 'List, Set, and Dictionary Comprehensions', order: 3 },
          { slug: 'sorting-custom-keys', title: 'Sorting with Custom Keys', order: 4 },
        ],
      },
      {
        title: 'Object-Oriented Programming',
        chapters: [
          { slug: 'multiple-inheritance-mro', title: 'Multiple Inheritance and MRO', order: 1 },
          { slug: 'super-cooperative-mro', title: 'Super() and Cooperative Multiple Inheritance', order: 2 },
          { slug: 'abstract-classes-interfaces', title: 'Abstract Classes and Interfaces', order: 3 },
          { slug: 'enumerations', title: 'Enumerations', order: 4 },
          { slug: 'property-decorator', title: 'Properties and the @property Decorator', order: 5 },
          { slug: 'dunder-methods', title: 'Dunder Methods', order: 6 },
          { slug: 'dataclasses', title: 'Data Classes', order: 7 },
          { slug: 'descriptors', title: 'Descriptors and the Descriptor Protocol', order: 8 },
          { slug: 'structural-pattern-matching', title: 'Structural Pattern Matching', order: 9 },
        ],
      },
      {
        title: 'Metaprogramming',
        chapters: [
          { slug: 'init-new-call', title: 'Understanding __init__, __new__, __call__', order: 1 },
          { slug: 'slots', title: '__slots__ for Memory Optimization', order: 2 },
          { slug: 'metaclasses', title: 'Custom Metaclasses', order: 3 },
          { slug: 'class-creation-patterns', title: 'Class Creation Patterns', order: 4 },
        ],
      },
      {
        title: 'Advanced Type Annotations',
        chapters: [
          { slug: 'generic-types', title: 'Generic Types', order: 1 },
          { slug: 'union-optional-literal', title: 'Union, Optional, and Literal Types', order: 2 },
          { slug: 'type-aliases-newtype', title: 'Type Aliases and NewType', order: 3 },
          { slug: 'typeddict', title: 'TypedDict', order: 4 },
          { slug: 'protocols-structural-typing', title: 'Protocols and Structural Typing', order: 5 },
          { slug: 'typevar-bounded-generics', title: 'TypeVar and Bounded Generics', order: 6 },
          { slug: 'self-conditional-types', title: 'Self Types and Conditional Types', order: 7 },
          { slug: 'overload', title: '@overload for Function Overloading', order: 8 },
          { slug: 'override', title: '@override for Method Overriding', order: 9 },
          { slug: 'final', title: '@final to Prevent Overriding', order: 10 },
        ],
      },
      {
        title: 'Collections and Iterators',
        chapters: [
          { slug: 'collections-abc', title: 'collections.abc Module', order: 1 },
          { slug: 'custom-iterables', title: 'Implementing Custom Iterables', order: 2 },
          { slug: 'abcs-interfaces', title: 'ABCs for Interfaces', order: 3 },
        ],
      },
      {
        title: 'Concurrency and Parallelism',
        chapters: [
          { slug: 'threading-gil', title: 'Threading and the GIL', order: 1 },
          { slug: 'multiprocessing', title: 'Multiprocessing for CPU-Bound Tasks', order: 2 },
          { slug: 'asyncio-fundamentals', title: 'AsyncIO Fundamentals', order: 3 },
          { slug: 'await-async-task', title: 'await, async def, and Task', order: 4 },
          { slug: 'concurrent-futures', title: 'Concurrent.futures', order: 5 },
          { slug: 'exception-groups-taskgroup', title: 'Exception Groups and TaskGroup', order: 6 },
        ],
      },
      {
        title: 'Testing and Debugging',
        chapters: [
          { slug: 'unit-testing', title: 'Unit Testing with unittest and pytest', order: 1 },
          { slug: 'fixtures-mocking', title: 'Fixtures and Mocking', order: 2 },
          { slug: 'coverage-analysis', title: 'Coverage Analysis', order: 3 },
          { slug: 'debugging-pdb', title: 'Debugging Techniques and pdb', order: 4 },
        ],
      },
      {
        title: 'Design Patterns',
        chapters: [
          { slug: 'singleton-factory', title: 'Singleton and Factory Patterns', order: 1 },
          { slug: 'observer-pattern', title: 'Observer Pattern', order: 2 },
          { slug: 'strategy-state', title: 'Strategy and State Patterns', order: 3 },
          { slug: 'builder-prototype', title: 'Builder and Prototype Patterns', order: 4 },
        ],
      },
      {
        title: 'Working with External Data',
        chapters: [
          { slug: 'json-pickle', title: 'JSON and Pickle Serialization', order: 1 },
          { slug: 'yaml-parsing', title: 'YAML Parsing', order: 2 },
          { slug: 'regular-expressions', title: 'Regular Expressions', order: 3 },
          { slug: 'csv-pandas', title: 'CSV and Pandas Basics', order: 4 },
        ],
      },
      {
        title: 'Production Python',
        chapters: [
          { slug: 'logging-configuration', title: 'Logging Configuration', order: 1 },
          { slug: 'environment-variables-config', title: 'Environment Variables and Config Management', order: 2 },
          { slug: 'venv-dependency-management', title: 'Virtual Environments and Dependency Management', order: 3 },
          { slug: 'type-checking-mypy', title: 'Type Checking with mypy', order: 4 },
          { slug: 'code-formatting-black-ruff', title: 'Code Formatting with Black and Ruff', order: 5 },
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
      <SidebarHeader className="border-b border-border bg-background">
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
      <SidebarFooter className="border-t border-border p-2 bg-background">
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