import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckInCard } from "@/components/check-in-card"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-2 md:gap-8 md:px-8 md:pb-24 md:pt-20">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            The reception desk in your pocket
          </span>

          <h1 className="mt-6 text-pretty font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Welcome every guest{" "}
            <span className="italic text-primary">beautifully.</span>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Flossy RSVP helps event coordinators manage guest outreach and glide
            through event-day check-in — all from a phone that feels like a
            warm welcome.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="group rounded-full px-6"
              nativeButton={false}
              render={<a href="#install" />}
            >
              Install the app
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-6"
              nativeButton={false}
              render={<a href="#checkin" />}
            >
              See check-in
            </Button>
          </div>

          <dl className="mt-10 flex gap-8">
            <div>
              <dt className="text-sm text-muted-foreground">Avg. check-in</dt>
              <dd className="font-serif text-2xl font-semibold">3.2s</dd>
            </div>
            <div className="border-l border-border pl-8">
              <dt className="text-sm text-muted-foreground">Events run</dt>
              <dd className="font-serif text-2xl font-semibold">12k+</dd>
            </div>
            <div className="border-l border-border pl-8">
              <dt className="text-sm text-muted-foreground">Guests greeted</dt>
              <dd className="font-serif text-2xl font-semibold">1.4M</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-sm">
            <Image
              src="/reception-desk.png"
              alt="An elegant event welcome desk in warm natural light"
              width={720}
              height={820}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-4 w-60 md:-left-10 md:w-64">
            <CheckInCard />
          </div>
        </div>
      </div>
    </section>
  )
}
