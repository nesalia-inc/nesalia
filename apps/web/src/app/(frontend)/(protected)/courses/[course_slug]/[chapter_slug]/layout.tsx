import { AppHeader } from "@/components/headers/app-header"
import { CourseSidebar } from "@/components/sidebar/course-sidebar"
import { CourseFooter } from "@/components/footer/course-footer"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface ChapterLayoutProps {
  children: React.ReactNode
  params: Promise<{
    course_slug: string
    chapter_slug: string
  }>
}

export default async function ChapterLayout({ children, params }: ChapterLayoutProps) {
  const { course_slug, chapter_slug } = await params

  return (
    <div className="[--header-height:calc(var(--spacing)*14)] [--footer-height:calc(var(--spacing)*14)]">
      <SidebarProvider className="flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <CourseSidebar
            courseSlug={course_slug}
            chapterSlug={chapter_slug}
            partSlug=""
          />
          <SidebarInset className="flex flex-col py-12 px-8">
            {children}
          </SidebarInset>
        </div>
        <CourseFooter courseSlug={course_slug} chapterSlug={chapter_slug} />
      </SidebarProvider>
    </div>
  )
}