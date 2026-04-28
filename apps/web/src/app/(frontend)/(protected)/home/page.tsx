import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { deesseAuth } from "@/lib/deesse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Card className="rounded-md">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Python Introduction</CardTitle>
            <CardDescription>
              Learn the fundamentals of Python programming from scratch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/courses/python-introduction">
                Start Course
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Advanced Python</CardTitle>
            <CardDescription>
              Master advanced Python concepts and patterns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/courses/advanced-python">
                Start Course
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>More Coming Soon</CardTitle>
            <CardDescription>
              New courses are being added regularly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}