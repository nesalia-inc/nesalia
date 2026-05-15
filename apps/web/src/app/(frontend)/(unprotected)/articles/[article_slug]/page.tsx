import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import matter from "gray-matter"
import { MDXContent } from "@/components/markdown/mdx-content"
import { ColoredBadge, type BadgeColor } from "@/components/colored-badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"

const categoryColors: Record<string, BadgeColor> = {
  LangChain: "yellow",
  FastAPI: "violet",
  Django: "pink",
  AsyncIO: "cyan",
}

interface ArticleProps {
  params: Promise<{
    article_slug: string
  }>
}

async function getArticle(articleSlug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "articles",
    `${articleSlug}.mdx`
  )

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContent)

  return {
    title: data.title as string,
    description: data.description as string,
    category: data.category as string,
    date: data.date as string,
    content,
  }
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { article_slug } = await params
  const article = await getArticle(article_slug)

  if (!article) {
    notFound()
  }

  const badgeColor = categoryColors[article.category] ?? "violet"

  return (
    <div className="flex flex-1 flex-col py-12 mx-auto max-w-3xl">
      <Link
        href="/articles"
        className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </Link>

      <div className="mb-12 pb-12 border-b text-left">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {article.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {article.description}
        </p>
      </div>

      <div className="flex-1">
        <MDXContent source={article.content} />
      </div>

      <div className="mt-12 group border rounded-md overflow-hidden transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105 md:grid md:grid-cols-2">
        <div className="aspect-video -rotate-3 rounded-md border">
          <CodeBlock
            code={`from nsa import Agent

agent = Agent(
    model="claude-opus",
    tools=[search, calculate],
    system_prompt="You are a Python expert"
)

# Start building
result = await agent.run("Help me learn Python")
print(result)`}
            size="lg"
          />
        </div>
        <div className="flex flex-col items-start gap-4 flex-1 p-4">
          <div className="flex w-full items-center justify-between gap-2">
            <h2 className="font-semibold tracking-tight lg:text-2xl">
              Start Building Today
            </h2>
            <ColoredBadge color="violet">Free</ColoredBadge>
          </div>
          <p className="text-muted-foreground">
            Join thousands of developers learning Python with our interactive
            guides and tutorials.
          </p>
          <Button asChild className="w-full mt-auto">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}