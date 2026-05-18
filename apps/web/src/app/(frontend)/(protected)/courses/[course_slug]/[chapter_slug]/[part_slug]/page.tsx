interface PartProps {
  params: Promise<{
    course_slug: string
    chapter_slug: string
    part_slug: string
  }>
}

export default async function PartPage({ params }: PartProps) {
  const { course_slug, chapter_slug, part_slug } = await params

  return (
    <div className="flex flex-1 flex-col py-12 mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Course: {course_slug}</h1>
      <p className="text-muted-foreground">Chapter: {chapter_slug}</p>
      <p className="text-muted-foreground">Part: {part_slug}</p>
    </div>
  )
}