import Link from "next/link"
import { ColoredBadge, type BadgeColor } from "@/components/colored-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AppHeader } from "@/components/headers"

const categoryColors: Record<string, BadgeColor> = {
  FastAPI: "violet",
  Django: "pink",
  AsyncIO: "cyan",
  LangChain: "yellow",
  DataScience: "orange",
  Testing: "blue",
  CLI: "green",
  Database: "red",
}

const topArticles = [
  {
    slug: "python-agents",
    title: "Building AI Agents with Python",
    excerpt: "A comprehensive guide to building autonomous AI agents that can reason, plan, and execute tasks.",
    category: "LangChain",
    topic: "python",
  },
  {
    slug: "fastapi-auth",
    title: "FastAPI Authentication Guide",
    excerpt: "Implement secure authentication with FastAPI and JWT tokens.",
    category: "FastAPI",
    topic: "fastapi",
  },
  {
    slug: "slack-agent",
    title: "Slack Bot with Python",
    excerpt: "Build AI agents that stream responses to Slack channels.",
    category: "AsyncIO",
    topic: "ai-agents",
  },
  {
    slug: "django-rest",
    title: "Django REST Framework Patterns",
    excerpt: "Master serializer patterns and viewset customization in Django.",
    category: "Django",
    topic: "django",
  },
]

const recentArticles = [
  {
    slug: "code-review",
    title: "GitHub PR Review Bot",
    excerpt: "Automate code reviews with AI using GitHub API and LangChain.",
    category: "LangChain",
    topic: "ai-agents",
    date: "May 6, 2026",
  },
  {
    slug: "fastapi-deployment",
    title: "Deploying FastAPI to Production",
    excerpt: "Learn best practices for deploying FastAPI applications.",
    category: "FastAPI",
    topic: "fastapi",
    date: "May 4, 2026",
  },
  {
    slug: "python-testing",
    title: "Testing Python Applications",
    excerpt: "Comprehensive guide to testing Python applications with pytest.",
    category: "Testing",
    topic: "python",
    date: "May 2, 2026",
  },
  {
    slug: "microservices",
    title: "Building Python Microservices",
    excerpt: "Create scalable microservices with FastAPI and Redis.",
    category: "FastAPI",
    topic: "fastapi",
    date: "April 30, 2026",
  },
]

const topics = [
  {
    slug: "python",
    title: "Python",
    description: "Async patterns, testing, CLI tools, and more.",
    articleCount: 24,
  },
  {
    slug: "fastapi",
    title: "FastAPI",
    description: "APIs, authentication, and deployment.",
    articleCount: 18,
  },
  {
    slug: "django",
    title: "Django",
    description: "Web apps and Django REST Framework.",
    articleCount: 15,
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    description: "LangChain, tool use, and memory.",
    articleCount: 12,
  },
]

export default function Articles() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col py-8 px-4 mx-auto max-w-5xl w-full gap-12">
        {/* Top Articles */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Top Articles</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {topArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.topic}/${article.slug}`}>
                <Card className="p-4 rounded-md hover:border-primary/50 transition-colors h-full bg-background flex flex-col">
                  <CardContent className="p-0 flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{article.title}</h3>
                      <ColoredBadge color={categoryColors[article.category] ?? "violet"}>
                        {article.category}
                      </ColoredBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    <Button className="mt-auto">
                      Read Now
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Articles</h2>
          <div className="flex flex-col divide-y">
            {recentArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.topic}/${article.slug}`} className="flex items-center justify-between py-4 hover:opacity-80 transition-opacity">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{article.title}</h3>
                    <ColoredBadge color={categoryColors[article.category] ?? "violet"} className="text-xs">
                      {article.category}
                    </ColoredBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                </div>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Topic */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Browse by Topic</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <Link key={topic.slug} href={`/articles/${topic.slug}/${topArticles.find(a => a.topic === topic.slug)?.slug ?? "introduction"}`}>
                <Card className="p-4 rounded-md hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-0 flex flex-col gap-2">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xs text-muted-foreground">{topic.articleCount} articles</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}