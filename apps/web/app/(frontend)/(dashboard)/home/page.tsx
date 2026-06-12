import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardHomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (!organizations || organizations.length === 0) {
    // User has no organizations — shouldn't happen if auto-create works
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p>You don&apos;t have any organizations yet.</p>
      </div>
    );
  }

  // Redirect to first organization
  redirect(`/${organizations[0].slug}`);
}