// import { CourseSidebar } from "@/components/sidebars"
// import { AppHeader } from '@/components/headers';
// import { CollapsedSidebarTrigger } from '@/components/collapsed-sidebar-trigger';
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"

// export default function Layout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="[--header-height:calc(--spacing(14))]">
//       <SidebarProvider className="flex flex-col">
//         <AppHeader />
//         <div className="flex flex-1">
//           <CourseSidebar />
//           <SidebarInset>
//             <div className="flex flex-1 flex-col gap-4 p-4 max-w-3xl mx-auto w-full">
//               {children}
//             </div>
//             <CollapsedSidebarTrigger className="fixed bottom-4 left-4 z-10" />
//           </SidebarInset>
//         </div>
//       </SidebarProvider>
//     </div>
//   );
// }

import { notFound } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  notFound();
}
