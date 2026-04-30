import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <main className="w-full max-w-5xl border-x border-border px-6 py-16">
        <div className="flex flex-col items-center text-center gap-6">
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
      </main>
    </div>
  );
}