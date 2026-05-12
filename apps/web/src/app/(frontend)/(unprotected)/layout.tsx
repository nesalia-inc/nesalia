import { AppHeader } from '@/components/headers';

export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="border-x border-border px-2 mx-auto w-full max-w-6xl flex-1 flex items-center">
        {children}
      </div>
    </div>
  );
}
