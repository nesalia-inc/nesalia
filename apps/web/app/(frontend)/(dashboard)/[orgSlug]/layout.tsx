import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/sidebars/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Get the organization by slug
  const org = await auth.api.getFullOrganization({
    query: { organizationSlug: orgSlug },
    headers: await headers(),
  });

  if (!org) {
    notFound();
  }

  // Verify user has access to this organization
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const hasAccess = organizations?.some((o) => o.id === org.id);

  if (!hasAccess) {
    redirect("/home");
  }

  return (
    <SidebarProvider>
      <AppSidebar orgSlug={orgSlug} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
