import Link from "next/link"
import { MDXContent } from "@/components/markdown/mdx-content";
import { ColoredBadge } from "@/components/colored-badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { ArticleSidebar } from "@/components/sidebar/article-sidebar"
import { CollapsedSidebarTrigger } from "@/components/sidebar/collapsed-sidebar-trigger"
import { AppHeader } from '@/components/headers';
import { AppFooter } from '@/components/footer/app-footer';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface ArticleProps {
  params: Promise<{
    topic_slug: string;
    article_slug: string;
  }>;
}

const dummyArticle = {
  slug: "python-agents",
  title: "Building AI Agents with Python",
  category: "LangChain",
  date: "May 15, 2026",
  excerpt:
    "A comprehensive guide to building autonomous AI agents that can reason, plan, and execute tasks using LangChain and modern Python async patterns.",
  content: `## Building AI Agents with Python

An autonomous AI agent is a system that can independently perceive, think, plan, and act to accomplish specific goals. Unlike traditional programs that follow rigid instructions, AI agents can reason and adapt their behavior based on context.

## Getting Started

First, let's install the necessary dependencies:

\`\`\`bash
pip install langchain-openai langchain-community pydantic
\`\`\`

## Creating Your First Agent

Here's a basic example of an AI agent that can use tools:

\`\`\`python
from langchain.agents import Agent, Tool, initialize_agent
from langchain_openai import ChatOpenAI

# Initialize the language model
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Define a simple tool
def search_wikipedia(query: str) -> str:
    """Search Wikipedia for information."""
    return f"Results for: {query}"

tools = [Tool(name="Search", func=search_wikipedia, description="Search Wikipedia")]

# Create the agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent="zero-shot-react-description",
    verbose=True
)

# Run the agent
result = agent.run("Search Wikipedia for Python programming language")
print(result)
\`\`\`

## Understanding Tools and Actions

Tools extend an agent's capabilities beyond text generation. Common tool types include:

- **Search tools** - Web, Wikipedia, or database search
- **Calculation tools** - Mathematical computations
- **API tools** - External service integrations
- **File tools** - Reading or writing to filesystem

## Adding Memory to Agents

Agents can maintain conversation history using memory:

\`\`\`python
from langchain.agents import Agent
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(memory_key="chat_history")

agent = Agent(
    llm=llm,
    tools=tools,
    memory=memory,
    verbose=True
)
\`\`\`

## Advanced Patterns

### Planning with ReAct

The ReAct (Reason + Act) pattern combines reasoning and action in a loop:

1. **Thought** - Agent analyzes the current situation
2. **Action** - Agent decides what tool to use
3. **Observation** - Agent processes the tool's response
4. Repeat until task is complete

### Multi-Agent Systems

For complex tasks, you can coordinate multiple agents:

\`\`\`python
class SupervisorAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Supervisor",
            tools=[tool_planner, tool_executor],
            system_prompt="You coordinate a team of specialized agents."
        )

    async def delegate(self, task: str):
        subtasks = await self.plan(task)
        results = await asyncio.gather(*[
            agent.execute(subtask) for agent in self.agents
        ])
        return self.synthesize(results)
\`\`\`

## Best Practices

1. **Start Simple** - Begin with basic tools before adding complexity
2. **Handle Errors** - Always implement error boundaries around tool calls
3. **Monitor Tokens** - Track LLM usage to manage costs
4. **Test Incrementally** - Test each tool independently before full integration

## Conclusion

AI agents represent a powerful paradigm for building autonomous systems. By combining LLMs with tools and memory, you can create agents that handle complex, multi-step tasks intelligently.

---

*This guide is part of our series on building production AI applications with Python.*
`,
};

const prevArticle = null;
const nextArticle = { title: "RAG Knowledge Base Agent", href: "/blog/knowledge-agent" };


export default async function ArticlePage({ params }: ArticleProps) {
  const { topic_slug, article_slug } = await params;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <CollapsedSidebarTrigger />
        <AppHeader />
        <div className="flex flex-1">
          <ArticleSidebar topicSlug={topic_slug} articleSlug={article_slug} />
          <SidebarInset>
            <div className="flex flex-1 flex-col py-12 px-8 max-w-3xl mx-auto">
              <div className="mb-4 pb-12 border-b text-left">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                  {dummyArticle.title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {dummyArticle.excerpt}
                </p>
              </div>

              <div className="flex-1">
                <MDXContent source={dummyArticle.content} />
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
                    <ColoredBadge color="violet">Get Started</ColoredBadge>
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
          </SidebarInset>
        </div>
        <AppFooter />
      </SidebarProvider>
    </div>
  );
}