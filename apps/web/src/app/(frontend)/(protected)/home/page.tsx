import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { deesseAuth } from "@/lib/deesse";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const session = await deesseAuth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?redirectTo=/home");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Python Introduction</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Learn the fundamentals of Python programming from scratch.
          </p>
          <Button variant="outline" className="mt-4 w-full" asChild>
            <a href="/courses/python-introduction">
              Start Course
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Advanced Python</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Master advanced Python concepts and patterns.
          </p>
          <Button variant="outline" className="mt-4 w-full" asChild>
            <a href="/courses/advanced-python">
              Start Course
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">More Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            New courses are being added regularly.
          </p>
          <Button variant="outline" className="mt-4 w-full" disabled>
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
}