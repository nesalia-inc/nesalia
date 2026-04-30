import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationProps {
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
}

export function ChapterNavigation({ prev, next }: NavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-8 mt-8 border-t">
      <div>
        {prev && (
          <Button variant="outline" asChild>
            <Link href={prev.href} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="truncate max-w-[150px]">{prev.title}</span>
            </Link>
          </Button>
        )}
      </div>
      <div>
        {next && (
          <Button variant="outline" asChild>
            <Link href={next.href} className="flex items-center gap-2">
              <span className="truncate max-w-[150px]">{next.title}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}