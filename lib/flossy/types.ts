export type StatusKind = "pending" | "confirmed" | "declined" | "noresponse"

export type BrandColor = "cobalt" | "amber" | "teal" | "violet" | "coral"

export type GuestStatus = {
  id: string
  label: string
  color: BrandColor
  kind: StatusKind
  order: number
}

export type HistoryEntry = {
  id: string
  type: "contact" | "status" | "arrived" | "note" | "created"
  label: string
  at: string // ISO
}

export type Guest = {
  id: string
  eventId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  statusId: string
  notes: string
  customFields: Record<string, string>
  qrCodeId: string
  contactAttempts: number
  lastContactedAt: string | null
  arrivedAt: string | null
  history: HistoryEntry[]
}

export type FlossyEvent = {
  id: string
  name: string
  date: string // ISO date
  time: string
  location: string
  defaultCountryCode: string // e.g. "+1"
  color: BrandColor
}

export type MessageTemplate = {
  id: string
  name: string
  body: string
}

export type FlossyState = {
  events: FlossyEvent[]
  currentEventId: string
  statuses: GuestStatus[]
  templates: MessageTemplate[]
  guests: Guest[]
}
