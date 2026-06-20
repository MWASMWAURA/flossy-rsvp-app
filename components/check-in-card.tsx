import { Check } from "lucide-react"

export function CheckInCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Table 4
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          <Check className="size-3" />
          Arrived
        </span>
      </div>
      <p className="mt-2 font-serif text-lg font-semibold leading-tight">
        Amara &amp; Daniel Okafor
      </p>
      <p className="text-sm text-muted-foreground">Party of 2 · Vegetarian</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          AO
        </span>
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          DO
        </span>
        <span className="ml-auto text-xs text-muted-foreground">7:42 PM</span>
      </div>
    </div>
  )
}
