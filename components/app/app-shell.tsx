"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ScanLine,
  MessageSquareText,
  Settings,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FlossyMark } from "@/components/flossy-mark"
import { EventSwitcher } from "@/components/app/event-switcher"

type NavItem = {
  href: string
  label: string
  icon: typeof Users
  primary?: boolean
}

const NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/guests", label: "Guests", icon: Users },
  { href: "/app/check-in", label: "Check-in", icon: ScanLine, primary: true },
  { href: "/app/templates", label: "Templates", icon: MessageSquareText },
  { href: "/app/settings", label: "Settings", icon: Settings },
]

const DESKTOP_NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/guests", label: "Guests", icon: Users },
  { href: "/app/check-in", label: "Check-in", icon: ScanLine },
  { href: "/app/import", label: "Import", icon: Upload },
  { href: "/app/templates", label: "Templates", icon: MessageSquareText },
  { href: "/app/settings", label: "Settings", icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app"
  return pathname === href || pathname.startsWith(href + "/")
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <Link href="/app" className="mb-8 flex items-center gap-2 px-2">
          <FlossyMark className="size-8" />
          <span className="font-heading text-lg font-semibold tracking-tight">Flossy</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {DESKTOP_NAV.map((item) => {
            const active = isActive(pathname, item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl bg-accent p-3 text-xs text-accent-foreground">
          <p className="font-semibold">Installed &amp; offline-ready</p>
          <p className="mt-1 text-accent-foreground/80">
            Your guest list stays editable even without signal at the venue.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-8">
          <Link href="/app" className="flex items-center gap-2 lg:hidden">
            <FlossyMark className="size-7" />
          </Link>
          <div className="min-w-0 flex-1">
            <EventSwitcher />
          </div>
        </header>

        <main className="flex-1 px-4 pt-5 pb-28 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-md items-end justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            const Icon = item.icon
            if (item.primary) {
              return (
                <li key={item.href} className="-mt-6">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex size-14 flex-col items-center justify-center rounded-full border-4 border-card shadow-lg transition-transform active:scale-95",
                      active ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
                    )}
                    aria-label={item.label}
                  >
                    <Icon className="size-6" />
                  </Link>
                </li>
              )
            }
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className={cn("size-5", active && "scale-110")} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
