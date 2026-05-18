import { AppHeader } from "@/components/headers/app-header"
import { CourseSidebar } from "@/components/sidebar/course-sidebar"
import { CourseFooter } from "@/components/footer/course-footer"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import {
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
    <div className="[--header-height:calc(var(--spacing)*14)] [--footer-height:calc(var(--spacing)*14)] h-screen overflow-hidden">
      <SidebarProvider className="flex flex-col h-full">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <CourseSidebar
            courseSlug={course_slug}
            chapterSlug={chapter_slug}
            partSlug=""
          />
          <ResizablePanelGroup direction="horizontal" className="flex flex-1 p-2 pl-0 gap-0.5">
            <ResizablePanel defaultSize={80} className="flex flex-col overflow-hidden border rounded-md">
              <div className="flex-1 overflow-y-auto py-12 px-8">
                {children}
              </div>
            </ResizablePanel>
            <ResizableHandle className="w-1 bg-transparent hover:bg-border rounded-md transition-all duration-200" />            <ResizablePanel defaultSize={20} className="border rounded-md"/>
          </ResizablePanelGroup>
        </div>
        <CourseFooter courseSlug={course_slug} chapterSlug={chapter_slug} />
      </SidebarProvider>
    </div>
  )
}