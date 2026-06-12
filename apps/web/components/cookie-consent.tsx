/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "nesalia-cookies-accepted"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setVisible(!localStorage.getItem(STORAGE_KEY))
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "all")
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "necessary")
    setVisible(false)
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-2 left-2 right-2 z-50 md:left-auto md:right-2 md:max-w-sm"
        >
          <div className="flex w-full flex-col gap-4 rounded-lg border border-border bg-background p-4 text-sm shadow-lg ">
            <Cookie className="size-8 text-primary" />
            <div className="space-y-1">
              <p className="font-medium">Your Data, Your Choice</p>
              <p className="text-muted-foreground">
                We use cookies to improve our services. Click &ldquo;Accept All&rdquo; to continue or &ldquo;Manage Preferences&rdquo; to customize.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAccept} className="flex-1">
                Accept All
              </Button>
              <Button variant="outline" onClick={handleDecline} className="flex-1">
                Manage Preferences
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
