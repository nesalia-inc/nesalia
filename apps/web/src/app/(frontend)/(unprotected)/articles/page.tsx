import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
    slug: "business-growth",
    title: "Strategies for Effective Business Growth in 2025",
    excerpt:
      "Learn proven strategies to grow your business and stay competitive in the ever-evolving market landscape.",
    category: "Business",
    date: "2026-04-28",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
  },
  {
    slug: "wellness-trends",
    title: "Top Wellness Trends to Improve Your Health in 2025",
    excerpt:
      "Explore the top wellness trends that can help you achieve a healthier and more balanced lifestyle.",
    category: "Health & Wellness",
    date: "2026-04-25",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
  },
  {
    slug: "productivity-tools",
    title: "Boosting Productivity with Smart Tools and Techniques",
    excerpt:
      "Find out how to enhance your productivity using the latest tools and techniques for better time management.",
    category: "Productivity",
    date: "2026-04-22",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
  },
];

export default function Articles() {
  return (
    <div className="flex flex-1 flex-col gap-16 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-medium md:text-5xl lg:text-6xl">
          Insights and Trends Blog
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Stay updated with the latest insights, trends, and tips across various
          topics to keep ahead of the curve.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-16">
        <img
          alt={featuredArticle.title}
          className="aspect-video rounded-lg object-cover"
          src={featuredArticle.image}
        />
        <div className="flex flex-col items-start gap-4">
          <Badge variant="secondary">{featuredArticle.category}</Badge>
          <h2 className="text-2xl font-semibold text-balance md:max-w-lg lg:text-3xl">
            {featuredArticle.title}
          </h2>
          <p className="text-muted-foreground md:max-w-lg">
            {featuredArticle.excerpt}
          </p>
        </div>
      </div>

      <p className="text-2xl font-medium md:text-3xl">Popular Posts</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
        {articles.map((article) => (
          <div key={article.slug} className="flex flex-col items-start gap-4">
            <img
              alt={article.title}
              className="aspect-video rounded-lg object-cover"
              src={article.image}
            />
            <Badge variant="secondary">{article.category}</Badge>
            <h3 className="text-xl font-semibold text-balance md:max-w-md">
              {article.title}
            </h3>
            <p className="text-muted-foreground md:max-w-md">{article.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}