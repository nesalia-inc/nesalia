interface ArticleProps {
  params: Promise<{
    topic_slug: string;
    article_slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { topic_slug, article_slug } = await params;

  return (
    <div className="flex flex-1 flex-col py-12 mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Article: {article_slug}</h1>
      <p className="text-muted-foreground">Topic: {topic_slug}</p>
    </div>
  );
}