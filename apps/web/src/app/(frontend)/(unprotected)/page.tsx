import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeShowcase } from "@/components/code-showcase";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 w-full max-w-5xl">
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <Badge variant="outline">
            <span className="mr-1.5 inline-block size-2 rounded-full bg-amber-500" />
            Early Access
          </Badge>
          <h1 className="max-w-xl lg:max-w-3xl text-3xl font-semibold tracking-tight text-pretty md:text-4xl lg:text-5xl">
            Build production-ready
            <span className="text-primary"> Python </span>
            applications
          </h1>
          <p className="max-w-5xl text-balance text-sm text-muted-foreground md:text-base lg:text-lg">
            Master modern Python development through hands-on projects.
            Learn async patterns, AI integration, and system design from industry experts.
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            <Button asChild size="lg">
              <Link href="/login">
                Start Now <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-md border">
          <CodeShowcase
            code={[
              `from nsa import Agent, Tool

agent = Agent(
    name="Python Expert",
    model="claude-opus",
    tools=[Tool.search(), Tool.code()]
)

result = await agent.run(
    "Build a REST API"
)
print(result)`,
              `from nsa import Agent

agent = Agent(
    name="Data Analyst",
    model="claude-sonnet"
)

# Analyze data
insights = await agent.analyze(
    "Sales data Q1 2026",
    format="markdown"
)
print(insights)`,
              `from nsa import Agent, Tool

agent = Agent(
    name="DevOps Engineer",
    model="claude-opus",
    tools=[
        Tool.deploy(),
        Tool.monitor(),
        Tool.alert()
    ]
)

# Deploy and monitor
await agent.deploy("v2.0.0")
print("Deployed!")`,
            ]}
            title="nesalia.py"
            interval={4000}
          />
        </div>
      </div>
    </main>
  );
}
