import { notFound } from "next/navigation";
import { deesseAuth } from "@/lib/deesse";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{
    course_slug: string;
    part_slug: string;
  }>;
}

async function getChapter(courseSlug: string, partSlug: string) {
  try {
    const content = await import(`@/content/courses/${courseSlug}/chapters/${partSlug}.mdx`);
    return content.default;
  } catch {
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const { course_slug, part_slug } = await params;

  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const Chapter = await getChapter(course_slug, part_slug);

  if (!Chapter) {
    notFound();
  }

  return (
    <article className="prose prose-sm max-w-none">
      <Chapter />
    </article>
  );
}
