import { notFound } from "next/navigation";
import { deesseAuth } from "@/lib/deesse";
import { headers } from "next/headers";
import Link from "next/link";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{
    course_slug: string;
  }>;
}

function getCourseData(courseSlug: string) {
  const filePath = path.join(process.cwd(), "..", "..", "content", "courses", courseSlug, "index.mdx");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return data;
}

function getChapters(courseSlug: string) {
  const chaptersDir = path.join(process.cwd(), "..", "..", "content", "courses", courseSlug, "chapters");

  if (!fs.existsSync(chaptersDir)) {
    return [];
  }

  const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".mdx"));

  const chapters = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(chaptersDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title,
      description: data.description,
      order: data.order,
    };
  });

  return chapters.sort((a, b) => a.order - b.order);
}

export default async function CoursePage({ params }: PageProps) {
  const { course_slug } = await params;

  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const course = getCourseData(course_slug);
  const chapters = getChapters(course_slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {chapters.map((chapter, index) => (
          <Card key={chapter.slug} className="rounded-md">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <CardTitle className="text-base">{chapter.title}</CardTitle>
                    {chapter.description && (
                      <CardDescription>{chapter.description}</CardDescription>
                    )}
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/courses/${course_slug}/${chapter.slug}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}