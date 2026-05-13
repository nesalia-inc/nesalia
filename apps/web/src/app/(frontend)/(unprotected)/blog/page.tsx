import { ArticleCard } from "@/components/article-card"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ColoredBadge, type BadgeColor } from "@/components/colored-badge"

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

const featuredArticle = {
  slug: "python-agents",
  title: "Building AI Agents with Python",
  excerpt:
    "A comprehensive guide to building autonomous AI agents that can reason, plan, and execute tasks using LangChain and modern Python async patterns.",
  category: "LangChain",
  code: `from agents import Agent, Tool
from pydantic import BaseModel
from typing import Optional

class WeatherInput(BaseModel):
    city: str
    unit: Optional[str] = "celsius"

class WeatherAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Weather Agent",
            model="claude-opus",
            tools=[
                Tool.search(),
                Tool.calculate(),
            ],
            system_prompt="You are a weather forecasting agent."
        )

    async def get_forecast(self, city: str, unit: str = "celsius"):
        prompt = f"What's the weather in {city} in {unit}?"
        response = await self.run(prompt)
        return response.content

agent = WeatherAgent()
forecast = await agent.get_forecast("Paris", "celsius")
print(forecast)`,
}

const articles = [
  {
    slug: "slack-agent",
    title: "Slack Bot with Python",
    excerpt:
      "Build AI agents that stream responses to Slack channels.",
    category: "AsyncIO",
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
    category: "LangChain",
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
    category: "LangChain",
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
    category: "FastAPI",
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
    category: "Django",
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
    category: "FastAPI",
    date: "2026-04-30",
    code: `@app.post("/process")
async def process_item(item: Item, background_tasks: BackgroundTasks):
    background_tasks.add_task(process, item.id)
    return {"task_id": item.id}`,
  },
]

export default function Blog() {
  const featuredBadgeColor = categoryColors[featuredArticle.category] ?? "violet"

  return (
    <div className="flex flex-1 flex-col py-2">
      <Link
        href={`/blog/${featuredArticle.slug}`}
        className="group grid border-t border-x gap-8 p-4 md:grid-cols-2"
      >
        <div className="aspect-video -rotate-3 rounded-md border overflow-hidden transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
          <CodeBlock code={featuredArticle.code} size="lg" />
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
          <p className="text-muted-foreground">{featuredArticle.excerpt}</p>
          <Button className="mt-auto w-full">Read Now</Button>
        </div>
      </Link>

      <div className="grid border-t border-l divide-x divide-y md:grid-cols-3 -mt-px">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}