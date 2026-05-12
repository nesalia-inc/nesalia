import { AppHeader } from '@/components/headers';

export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="max-w-5xl mx-auto flex flex-1 items-stretch border-x border-border px-2">
        {children}
      </div>
    </>
  );
}
