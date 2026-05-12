"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"

const articles = [
  {
    slug: "slack-agent",
    title: "Slack Bot with Python",
    excerpt:
      "Build AI agents that stream responses to Slack channels.",
    category: "Python",
    date: "2026-05-10",
    code: `async def on_mention(thread, msg):
    await thread.subscribe()
    result = await agent.stream(prompt=msg.text)
    await thread.post(result.full_stream)`,
  },
  {
    slug: "knowledge-agent",
    title: "RAG Knowledge Base Agent",
    excerpt:
      "Build a retrieval-augmented generation system for document Q&A.",
    category: "Python",
    date: "2026-05-08",
    code: `response = await generate_text(
    model=model,
    tools=savoir.tools,
    max_steps=10,
    prompt=user_query,
)`,
  },
  {
    slug: "code-review",
    title: "GitHub PR Review Bot",
    excerpt:
      "Automate code reviews with AI using GitHub API and LangChain.",
    category: "Python",
    date: "2026-05-06",
    code: `pr_data = await octokit.pulls.get(owner=owner, repo=repo, pull_number=pull_number)
review = await review_pull_request(pr=pr_data.head.ref)
await thread.post(review)`,
  },
  {
    slug: "fastapi-auth",
    title: "FastAPI Authentication Guide",
    excerpt:
      "Implement secure authentication with FastAPI and JWT tokens.",
    category: "Python",
    date: "2026-05-04",
    code: `async def verify_token(token: str) -> User:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload.get("sub")
    return await get_user(user_id)`,
  },
  {
    slug: "django-rest",
    title: "Django REST Framework Patterns",
    excerpt:
      "Master serializer patterns and viewset customization in Django.",
    category: "Python",
    date: "2026-05-02",
    code: `class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']`,
  },
  {
    slug: "microservices",
    title: "Building Python Microservices",
    excerpt:
      "Create scalable microservices with FastAPI and Redis.",
    category: "Python",
    date: "2026-04-30",
    code: `@app.post("/process")
async def process_item(item: Item, background_tasks: BackgroundTasks):
    background_tasks.add_task(process, item.id)
    return {"task_id": item.id}`,
  },
]

export default function Articles() {
  return (
    <div className="flex flex-1 flex-col gap-12 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-medium md:text-4xl lg:text-5xl">
          Insights and Trends Blog
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Stay updated with the latest insights, trends, and tips across various
          topics to keep ahead of the curve.
        </p>
      </div>

      <div className="grid border-t divide-x divide-y md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group flex flex-col overflow-hidden bg-background p-4 transition-colors hover:bg-muted/40"
          >
            <h3 className="font-semibold tracking-tight">{article.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {article.excerpt}
            </p>
            <div className="mt-4 -mr-8 -mb-8 ml-4 aspect-video -rotate-3 overflow-hidden transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
              <CodeBlock code={article.code} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}