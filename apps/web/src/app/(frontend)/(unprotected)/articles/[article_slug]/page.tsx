interface ArticleProps {
  params: Promise<{
    article_slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { article_slug } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold">Article: {article_slug}</h1>
      <p className="text-muted-foreground">Article content coming soon.</p>
    </div>
  );
}
