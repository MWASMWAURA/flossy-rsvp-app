import { FlossyMark } from "@/components/flossy-mark"

const groups = [
  {
    heading: "Product",
    links: ["Features", "Check-in", "How it works", "Pricing"],
  },
  {
    heading: "Company",
    links: ["About", "Stories", "Careers", "Contact"],
  },
  {
    heading: "Support",
    links: ["Help center", "Guides", "Status", "Privacy"],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <FlossyMark className="size-7 text-primary" />
              <span className="font-serif text-xl font-semibold tracking-tight">Flossy</span>
            </div>
            <p className="mt-4 max-w-xs text-pretty leading-relaxed text-muted-foreground">
              The reception desk in your pocket. Outreach and event-day check-in
              for coordinators who care about the welcome.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold">{group.heading}</h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Flossy RSVP. All rights reserved.</p>
          <p>Made for hosts who love a warm welcome.</p>
        </div>
      </div>
    </footer>
  )
}
