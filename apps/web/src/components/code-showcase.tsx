"use client"

import * as React from "react"
import { codeToHtml } from "shiki"
import { motion, AnimatePresence } from "framer-motion"

interface CodeShowcaseProps {
  code: string[]
  language?: string
  title?: string
  interval?: number
}

export function CodeShowcase({ code, language = "python", title, interval = 3000 }: CodeShowcaseProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [htmls, setHtmls] = React.useState<string[]>([])

  React.useEffect(() => {
    Promise.all(
      code.map(c =>
        codeToHtml(c, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
        })
      )
    ).then(setHtmls)
  }, [code, language])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % code.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval, code.length])

  return (
    <div className="h-full w-full overflow-hidden rounded-md border">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b bg-muted/30">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        {title && <span className="ml-2 text-xs text-muted-foreground">{title}</span>}
      </div>
      <div className="relative p-4 font-mono text-sm overflow-x-auto bg-[#0a0a0a]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            dangerouslySetInnerHTML={{ __html: htmls[currentIndex] || "" }}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}