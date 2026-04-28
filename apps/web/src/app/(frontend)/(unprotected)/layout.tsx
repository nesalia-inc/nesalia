import { AppHeader } from '@/components/headers';


export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />

          {children}
    </>
  );
}
