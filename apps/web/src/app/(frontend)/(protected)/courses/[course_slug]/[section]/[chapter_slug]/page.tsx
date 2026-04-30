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
