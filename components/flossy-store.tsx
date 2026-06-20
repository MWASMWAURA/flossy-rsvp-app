"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  FlossyEvent,
  FlossyState,
  Guest,
  GuestStatus,
  MessageTemplate,
} from "@/lib/flossy/types"
import { seedState } from "@/lib/flossy/seed"
import { uid } from "@/lib/flossy/utils"

const STORAGE_KEY = "flossy-rsvp-state-v1"

type NewGuestInput = Omit<
  Guest,
  "id" | "qrCodeId" | "contactAttempts" | "lastContactedAt" | "arrivedAt" | "history" | "statusId"
> & { statusId?: string }

type StoreValue = {
  ready: boolean
  state: FlossyState
  currentEvent: FlossyEvent | undefined
  eventGuests: Guest[]
  setCurrentEvent: (id: string) => void
  addEvent: (e: Omit<FlossyEvent, "id">) => string
  updateEvent: (id: string, patch: Partial<FlossyEvent>) => void
  addGuests: (guests: NewGuestInput[]) => void
  updateGuest: (id: string, patch: Partial<Guest>) => void
  deleteGuest: (id: string) => void
  setGuestStatus: (id: string, statusId: string) => void
  bulkSetStatus: (ids: string[], statusId: string) => void
  logContact: (id: string, channel: "call" | "text", note?: string) => void
  markArrived: (id: string) => void
  undoArrived: (id: string) => void
  addNote: (id: string, note: string) => void
  guestByQr: (qr: string) => Guest | undefined
  setStatuses: (statuses: GuestStatus[]) => void
  addTemplate: (t: Omit<MessageTemplate, "id">) => void
  updateTemplate: (id: string, patch: Partial<MessageTemplate>) => void
  deleteTemplate: (id: string) => void
  resetDemo: () => void
}

const FlossyContext = createContext<StoreValue | null>(null)

function nowIso() {
  return new Date().toISOString()
}

