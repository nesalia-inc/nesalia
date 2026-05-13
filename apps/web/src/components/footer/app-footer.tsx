import Link from "next/link"
import Image from "next/image"

export function AppFooter() {
  return (
    <footer className="border-t border-border">
      <div className="flex items-center justify-between w-full px-4 mx-auto max-w-7xl py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/nesalia.svg"
            alt="Logo"
            width={24}
            height={24}
            loading="eager"
          />
          <span className="text-sm text-muted-foreground">Nesalia</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
            Articles
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            Blog
          </Link>
          <Link href="/modern-python-architect" className="text-sm text-muted-foreground hover:text-foreground">
            Book
          </Link>
        </div>
      </div>
    </footer>
  )
}