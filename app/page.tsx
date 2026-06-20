import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CheckInShowcase } from "@/components/check-in-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { InstallCta } from "@/components/install-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <CheckInShowcase />
        <HowItWorks />
        <InstallCta />
      </main>
      <SiteFooter />
    </div>
  )
}