export function FlossyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FlossyState>(() => seedState())
  const [ready, setReady] = useState(false)
  const hydrated = useRef(false)

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as FlossyState
        if (parsed && Array.isArray(parsed.events) && parsed.events.length) {
          setState(parsed)
        }
      }
    } catch {
      // ignore corrupt storage
    }
    hydrated.current = true
    setReady(true)
  }, [])

  // persist
  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage may be full or unavailable
    }
  }, [state])

  const setCurrentEvent = useCallback((id: string) => {
    setState((s) => ({ ...s, currentEventId: id }))
  }, [])

  const addEvent = useCallback((e: Omit<FlossyEvent, "id">) => {
    const id = uid("evt")
    setState((s) => ({ ...s, events: [...s.events, { ...e, id }], currentEventId: id }))
    return id
  }, [])

  const updateEvent = useCallback((id: string, patch: Partial<FlossyEvent>) => {
    setState((s) => ({
      ...s,
      events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }, [])

  const addGuests = useCallback((guests: NewGuestInput[]) => {
    setState((s) => {
      const firstStatus = s.statuses[0]?.id ?? "st_invited"
      const created = guests.map<Guest>((g) => ({
        notes: "",
        customFields: {},
        ...g,
        id: uid("g"),
        statusId: g.statusId ?? firstStatus,
        qrCodeId: uid("qr"),
        contactAttempts: 0,
        lastContactedAt: null,
        arrivedAt: null,
        history: [{ id: uid("h"), type: "created", label: "Added to guest list", at: nowIso() }],
      }))
      return { ...s, guests: [...s.guests, ...created] }
    })
  }, [])

  const updateGuest = useCallback((id: string, patch: Partial<Guest>) => {
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }))
  }, [])

  const deleteGuest = useCallback((id: string) => {
    setState((s) => ({ ...s, guests: s.guests.filter((g) => g.id !== id) }))
  }, [])

  const applyStatus = useCallback(
    (s: FlossyState, id: string, statusId: string): Guest[] => {
      const label = s.statuses.find((st) => st.id === statusId)?.label ?? "Updated"
      return s.guests.map((g) =>
        g.id === id
          ? {
              ...g,
              statusId,
              history: [
                { id: uid("h"), type: "status", label: `Status set to ${label}`, at: nowIso() },
                ...g.history,
              ],
            }
          : g,
      )
    },
    [],
  )

  const setGuestStatus = useCallback(
    (id: string, statusId: string) => {
      setState((s) => ({ ...s, guests: applyStatus(s, id, statusId) }))
    },
    [applyStatus],
  )

  const bulkSetStatus = useCallback((ids: string[], statusId: string) => {
    setState((s) => {
      const label = s.statuses.find((st) => st.id === statusId)?.label ?? "Updated"
      const set = new Set(ids)
      return {
        ...s,
        guests: s.guests.map((g) =>
          set.has(g.id)
            ? {
                ...g,
                statusId,
                history: [
                  { id: uid("h"), type: "status", label: `Status set to ${label}`, at: nowIso() },
                  ...g.history,
                ],
              }
            : g,
        ),
      }
    })
  }, [])

  const logContact = useCallback((id: string, channel: "call" | "text", note?: string) => {
    const at = nowIso()
    const label = note ?? (channel === "call" ? "Call placed" : "Text message sent")
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) =>
        g.id === id
          ? {
              ...g,
              contactAttempts: g.contactAttempts + 1,
              lastContactedAt: at,
              history: [{ id: uid("h"), type: "contact", label, at }, ...g.history],
            }
          : g,
      ),
    }))
  }, [])

  const markArrived = useCallback((id: string) => {
    const at = nowIso()
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) =>
        g.id === id
          ? {
              ...g,
              arrivedAt: at,
              history: [{ id: uid("h"), type: "arrived", label: "Checked in", at }, ...g.history],
            }
          : g,
      ),
    }))
  }, [])

  const undoArrived = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) => (g.id === id ? { ...g, arrivedAt: null } : g)),
    }))
  }, [])

  const addNote = useCallback((id: string, note: string) => {
    const at = nowIso()
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) =>
        g.id === id
          ? {
              ...g,
              notes: note,
              history: [{ id: uid("h"), type: "note", label: "Note updated", at }, ...g.history],
            }
          : g,
      ),
    }))
  }, [])

  const setStatuses = useCallback((statuses: GuestStatus[]) => {
    setState((s) => ({ ...s, statuses }))
  }, [])

  const addTemplate = useCallback((t: Omit<MessageTemplate, "id">) => {
    setState((s) => ({ ...s, templates: [...s.templates, { ...t, id: uid("tpl") }] }))
  }, [])

  const updateTemplate = useCallback((id: string, patch: Partial<MessageTemplate>) => {
    setState((s) => ({
      ...s,
      templates: s.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setState((s) => ({ ...s, templates: s.templates.filter((t) => t.id !== id) }))
  }, [])

  const resetDemo = useCallback(() => {
    setState(seedState())
  }, [])

  const currentEvent = useMemo(
    () => state.events.find((e) => e.id === state.currentEventId),
    [state.events, state.currentEventId],
  )

  const eventGuests = useMemo(
    () => state.guests.filter((g) => g.eventId === state.currentEventId),
    [state.guests, state.currentEventId],
  )

  const guestByQr = useCallback(
    (qr: string) =>
      state.guests.find((g) => g.qrCodeId === qr && g.eventId === state.currentEventId),
    [state.guests, state.currentEventId],
  )

  const value: StoreValue = {
    ready,
    state,
    currentEvent,
    eventGuests,
    setCurrentEvent,
    addEvent,
    updateEvent,
    addGuests,
    updateGuest,
    deleteGuest,
    setGuestStatus,
    bulkSetStatus,
    logContact,
    markArrived,
    undoArrived,
    addNote,
    guestByQr,
    setStatuses,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    resetDemo,
  }

  return <FlossyContext.Provider value={value}>{children}</FlossyContext.Provider>
}

export function useFlossy() {
  const ctx = useContext(FlossyContext)
  if (!ctx) throw new Error("useFlossy must be used within FlossyProvider")
  return ctx
}
