import { Badge } from "@/components/ui/badge"

type BadgeColor = "violet" | "pink" | "yellow" | "blue" | "orange" | "cyan"

interface ColoredBadgeProps {
  color: BadgeColor
  children: React.ReactNode
  className?: string
}

const colorClasses: Record<BadgeColor, { text: string; bg: string; border: string }> = {
  violet: { text: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  pink: { text: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  yellow: { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  blue: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  orange: { text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  cyan: { text: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
}

export function ColoredBadge({ color, children, className = "" }: ColoredBadgeProps) {
  const classes = colorClasses[color] ?? colorClasses.violet

  return (
    <Badge
      variant="outline"
      className={`rounded-sm ${classes.text} ${classes.bg} border ${classes.border} ${className}`}
    >
      {children}
    </Badge>
  )
}