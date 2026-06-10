"use client"

import { Button } from "@/components/ui/button"
import { PixelBlast } from "@/components/pixel-blast"

export function CtaSection() {
  return (
    <section className="relative border-b border-border py-24 overflow-hidden">
      {/* Background */}
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

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
          Ready to automate with AI agents?
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Start building today. No credit card required.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="h-11 px-10 text-base">
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" className="h-11 px-10 text-base">
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  )
}