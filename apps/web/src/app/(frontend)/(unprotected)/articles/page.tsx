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
  {
    slug: "remote-work",
    title: "Mastering Remote Work: Tips for Success",
    excerpt:
      "Discover best practices for working from home and staying productive in a remote environment.",
    category: "Work",
    date: "2026-04-20",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg",
  },
  {
    slug: "design-systems",
    title: "Building Scalable Design Systems",
    excerpt:
      "Learn how to create and maintain design systems that scale across your organization.",
    category: "Design",
    date: "2026-04-18",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-6.svg",
  },
  {
    slug: "cloud-computing",
    title: "The Evolution of Cloud Computing",
    excerpt:
      "Explore the latest trends in cloud computing and how they are reshaping enterprise infrastructure.",
    category: "Technology",
    date: "2026-04-15",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-7.svg",
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

      <div className="grid grid-cols-1 divide-y">
        <Link href={`/articles/${featuredArticle.slug}`} className="grid grid-cols-1 items-center gap-8 border-t p-4 md:grid-cols-2 lg:gap-16">
          <img
            alt={featuredArticle.title}
            className="aspect-[2/1] w-full rounded-lg object-cover"
            src={featuredArticle.image}
          />
          <div className="flex flex-col items-start gap-4">
            <Badge variant="secondary">{featuredArticle.category}</Badge>
            <h2 className="text-xl font-semibold text-balance md:max-w-lg lg:text-2xl">
              {featuredArticle.title}
            </h2>
            <p className="text-sm text-muted-foreground md:max-w-lg">
              {featuredArticle.excerpt}
            </p>
          </div>
        </Link>

        <div className="grid grid-cols-1 divide-x divide-y md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="flex flex-col items-start gap-3 p-4 transition-colors hover:bg-muted/50"
            >
              <img
                alt={article.title}
                className="aspect-[2/1] w-full rounded-lg object-cover"
                src={article.image}
              />
              <Badge variant="secondary">{article.category}</Badge>
              <h3 className="text-base font-semibold text-balance md:max-w-md">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground md:max-w-md">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}