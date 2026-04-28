import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from "@/components/ui/tooltip"

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
};
