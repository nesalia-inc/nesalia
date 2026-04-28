import { CourseSidebar } from "@/components/sidebars"
import { AppHeader } from '@/components/headers';
import { CollapsedSidebarTrigger } from '@/components/collapsed-sidebar-trigger';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
          <SidebarProvider className="flex flex-col">
            <AppHeader />
            <div className="flex flex-1">
              <CourseSidebar />
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4 max-w-3xl mx-auto w-full">
                  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                  </div>
                  <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
                <CollapsedSidebarTrigger className="fixed bottom-4 left-4 z-10" />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
  );
}
