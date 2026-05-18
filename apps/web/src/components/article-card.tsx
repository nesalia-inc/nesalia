import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import { ColoredBadge, type BadgeColor } from "@/components/colored-badge"

interface Article {
  slug: string
  title: string
  description: string
  category: string
  date: string
  code: string
}

interface ArticleCardProps {
  article: Article
}

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

export function ArticleCard({ article }: ArticleCardProps) {
  const badgeColor = categoryColors[article.category] ?? "violet"

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden border-y last:border-r bg-background p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold tracking-tight flex-1">{article.title}</h3>
        <ColoredBadge color={badgeColor} className="shrink-0">
          {article.category}
        </ColoredBadge>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {article.description}
      </p>
      <div className="mt-4 -mr-8 -mb-8 ml-4 aspect-video -rotate-3 rounded-md border overflow-hidden transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
        <CodeBlock code={article.code} tabs={false} />
      </div>
    </Link>
  )
}