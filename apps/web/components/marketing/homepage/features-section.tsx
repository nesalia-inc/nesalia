"use client"

import { Activity, ArrowRight, Bot, Globe, Workflow, Zap } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

export function FeaturesSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">
        {/* 1. MAP - Top Left */}
        <div className="relative border border-border p-8 lg:p-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Globe className="w-4 h-4" />
            Agent Activity
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Agents running globally.{" "}
            <span className="text-muted-foreground">Real-time monitoring across regions.</span>
          </h3>
          <div className="relative mt-4 h-40">
            <GlobalMap />
          </div>
        </div>

        {/* 2. FEATURED BLOCK - Top Right */}
        <div className="flex flex-col justify-between gap-4 p-8 lg:p-12 border border-border bg-muted/30">
          <div>
            <span className="text-xs flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Bot className="w-4 h-4" /> Featured
            </span>
            <h3 className="text-xl font-semibold text-foreground">
              Memory that persists.{" "}
              <span className="text-muted-foreground">Agents never forget context.</span>
            </h3>
          </div>
          <div className="flex items-center justify-center">
            <MemoryDemo />
          </div>
        </div>

        {/* 3. CHART - Bottom Left */}
        <div className="border border-border p-8 lg:p-12 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Activity className="w-4 h-4" />
            Workflow Performance
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Real-time analytics.{" "}
            <span className="text-muted-foreground">Track agent execution metrics.</span>
          </h3>
          <AnalyticsChart />
        </div>

        {/* 4. FEATURE CARDS - Bottom Right */}
        <div className="grid grid-cols-2 border border-border">
          <FeatureCard
            icon={<Bot className="w-4 h-4" />}
            title="AI Agents"
            subtitle="Deploy in seconds"
            description="Intelligent agents with persistent memory and context."
          />
          <FeatureCard
            icon={<Workflow className="w-4 h-4" />}
            title="Workflows"
            subtitle="Chain& automate"
            description="Build complex pipelines with visual workflow builder."
          />
        </div>
      </div>
    </section>
  )
}

// ----------------- Feature Card Component -------------------
function FeatureCard({
  icon,
  title,
  subtitle,
  description,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
}) {
  return (
    <div className="relative flex flex-col gap-3 p-4 border border-border bg-background transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        {subtitle}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="absolute bottom-2 right-2 p-2 flex items-center gap-2 border border-border rounded-full bg-background hover:bg-muted transition-colors">
        <ArrowRight className="w-4 h-4 text-primary" />
      </div>
    </div>
  )
}

// ----------------- Map -------------------
const mapPoints = [
  { x: 20, y: 25 }, { x: 45, y: 20 }, { x: 70, y: 30 },
  { x: 30, y: 35 }, { x: 55, y: 40 }, { x: 80, y: 25 },
  { x: 25, y: 45 }, { x: 50, y: 50 }, { x: 75, y: 45 },
  { x: 35, y: 55 }, { x: 60, y: 35 }, { x: 85, y: 50 },
]

const GlobalMap = () => (
  <svg viewBox="0 0 100 60" className="w-full h-full text-primary/30">
    {mapPoints.map((point, i) => (
      <circle key={i} cx={point.x} cy={point.y} r={1.5} fill="currentColor" />
    ))}
  </svg>
)

// ----------------- Memory Demo -------------------
const MemoryDemo = () => {
  const messages = [
    { role: "agent", content: "Analyzing your codebase structure..." },
    { role: "user", content: "What files are related to auth?" },
    { role: "agent", content: "Found 3 related files: login.tsx, auth.ts, session.ts" },
  ]

  return (
    <div className="w-full max-w-sm space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "flex gap-3 p-3 border border-border rounded-lg",
            msg.role === "agent" ? "bg-primary/5" : "bg-background"
          )}
        >
          <div className={cn(
            "w-2 h-2 rounded-full mt-2 shrink-0",
            msg.role === "agent" ? "bg-primary" : "bg-muted-foreground"
          )} />
          <p className="text-sm text-foreground">{msg.content}</p>
        </div>
      ))}
    </div>
  )
}

// ----------------- Chart -------------------
const chartData = [
  { month: "Jun", agents: 120, workflows: 80 },
  { month: "Jul", agents: 200, workflows: 150 },
  { month: "Aug", agents: 350, workflows: 280 },
  { month: "Sep", agents: 420, workflows: 320 },
  { month: "Oct", agents: 580, workflows: 450 },
  { month: "Nov", agents: 720, workflows: 600 },
]

const chartConfig = {
  agents: { label: "Agents", color: "#8B5CF6" },
  workflows: { label: "Workflows", color: "#A78BFA" },
} satisfies ChartConfig

function AnalyticsChart() {
  return (
    <ChartContainer className="h-40" config={chartConfig}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillAgents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-agents)" stopOpacity={0.4} />
            <stop offset="55%" stopColor="var(--color-agents)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillWorkflows" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-workflows)" stopOpacity={0.4} />
            <stop offset="55%" stopColor="var(--color-workflows)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis hide />
        <YAxis hide />
        <CartesianGrid vertical={false} horizontal={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          strokeWidth={2}
          dataKey="workflows"
          type="monotone"
          fill="url(#fillWorkflows)"
          stroke="var(--color-workflows)"
        />
        <Area
          strokeWidth={2}
          dataKey="agents"
          type="monotone"
          fill="url(#fillAgents)"
          stroke="var(--color-agents)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

// ----------------- Chart Components -------------------
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within ChartContainer")
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">& {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, c]) => c.theme || c.color)
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip as React.FC<RechartsPrimitive.TooltipProps<any, any>>

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & {
  active?: boolean
  payload?: Array<any>
  label?: React.ReactNode
}>(({ active, payload, className }, ref) => {
  if (!active || !payload?.length) return null

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-md",
        className
      )}
    >
      {payload.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-mono font-medium text-foreground">
            {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
          </span>
        </div>
      ))}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltip"
