import * as React from "react"
import Link from "next/link"
import { Card as CardRoot, CardContent } from "@/components/ui/card"
import { ColoredBadge, type BadgeColor } from "@/components/colored-badge"
import { ArrowRight, type LucideIcon } from "lucide-react"

interface CardProps {
  href?: string
  title: string
  icon?: LucideIcon
  badge?: string
  badgeColor?: BadgeColor
  className?: string
  children: React.ReactNode
}

export function Card({
  href,
  title,
  icon: Icon,
  badge,
  badgeColor = "violet",
  className = "",
  children,
}: CardProps) {
  const content = (
    <CardRoot className={`p-4 rounded-md hover:border-primary/50 transition-colors bg-background flex flex-col ${className}`}>
      <CardContent className="p-0 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <h3 className="font-semibold">{title}</h3>
          </div>
          {badge && (
            <ColoredBadge color={badgeColor}>{badge}</ColoredBadge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
        {href && (
          <div className="flex items-center gap-1 text-sm font-medium mt-auto text-foreground">
            Read More <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </CardContent>
    </CardRoot>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

interface CardsProps {
  className?: string
  children: React.ReactNode
}

export function Cards({ className = "", children }: CardsProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {children}
    </div>
  )
}