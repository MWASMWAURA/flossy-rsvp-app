const steps = [
  {
    number: "01",
    title: "Create your event",
    body: "Name the occasion, set the date, and import your guest list from a spreadsheet or by hand.",
  },
  {
    number: "02",
    title: "Reach out & track RSVPs",
    body: "Send invitations and reminders, then watch replies roll in with meals and plus-ones attached.",
  },
  {
    number: "03",
    title: "Greet guests at the door",
    body: "On the day, open the live check-in view and welcome everyone with a single tap.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            How it works
          </span>
          <h2 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Three steps from guest list to glowing welcome
          </h2>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="relative">
              <span className="font-serif text-5xl font-semibold text-primary/30">
                {step.number}
              </span>
              <h3 className="mt-3 font-serif text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
