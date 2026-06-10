"use client"

import { Button } from "@/components/ui/button"
import { HeroBadge } from "./hero-badge"
import { NpxPill } from "./npx-pill"
import { PixelBlast } from "@/components/pixel-blast"

export function HeroSection() {
  return (
    <section className="relative border-b border-border py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-25">
        <PixelBlast
          variant="circle"
          pixelSize={4}
          color="#ffffff"
          patternScale={1.5}
          patternDensity={0.7}
          enableRipples={false}
          edgeFade={0.3}
          speed={0.3}
        />
      </div>
      <div className="max-w-3xl mx-auto text-center">
        <HeroBadge version="v1.0" message="The agent platform is live" className="mb-6 bg-background" />
        <h1 className="text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
          The agent platform for the AI engineering era.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Deploy agents with memory. Build workflows with AI. Trigger from anywhere — GitHub, CLI, SDK, or webhooks.
        </p>
        <div className="mt-8 flex flex-col items-center gap-2 max-w-sm mx-auto">
          <div className="flex gap-2 w-full justify-center">
            <Button size="lg" className="h-11 w-1/2 text-base">Get Started</Button>
            <Button variant="secondary" size="lg" className="h-11 w-1/2 bg-background border border-border text-base">Read the Docs</Button>
          </div>
          <NpxPill command="npx nesalia setup" className="w-full" />
        </div>
      </div>
    </section>
  )
}