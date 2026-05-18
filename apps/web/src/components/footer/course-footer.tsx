import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CourseFooterProps {
  courseSlug: string
  chapterSlug: string
}

export function CourseFooter({ courseSlug, chapterSlug }: CourseFooterProps) {
  return (
    <footer className="border-t h-14">
      <div className="flex items-center justify-between w-full px-4 py-4">
        <Button asChild>
          <Link href={`/courses/${courseSlug}/${chapterSlug}/previous`}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/courses/${courseSlug}/${chapterSlug}/next`}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </footer>
  )
}