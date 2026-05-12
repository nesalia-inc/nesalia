import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { deesseAuth } from "@/lib/deesse";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export default async function HomePage() {
  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?redirectTo=/home");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 max-w-3xl mx-auto w-full">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>More content coming soon</EmptyTitle>
          <EmptyDescription>
            We are working on new courses and articles. Check back later.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
