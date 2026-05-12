import Link from "next/link";

const articles = [
  { slug: "hello-world", title: "Hello World", date: "2026-01-01" },
  { slug: "getting-started", title: "Getting Started", date: "2026-01-15" },
];

export default function Articles() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-12 w-full">
      <h1 className="text-3xl font-bold">Articles</h1>
      <ul className="flex flex-col gap-2">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </Link>
            <span className="text-sm text-muted-foreground ml-2">
              — {article.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
