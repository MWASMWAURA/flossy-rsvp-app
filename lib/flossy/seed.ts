import type { FlossyEvent, FlossyState, Guest } from "./types"
import { defaultStatuses, defaultTemplates, uid } from "./utils"

const events: FlossyEvent[] = [
  {
    id: "evt_marquez",
    name: "Marquez & Bloom Wedding",
    date: "2026-09-19",
    time: "4:30 PM",
    location: "The Botanical Pavilion",
    defaultCountryCode: "+1",
    color: "cobalt",
  },
  {
    id: "evt_gala",
    name: "Lantern Light Charity Gala",
    date: "2026-11-07",
    time: "7:00 PM",
    location: "Harbor Hall, Pier 12",
    defaultCountryCode: "+1",
    color: "violet",
  },
]

type SeedGuest = [string, string, string, string, string, number, boolean]
// [first, last, phone, statusId, lastContactedAgoHours | "", attempts, arrived]

function guest(
  eventId: string,
  first: string,
  last: string,
  phone: string,
  statusId: string,
  contactedHoursAgo: number | null,
  attempts: number,
  arrived: boolean,
): Guest {
  const now = Date.now()
  const lastContactedAt =
    contactedHoursAgo === null ? null : new Date(now - contactedHoursAgo * 3600_000).toISOString()
  const history: Guest["history"] = [
    { id: uid("h"), type: "created", label: "Added to guest list", at: new Date(now - 1000 * 60 * 60 * 72).toISOString() },
  ]
  if (lastContactedAt) {
    history.push({ id: uid("h"), type: "contact", label: "Text invite sent", at: lastContactedAt })
  }
  const arrivedAt = arrived ? new Date(now - 1000 * 60 * 18).toISOString() : null
  if (arrivedAt) history.push({ id: uid("h"), type: "arrived", label: "Checked in", at: arrivedAt })
  return {
    id: uid("g"),
    eventId,
    firstName: first,
    lastName: last,
    phone,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    statusId,
    notes: "",
    customFields: {},
    qrCodeId: uid("qr"),
    contactAttempts: attempts,
    lastContactedAt,
    arrivedAt,
    history,
  }
}

const weddingGuests: Guest[] = [
  guest("evt_marquez", "Amara", "Okafor", "+14155550112", "st_confirmed", 26, 1, true),
  guest("evt_marquez", "Diego", "Santos", "+14155550133", "st_confirmed", 20, 2, true),
  guest("evt_marquez", "Priya", "Nair", "+14155550144", "st_maybe", 5, 1, false),
  guest("evt_marquez", "Liam", "Walsh", "+14155550155", "st_invited", null, 0, false),
  guest("evt_marquez", "Sofia", "Rossi", "+14155550166", "st_declined", 48, 3, false),
  guest("evt_marquez", "Noah", "Kim", "+14155550177", "st_noanswer", 12, 2, false),
  guest("evt_marquez", "Hannah", "Levi", "+14155550188", "st_confirmed", 30, 1, true),
  guest("evt_marquez", "Mateo", "Garcia", "+14155550199", "st_invited", null, 0, false),
  guest("evt_marquez", "Yuki", "Tanaka", "+14155550211", "st_confirmed", 8, 1, false),
  guest("evt_marquez", "Grace", "Mwangi", "+14155550222", "st_maybe", 3, 1, false),
  guest("evt_marquez", "Omar", "Haddad", "+14155550233", "st_noanswer", 16, 2, false),
  guest("evt_marquez", "Bella", "Nguyen", "+14155550244", "st_confirmed", 22, 1, true),
]

const galaGuests: Guest[] = [
  guest("evt_gala", "Eleanor", "Vance", "+12125550100", "st_confirmed", 40, 1, false),
  guest("evt_gala", "Marcus", "Bennett", "+12125550101", "st_invited", null, 0, false),
  guest("evt_gala", "Aisha", "Rahman", "+12125550102", "st_maybe", 6, 1, false),
  guest("evt_gala", "Theo", "Lindqvist", "+12125550103", "st_declined", 60, 2, false),
  guest("evt_gala", "Camille", "Dubois", "+12125550104", "st_confirmed", 18, 1, false),
  guest("evt_gala", "Raj", "Patel", "+12125550105", "st_noanswer", 9, 3, false),
]

export function seedState(): FlossyState {
  return {
    events,
    currentEventId: events[0].id,
    statuses: defaultStatuses(),
    templates: defaultTemplates(),
    guests: [...weddingGuests, ...galaGuests],
  }
}
