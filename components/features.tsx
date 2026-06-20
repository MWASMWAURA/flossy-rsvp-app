import { Send, ScanLine, CalendarRange, WifiOff } from "lucide-react"

const features = [
  {
    icon: Send,
    title: "Guest outreach",
    body: "Send invitations, reminders, and thank-yous from one tidy contact list. Track who has opened, replied, and RSVP'd at a glance.",
  },
  {
    icon: ScanLine,
    title: "Effortless check-in",
    body: "Search a name, tap once, and they're greeted. Built for a busy doorway — large targets, instant feedback, no fumbling.",
  },
  {
    icon: CalendarRange,
    title: "Many events, one home",
    body: "Run a gala tonight and a wedding next weekend. Switch between events instantly while every guest list stays neatly separated.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    body: "Installable as a PWA, Flossy keeps working when the venue Wi-Fi doesn't. Check-ins sync the moment you're back online.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Everything in one place
          </span>
          <h2 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            From the first invite to the final guest
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Flossy is built around the rhythm of a real event — quiet planning,
            then a lively doorway. Each tool is shaped for the moment it's used.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary/40"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
