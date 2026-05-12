import { AppHeader } from '@/components/headers';

export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="border-x border-border px-2">
        <div className="max-w-5xl">
          {children}
        </div>
      </div>
    </>
  );
}
