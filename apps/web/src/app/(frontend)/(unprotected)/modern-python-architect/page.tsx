import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Image {
  src: string;
  alt: string;
  srcDark?: string;
}
interface Button {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}
interface Badge {
  text: string;
  announcement?: string;
  url?: string;
}

interface HeroBasicProps {
  badge?: Badge;
  heading: string;
  description: string;
  buttons?: Buttons;
  image?: Image;
  className?: string;
}

interface Hero1Props extends HeroBasicProps {}
type Props = Partial<Hero1Props>;

const defaultProps: Hero1Props = {
  badge: {
    text: "Coming Soon",
    announcement: "Early access coming soon",
  },
  heading: "Modern Python Architect",
  description:
    "A comprehensive guide to building scalable, maintainable, and robust Python applications. Learn advanced patterns, architectural best practices, and production-ready techniques.",
  buttons: {
    primary: {
      text: "Sign Up",
      url: "/signup",
    },
    secondary: {
      text: "Login",
      url: "/login",
    },
  },
  image: {
    src: "",
    alt: "Hero image placeholder",
  },
};

const Hero1 = (props: Props) => {
  const { badge, heading, description, buttons, image, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("flex flex-1", className)}>
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          {badge && (
            <Badge variant="outline">
              {badge.text}
              <ArrowUpRight className="size-4" />
            </Badge>
          )}
          <h1 className="max-w-xl lg:max-w-3xl text-4xl font-semibold tracking-tight text-pretty md:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <p className="max-w-5xl text-balance text-muted-foreground lg:text-xl">
            {description}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            {buttons?.primary && (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={buttons.primary.url}>
                  {buttons.primary.text}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            )}
            {buttons?.secondary && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
              </Button>
            )}
          </div>
        </div>
        {image && (
          <div className="aspect-video w-full rounded-md border border-border bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image coming soon</span>
          </div>
        )}
      </div>
    </section>
  );
};

export { Hero1 };

export default function ModernPythonArchitect() {
  return <Hero1 />;
}
