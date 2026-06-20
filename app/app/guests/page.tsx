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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Guest List</h1>
        <Link href="/app/import">
          <Button size="sm" variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="flex flex-col gap-4 p-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Filter by Status</label>
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
          <label className="text-xs font-medium text-muted-foreground">Sort by</label>
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
        <Card className="flex items-center justify-between gap-4 bg-primary/5 p-4">
          <p className="text-sm font-medium">{selectedGuests.size} selected</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkReminder}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Send Reminder
            </Button>
            {bulkStatusOpen ? (
              <div className="flex gap-2">
                {state.statuses.map((st) => (
                  <Button
                    key={st.id}
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange(st.id)}
                  >
                    {st.label}
                  </Button>
                ))}
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkStatusOpen(true)}
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
        <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No guests found</p>
          {eventGuests.length === 0 && (
            <Link href="/app/import">
              <Button size="sm">Import your first guests</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((guest) => {
            const isSelected = selectedGuests.has(guest.id)
            const status = statusById(state.statuses, guest.statusId)
            return (
              <Link key={guest.id} href={`/app/guests/${guest.id}`}>
                <Card
                  className={`flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-accent/50 ${
                    isSelected ? "bg-primary/10" : ""
                  }`}
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
                    className="h-4 w-4 cursor-pointer rounded"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{fullName(guest)}</div>
                    <div className="text-xs text-muted-foreground">
                      {guest.phone}
                      {guest.email && ` • ${guest.email}`}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {status && <StatusBadge status={status} />}
                    <div className="text-xs text-muted-foreground">
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
