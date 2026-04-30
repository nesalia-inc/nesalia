import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,3.5rem))]">
      <div className="w-full max-w-5xl border-x border-b border-border px-6">
        <div className="flex flex-col items-center text-center gap-6 py-16">
          <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Coming Soon
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            The most advanced software engineering courses
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            Master Python, TypeScript, and system design through hands-on projects.
            Learn from industry experts and join thousands of developers leveling up their skills.
          </p>

          <Button asChild size="lg" className="mt-4">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}