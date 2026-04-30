import { notFound } from "next/navigation";
import { deesseAuth } from "@/lib/deesse";
import { headers } from "next/headers";
import { MDXContent } from "@/components/markdown/mdx-content";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

interface PageProps {
  params: Promise<{
    course_slug: string;
    part_slug: string;
  }>;
}

async function getChapterContent(courseSlug: string, partSlug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "courses",
    courseSlug,
    "chapters",
    `${partSlug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  return content;
}

export default async function Page({ params }: PageProps) {
  const { course_slug, part_slug } = await params;

  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const content = await getChapterContent(course_slug, part_slug);

  if (!content) {
    notFound();
  }

  return (
    <article className="prose prose-sm max-w-none">
      <MDXContent source={content} />
    </article>
  );
}
