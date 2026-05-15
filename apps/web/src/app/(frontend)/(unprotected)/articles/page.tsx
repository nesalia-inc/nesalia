import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import Link from "next/link"
import matter from "gray-matter"
import { ArticleCard } from "@/components/article-card"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { ColoredBadge, type BadgeColor } from "@/components/colored-badge"

const categoryColors: Record<string, BadgeColor> = {
  LangChain: "yellow",
  FastAPI: "violet",
  Django: "pink",
  AsyncIO: "cyan",
  DataScience: "orange",
  Testing: "blue",
  CLI: "green",
  Database: "red",
}

interface ArticleMeta {
  slug: string
  title: string
  description: string
  category: string
  date: string
  code: string
}

function getArticles(): ArticleMeta[] {
  const articlesDir = path.join(process.cwd(), "src", "content", "articles")

  if (!fs.existsSync(articlesDir)) {
    return []
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"))

  return files.map((file) => {
    const slug = file.replace(".mdx", "")
    const filePath = path.join(articlesDir, file)
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data } = matter(fileContent)

    return {
      slug,
      title: data.title as string,
      description: (data.description as string) ?? "",
      category: (data.category as string) ?? "General",
      date: (data.date as string) ?? "",
      code: data.code as string ?? "",
    }
  })
}

export default function Articles() {
  const articles = getArticles()

  if (articles.length === 0) {
    return (
      <div className="flex flex-1 flex-col py-2">
        <p className="text-muted-foreground text-center py-12">
          No articles yet.
        </p>
      </div>
    )
  }

  const featuredArticle = articles[0]
  const featuredBadgeColor = categoryColors[featuredArticle.category] ?? "violet"

  return (
    <div className="flex flex-1 flex-col py-2">
      <Link
        href={`/articles/${featuredArticle.slug}`}
        className="group grid border-t border-x gap-8 p-4 md:grid-cols-2"
      >
        <div className="aspect-video -rotate-3 rounded-md border overflow-hidden transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
          {featuredArticle.code ? (
            <CodeBlock code={featuredArticle.code} size="lg" tabs={false} />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
        <div className="flex flex-col items-start gap-4 flex-1">
          <div className="flex w-full items-center justify-between gap-2">
            <h2 className="font-semibold tracking-tight lg:text-2xl">
              {featuredArticle.title}
            </h2>
            <ColoredBadge color={featuredBadgeColor}>
              {featuredArticle.category}
            </ColoredBadge>
          </div>
          <p className="text-muted-foreground">{featuredArticle.description}</p>
          <Button className="mt-auto w-full">Read Now</Button>
        </div>
      </Link>

      <div className="grid border-t border-l divide-x divide-y md:grid-cols-3 -mt-px">
        {articles.slice(1).map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}