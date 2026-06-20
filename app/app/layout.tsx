import type { Metadata } from "next"
import { FlossyProvider } from "@/components/flossy-store"
import { AppShell } from "@/components/app/app-shell"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Flossy RSVP — Workspace",
  description: "Manage guest outreach and event-day check-in.",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FlossyProvider>
      <AppShell>{children}</AppShell>
      <Toaster position="top-center" />
    </FlossyProvider>
  )
}
