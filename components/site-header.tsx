"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlossyMark } from "@/components/flossy-mark"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Check-in", href: "#checkin" },
  { label: "How it works", href: "#how" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Flossy RSVP home">
          <FlossyMark className="size-7 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-tight">FlossyRSVP</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            className="text-sm"
            nativeButton={false}
            render={<a href="#install" />}
          >
            Sign in
          </Button>
          <Button
            className="rounded-full px-5"
            nativeButton={false}
            render={<a href="#install" />}
          >
            Install app
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}
            <Button
              className="mt-2 rounded-full"
              nativeButton={false}
              render={<a href="#install" onClick={() => setOpen(false)} />}
            >
              Install app
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
