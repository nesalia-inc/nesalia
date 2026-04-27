import { Header } from '@/components/header';


export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      
          {children}
    </>
  );
}
