"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Upload, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useFlossy } from "@/components/flossy-store"
import { fullName, relativeTime, statusById } from "@/lib/flossy/utils"
import { StatusBadge } from "@/components/app/status-badge"
import type { Guest } from "@/lib/flossy/types"
import { toast } from "sonner"

export default function GuestsPage() {
  const { eventGuests, state, deleteGuest, bulkSetStatus, logContact } = useFlossy()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "status" | "contacted" | "attempts">("name")
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set())
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...eventGuests]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (g) =>
          fullName(g).toLowerCase().includes(q) ||
          g.phone.includes(q) ||
          g.email.toLowerCase().includes(q),
      )
    }

    if (filterStatus) {
      result = result.filter((g) => g.statusId === filterStatus)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return fullName(a).localeCompare(fullName(b))
        case "status":
          return a.statusId.localeCompare(b.statusId)
        case "contacted":
          return (
            (b.lastContactedAt?.localeCompare(a.lastContactedAt ?? "") ?? 1)
          )
        case "attempts":
          return b.contactAttempts - a.contactAttempts
        default:
          return 0
      }
    })

    return result
  }, [eventGuests, searchQuery, filterStatus, sortBy])

  const toggleSelectGuest = (id: string) => {
    const updated = new Set(selectedGuests)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setSelectedGuests(updated)
  }

  const handleBulkStatusChange = (statusId: string) => {
    if (selectedGuests.size === 0) return
    bulkSetStatus(Array.from(selectedGuests), statusId)
    setSelectedGuests(new Set())
    setBulkStatusOpen(false)
    toast.success(`Updated ${selectedGuests.size} guest(s)`)
  }

  const handleBulkReminder = () => {
    if (selectedGuests.size === 0) return
    // For demo, just log contact for each
    Array.from(selectedGuests).forEach((id) => {
      logContact(id, "text", "Reminder sent")
    })
    setSelectedGuests(new Set())
    toast.success(`Sent reminders to ${selectedGuests.size} guest(s)`)
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest List</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} guest{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/app/import">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-cobalt to-cobalt/90 hover:from-cobalt/90 hover:to-cobalt/80 font-semibold hover:shadow-lg transition-all duration-300">
            <Upload className="h-5 w-5" />
            Import Guests
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="animate-fade-in-up card-gradient flex flex-col gap-4 p-5 md:flex-row md:items-end border-0 hover:shadow-lg transition-all duration-300" style={{ animationDelay: '50ms' }}>
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-primary/20 focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter</label>
          <Select
            value={filterStatus ?? ""}
            onValueChange={(v) => setFilterStatus(v === "" ? null : v)}
          >
            <option value="">All Statuses</option>
            {state.statuses.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort</label>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as typeof sortBy)}
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="contacted">Last Contacted</option>
            <option value="attempts">Contact Attempts</option>
          </Select>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedGuests.size > 0 && (
        <Card className="animate-slide-in-left flex items-center justify-between gap-4 bg-gradient-to-r from-primary/15 to-primary/5 p-5 border-l-4 border-primary rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-bold text-primary">{selectedGuests.size}</span>
            </div>
            <p className="text-sm font-semibold">guest{selectedGuests.size !== 1 ? 's' : ''} selected</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleBulkReminder}
              className="gap-2 bg-gradient-to-r from-amber to-amber/90 hover:from-amber/90 hover:to-amber/80 font-semibold text-white hover:shadow-lg transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              Send Reminder
            </Button>
            {bulkStatusOpen ? (
              <div className="flex gap-2 flex-wrap">
                {state.statuses.map((st) => (
                  <Button
                    key={st.id}
                    size="sm"
                    onClick={() => handleBulkStatusChange(st.id)}
                    className={`font-semibold transition-all bg-${st.color}/80 hover:bg-${st.color}/90 text-white hover:shadow-lg`}
                  >
                    {st.label}
                  </Button>
                ))}
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setBulkStatusOpen(true)}
                className="gap-2 bg-gradient-to-r from-teal to-teal/90 hover:from-teal/90 hover:to-teal/80 font-semibold text-white hover:shadow-lg transition-all"
              >
                Change Status
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedGuests(new Set())}
            >
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Guests List */}
      {filtered.length === 0 ? (
        <Card className="animate-fade-in-up flex flex-col items-center justify-center gap-4 py-16 text-center card-gradient border-0">
          <div className="text-4xl">🔍</div>
          <p className="text-lg font-medium text-muted-foreground">No guests found</p>
          {eventGuests.length === 0 && (
            <Link href="/app/import">
              <Button size="lg" className="mt-4 bg-gradient-to-r from-cobalt to-cobalt/90 hover:from-cobalt/90 hover:to-cobalt/80 font-semibold">Import your first guests</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((guest, idx) => {
            const isSelected = selectedGuests.has(guest.id)
            const status = statusById(state.statuses, guest.statusId)
            return (
              <Link key={guest.id} href={`/app/guests/${guest.id}`}>
                <Card
                  className={`animate-fade-in-up flex cursor-pointer items-center gap-4 p-4 transition-all duration-300 border-0 hover:shadow-md hover:scale-102 group ${
                    isSelected ? "bg-primary/15 ring-2 ring-primary/50" : "bg-card/50 hover:bg-card"
                  }`}
                  style={{ animationDelay: `${idx * 25}ms` }}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("input")) {
                      e.preventDefault()
                      toggleSelectGuest(guest.id)
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectGuest(guest.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 cursor-pointer rounded border-2 border-primary/50 transition-all"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-base group-hover:text-primary transition-colors">{fullName(guest)}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span>📱 {guest.phone}</span>
                      {guest.email && <span>📧 {guest.email}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-auto">
                    {status && <StatusBadge status={status} />}
                    <div className="text-xs text-muted-foreground font-medium">
                      {guest.contactAttempts > 0 && `${guest.contactAttempts} calls`}
                      {guest.lastContactedAt && (
                        <div>{relativeTime(guest.lastContactedAt)}</div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
