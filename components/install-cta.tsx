import Image from "next/image"
import { ArrowRight, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstallCta() {
  return (
    <section id="install" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground text-background">
        <Image
          src="/event-table.png"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-25"
        />
        <div className="relative flex flex-col items-start gap-6 px-6 py-14 md:px-14 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-background/30 px-3 py-1 text-xs font-medium">
            <Smartphone className="size-3.5" />
            Add to home screen
          </span>
          <h2 className="max-w-2xl text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Install Flossy and run your next event with grace
          </h2>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-background/80">
            No app store, no clutter. Open Flossy in your browser, tap install,
            and it lives on your home screen — ready for the doorway.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="group rounded-full px-6"
              nativeButton={false}
              render={<a href="#top" />}
            >
              Get started free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <span className="text-sm text-background/70">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  )
}
