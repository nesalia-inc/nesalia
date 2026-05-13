"use client"

import { ArticleSidebar } from "@/components/sidebar/article-sidebar"
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

export default async function ArticlePage({ params }: ArticleProps) {
  const { topic_slug, article_slug } = await params;

  return (
    <SidebarProvider>
      <div className="flex flex-1">
        <ArticleSidebar topicSlug={topic_slug} articleSlug={article_slug} />
        <SidebarInset>
          <div className="flex flex-1 flex-col py-12 px-8">
            <h1 className="text-3xl font-bold">Article: {article_slug}</h1>
            <p className="text-muted-foreground">Topic: {topic_slug}</p>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}