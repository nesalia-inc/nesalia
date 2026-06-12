import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { AppProvider } from "@/components/providers"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nesalia",
  description: "AI agents that work for you",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className="antialiased">
        <AppProvider>
          {children}
          <CookieConsent />
        </AppProvider>
      </body>
    </html>
  )
}