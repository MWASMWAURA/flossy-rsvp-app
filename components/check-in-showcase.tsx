import { Search, Check, Clock } from "lucide-react"

const guests = [
  { name: "Amara & Daniel Okafor", detail: "Table 4 · Party of 2", status: "arrived" },
  { name: "Priya Raman", detail: "Table 9 · Party of 1", status: "arrived" },
  { name: "The Castellano Family", detail: "Table 2 · Party of 5", status: "expected" },
  { name: "Jordan Wells", detail: "Table 12 · Party of 2", status: "expected" },
]

export function CheckInShowcase() {
  return (
    <section id="checkin" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="order-2 md:order-1">
          <div className="mx-auto w-full max-w-[320px]">
            <div className="rounded-[2.5rem] border-[10px] border-foreground/90 bg-background p-3 shadow-xl">
              <div className="rounded-[1.6rem] bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg font-semibold">Garden Gala</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Saturday · 142 expected</p>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                  <Search className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Search a guest…</span>
                </div>

                <ul className="mt-3 flex flex-col gap-2">
                  {guests.map((guest) => (
                    <li
                      key={guest.name}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          guest.status === "arrived"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {guest.status === "arrived" ? (
                          <Check className="size-4" />
                        ) : (
                          <Clock className="size-4" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {guest.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {guest.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 text-sm">
                  <span className="text-secondary-foreground">Arrived</span>
                  <span className="font-serif text-lg font-semibold text-secondary-foreground">
                    86 / 142
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Event day
          </span>
          <h2 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            A doorway that never feels rushed
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            When the guests arrive, Flossy turns into a calm reception desk.
            Big, tappable names. Live arrival counts. Meal and seating notes
            right where you need them.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {[
              "One-tap check-in with gentle haptic confirmation",
              "Live arrival count for the whole event",
              "Plus-ones, meals, and table notes at a glance",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3" />
                </span>
                <span className="leading-relaxed text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
