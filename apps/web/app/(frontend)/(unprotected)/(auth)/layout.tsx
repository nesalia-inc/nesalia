import { AppHeader } from "@/components/headers/app-header"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      {children}
    </div>
  )
}
