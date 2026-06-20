import type { BrandColor, FlossyEvent, Guest, GuestStatus, MessageTemplate } from "./types"

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function fullName(g: Guest): string {
  return `${g.firstName} ${g.lastName}`.trim() || "Unnamed guest"
}

export function initials(g: Guest): string {
  const a = g.firstName?.[0] ?? ""
  const b = g.lastName?.[0] ?? ""
  return (a + b).toUpperCase() || "?"
}

/** Strip spaces/dashes/parens and apply a default country code when missing. */
export function cleanPhone(raw: string, defaultCountry = "+1"): string {
  if (!raw) return ""
  let p = raw.trim().replace(/[\s\-().]/g, "")
  if (p.startsWith("00")) p = "+" + p.slice(2)
  if (p.startsWith("+")) return p
  // Bare number: prepend default country code.
  const digits = p.replace(/\D/g, "")
  if (!digits) return ""
  return `${defaultCountry}${digits}`
}

export function formatPhone(p: string): string {
  if (!p) return ""
  // light formatting for +1 NANP numbers, otherwise return as-is
  const m = p.match(/^\+1(\d{3})(\d{3})(\d{4})$/)
  if (m) return `+1 (${m[1]}) ${m[2]}-${m[3]}`
  return p
}

export function renderTemplate(
  body: string,
  guest: Guest,
  event: FlossyEvent | undefined,
): string {
  const map: Record<string, string> = {
    first_name: guest.firstName || "there",
    last_name: guest.lastName || "",
    full_name: fullName(guest),
    event_name: event?.name ?? "",
    event_date: event ? formatEventDate(event.date) : "",
    event_time: event?.time ?? "",
    event_location: event?.location ?? "",
  }
  return body.replace(/\{\{\s*([\w]+)\s*\}\}/g, (_, key: string) => map[key] ?? `{{${key}}}`)
}

export function formatEventDate(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""))
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" })
}

export function relativeTime(iso: string | null): string {
  if (!iso) return "—"
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.round(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function statusById(statuses: GuestStatus[], id: string): GuestStatus | undefined {
  return statuses.find((s) => s.id === id)
}

export const COLOR_CLASSES: Record<
  BrandColor,
  { dot: string; soft: string; solid: string; text: string; ring: string }
> = {
  cobalt: {
    dot: "bg-cobalt",
    soft: "bg-cobalt/12 text-cobalt",
    solid: "bg-cobalt text-cobalt-foreground",
    text: "text-cobalt",
    ring: "ring-cobalt/30",
  },
  amber: {
    dot: "bg-amber",
    soft: "bg-amber/18 text-amber-foreground",
    solid: "bg-amber text-amber-foreground",
    text: "text-amber-foreground",
    ring: "ring-amber/40",
  },
  teal: {
    dot: "bg-teal",
    soft: "bg-teal/16 text-teal-foreground",
    solid: "bg-teal text-teal-foreground",
    text: "text-teal-foreground",
    ring: "ring-teal/40",
  },
  violet: {
    dot: "bg-violet",
    soft: "bg-violet/14 text-violet",
    solid: "bg-violet text-violet-foreground",
    text: "text-violet",
    ring: "ring-violet/30",
  },
  coral: {
    dot: "bg-coral",
    soft: "bg-coral/14 text-coral",
    solid: "bg-coral text-coral-foreground",
    text: "text-coral",
    ring: "ring-coral/30",
  },
}

export type EventMetrics = {
  invited: number
  contacted: number
  confirmed: number
  declined: number
  noResponse: number
  arrived: number
}

export function computeMetrics(guests: Guest[], statuses: GuestStatus[]): EventMetrics {
  let confirmed = 0
  let declined = 0
  let contacted = 0
  let arrived = 0
  for (const g of guests) {
    const st = statusById(statuses, g.statusId)
    if (st?.kind === "confirmed") confirmed++
    if (st?.kind === "declined") declined++
    if (g.contactAttempts > 0 || g.lastContactedAt) contacted++
    if (g.arrivedAt) arrived++
  }
  const invited = guests.length
  return {
    invited,
    contacted,
    confirmed,
    declined,
    noResponse: invited - confirmed - declined,
    arrived,
  }
}

export function defaultStatuses(): GuestStatus[] {
  return [
    { id: "st_invited", label: "Invited", color: "cobalt", kind: "pending", order: 0 },
    { id: "st_confirmed", label: "Confirmed", color: "teal", kind: "confirmed", order: 1 },
    { id: "st_maybe", label: "Maybe", color: "amber", kind: "pending", order: 2 },
    { id: "st_noanswer", label: "No Answer", color: "violet", kind: "noresponse", order: 3 },
    { id: "st_declined", label: "Declined", color: "coral", kind: "declined", order: 4 },
  ]
}

export function defaultTemplates(): MessageTemplate[] {
  return [
    {
      id: "tpl_invite",
      name: "Initial Invite",
      body: "Hi {{first_name}}! You're invited to {{event_name}} on {{event_date}} at {{event_location}}. Can you make it? Just reply YES or NO. — Flossy",
    },
    {
      id: "tpl_reminder",
      name: "Reminder",
      body: "Hi {{first_name}}, just a gentle reminder about {{event_name}} on {{event_date}}. Hope to see you at {{event_time}}!",
    },
    {
      id: "tpl_thanks",
      name: "Thank You",
      body: "Thanks for confirming, {{first_name}}! We can't wait to celebrate with you at {{event_name}}. See you {{event_date}}.",
    },
  ]
}
