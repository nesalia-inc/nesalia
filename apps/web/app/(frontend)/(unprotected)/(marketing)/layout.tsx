import { AppFooter } from "@/components/footers/app-footer"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
      <AppFooter />
    </div>
  )
}