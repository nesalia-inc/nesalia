import { CodeBlock } from "@/components/code-block"

const codeExample = `import { createClient } from '@nesalia/sdk';

const client = createClient({
  apiKey: process.env.NESALIA_API_KEY
});

const agent = await client.agents.create({
  name: 'code-reviewer',
  model: 'anthropic/claude-sonnet-4-6',
  instructions: 'You are an expert reviewer...'
});

const response = await client.agents.invoke(
  agent.id,
  { prompt: 'Review PR #123' }
);`

export function CodeExampleSection() {
  return (
    <section className="border-b border-border px-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 py-24">
        <div>
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
            Simple to use
          </h2>
          <p className="mt-4 text-muted-foreground">
            Just a few lines of code to create an agent and start automating.
          </p>
        </div>
        <CodeBlock code={codeExample} language="typescript" size="lg" />
      </div>
    </section>
  )
}