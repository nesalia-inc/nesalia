import { notFound } from "next/navigation";
import { deesseAuth } from "@/lib/deesse";
import { headers } from "next/headers";
import { MDXContent } from "@/components/markdown/mdx-content";
import { ChapterNavigation } from "@/components/markdown/chapter-navigation";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

// ISR: Revalidate course pages every hour
export const revalidate = 3600

interface Chapter {
  slug: string;
  title: string;
  order: number;
}

interface Section {
  title: string;
  chapters: Chapter[];
}

interface PathParams {
  course_slug: string;
  section: string;
  chapter_slug: string;
}

function getAllPaths(): PathParams[] {
  const courses = ['python-introduction', 'advanced-python'];
  const paths: PathParams[] = [];

  for (const courseSlug of courses) {
    const courseDir = path.join(process.cwd(), "src", "content", "courses", courseSlug);
    if (!fs.existsSync(courseDir)) continue;

    const sections = fs.readdirSync(courseDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const section of sections) {
      const sectionDir = path.join(courseDir, section);
      const files = fs.readdirSync(sectionDir).filter(f => f.endsWith('.mdx'));

      for (const file of files) {
        const chapterSlug = file.replace('.mdx', '');
        paths.push({ course_slug: courseSlug, section, chapter_slug: chapterSlug });
      }
    }
  }

  return paths;
}

export async function generateStaticParams(): Promise<PathParams[]> {
  return getAllPaths();
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

async function getChapterContent(courseSlug: string, section: string, chapterSlug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "courses",
    courseSlug,
    section,
    `${chapterSlug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  return content;
}

interface PageProps {
  params: Promise<{
    course_slug: string;
    section: string;
    chapter_slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { course_slug, section, chapter_slug } = await params;

  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const content = await getChapterContent(course_slug, section, chapter_slug);

  if (!content) {
    notFound();
  }

  const sections = getCourseSections(course_slug);
  const allChapters: { title: string; href: string }[] = [];

  for (const sec of sections) {
    const sectionSlug = sec.title.toLowerCase().replace(/\s+/g, '-');
    for (const chapter of sec.chapters) {
      allChapters.push({
        title: chapter.title,
        href: `/courses/${course_slug}/${sectionSlug}/${chapter.slug}`,
      });
    }
  }

  const currentIndex = allChapters.findIndex(
    (ch) => ch.href === `/courses/${course_slug}/${section}/${chapter_slug}`
  );

  const prev = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const next = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <article className="prose prose-sm max-w-none">
      <MDXContent source={content} />
      <ChapterNavigation prev={prev} next={next} />
    </article>
  );
}
