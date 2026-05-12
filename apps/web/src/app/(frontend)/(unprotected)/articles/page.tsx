"use client"

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const featuredArticle = {
  slug: "ai-future-tech",
  title: "Exploring the Future of AI in Modern Technology Trends",
  excerpt:
    "Discover how AI is transforming industries and learn about the latest advancements in artificial intelligence.",
  category: "Technology",
  date: "2026-05-01",
  image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
};

const articles = [
  {
    slug: "slack-agent",
    title: "Slack Agent Guide",
    excerpt:
      "Stream agent responses and tool calls into Slack threads.",
    category: "AI Agents",
    date: "2026-05-10",
    code: `bot.onNewMention(async (thread, msg) => {
  await thread.subscribe();
  const result = await agent.stream({
    prompt: msg.text,
  });
  await thread.post(result.fullStream);
});`,
  },
  {
    slug: "knowledge-agent",
    title: "Knowledge Agent Template",
    excerpt:
      "Answer questions from synced docs and repos with file-system search.",
    category: "AI Agents",
    date: "2026-05-08",
    code: `const { text } = await generateText({
  model,
  tools: savoir.tools,
  maxSteps: 10,
  prompt: "How do I configure auth?",
});`,
  },
  {
    slug: "code-review",
    title: "Code Review Bot Guide",
    excerpt:
      "Review pull requests with sandboxed AI analysis on GitHub.",
    category: "AI Agents",
    date: "2026-05-06",
    code: `const { data: pr } = await octokit.pulls.get({
  owner, repo, pull_number,
});
await thread.post("Starting code review...");
const review = await reviewPullRequest({
  owner, repo,
  prBranch: pr.head.ref,
});
await thread.post(review);`,
  },
];

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

      <div className="grid border-t px-6 py-10 divide-x divide-y sm:px-10 sm:py-12 md:grid-cols-3">
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
  );
}