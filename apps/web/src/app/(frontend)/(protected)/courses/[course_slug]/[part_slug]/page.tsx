import { notFound } from "next/navigation";
import { deesseAuth } from "@/lib/deesse";
import { headers } from "next/headers";
import { MDXRemote } from "next-mdx-remote/rsc";
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
  const contentDir = path.join(process.cwd(), "content", "courses", courseSlug, "chapters");
  const filePath = path.join(contentDir, `${partSlug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  return { content, data };
}

export default async function Page({ params }: PageProps) {
  const { course_slug, part_slug } = await params;

  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const chapter = await getChapterContent(course_slug, part_slug);

  if (!chapter) {
    notFound();
  }

  return (
    <article className="prose prose-sm max-w-none">
      <MDXRemote source={chapter.content} />
    </article>
  );
}