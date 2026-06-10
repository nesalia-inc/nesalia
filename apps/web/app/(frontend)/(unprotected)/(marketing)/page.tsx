import {
  HeroSection,
  SocialProofSection,
  FeaturesSection,
  CodeExampleSection,
  CtaSection,
} from "@/components/marketing/homepage"

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto border-x">
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <CodeExampleSection />
      <CtaSection />
    </main>
  )
}