"use client"

import { useState, useRef } from "react"
import { Plus, Trash2, GripVertical, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useFlossy } from "@/components/flossy-store"
import { COLOR_CLASSES } from "@/lib/flossy/utils"
import { toast } from "sonner"
import type { BrandColor, GuestStatus } from "@/lib/flossy/types"

const COLORS: BrandColor[] = ["cobalt", "amber", "teal", "violet", "coral"]
const STATUS_KINDS = ["pending", "confirmed", "declined", "noresponse"] as const

export default function SettingsPage() {
  const { currentEvent, updateEvent, state, setStatuses } = useFlossy()
  const [editingEvent, setEditingEvent] = useState(false)
  const [eventName, setEventName] = useState(currentEvent?.name || "")
  const [eventDate, setEventDate] = useState(currentEvent?.date || "")
  const [eventTime, setEventTime] = useState(currentEvent?.time || "")
  const [eventLocation, setEventLocation] = useState(currentEvent?.location || "")
  const [eventCountryCode, setEventCountryCode] = useState(currentEvent?.defaultCountryCode || "+1")
  const [eventColor, setEventColor] = useState<BrandColor>(currentEvent?.color || "cobalt")

  const [editingStatusId, setEditingStatusId] = useState<string | null>(null)
  const [newStatusLabel, setNewStatusLabel] = useState("")
  const [newStatusColor, setNewStatusColor] = useState<BrandColor>("cobalt")
  const [newStatusKind, setNewStatusKind] = useState<"pending" | "confirmed" | "declined" | "noresponse">("pending")

  const handleSaveEvent = () => {
    if (!currentEvent) return
    if (!eventName.trim()) {
      toast.error("Event name required")
      return
    }
    updateEvent(currentEvent.id, {
      name: eventName,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      defaultCountryCode: eventCountryCode,
      color: eventColor,
    })
    setEditingEvent(false)
    toast.success("Event updated")
  }

  const handleSaveStatus = (statusId: string | null) => {
    if (!newStatusLabel.trim()) {
      toast.error("Status label required")
      return
    }

    const updated = state.statuses.map((st) => {
      if (st.id === statusId) {
        return {
          ...st,
          label: newStatusLabel,
          color: newStatusColor,
          kind: newStatusKind,
        }
      }
      return st
    })

    setStatuses(updated)
    setEditingStatusId(null)
    setNewStatusLabel("")
    toast.success(statusId ? "Status updated" : "Status created")
  }

  const handleAddStatus = () => {
    if (!newStatusLabel.trim()) {
      toast.error("Status label required")
      return
    }

    const newStatus: GuestStatus = {
      id: `st_${Date.now()}`,
      label: newStatusLabel,
      color: newStatusColor,
      kind: newStatusKind,
      order: state.statuses.length,
    }

    setStatuses([...state.statuses, newStatus])
    setNewStatusLabel("")
    toast.success("Status created")
  }

  const handleDeleteStatus = (id: string) => {
    if (state.statuses.length <= 1) {
      toast.error("Must have at least one status")
      return
    }
    setStatuses(state.statuses.filter((st) => st.id !== id))
    toast.success("Status deleted")
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Event Details */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Event Details</h2>
          {!editingEvent && (
            <Button size="sm" variant="ghost" onClick={() => setEditingEvent(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {editingEvent ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Event Name</label>
              <Input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Time</label>
                <Input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Input
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Default Country Code
                </label>
                <Input
                  value={eventCountryCode}
                  onChange={(e) => setEventCountryCode(e.target.value)}
                  placeholder="+1"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Color</label>
                <Select
                  value={eventColor}
                  onValueChange={(v) => setEventColor(v as BrandColor)}
                >
                  {COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEvent} className="flex-1">
                Save Event
              </Button>
              <Button variant="outline" onClick={() => setEditingEvent(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Event Name</p>
              <p className="font-medium">{eventName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{eventDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">{eventTime}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{eventLocation}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Guest Statuses */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Guest Statuses</h2>
        <div className="space-y-3">
          {state.statuses.map((status) => {
            const isEditing = editingStatusId === status.id
            const colorClass = COLOR_CLASSES[status.color]

            return (
              <div key={status.id} className="rounded-lg border border-border p-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={newStatusLabel}
                      onChange={(e) => setNewStatusLabel(e.target.value)}
                      placeholder="Status label"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        value={newStatusColor}
                        onValueChange={(v) => setNewStatusColor(v as BrandColor)}
                      >
                        {COLORS.map((color) => (
                          <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={newStatusKind}
                        onValueChange={(v) => setNewStatusKind(v as any)}
                      >
                        {STATUS_KINDS.map((kind) => (
                          <option key={kind} value={kind}>
                            {kind.charAt(0).toUpperCase() + kind.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveStatus(status.id)}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingStatusId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div className={`h-3 w-3 rounded-full ${colorClass.dot}`} />
                      <div>
                        <p className="font-medium text-sm">{status.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Kind: {status.kind}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingStatusId(status.id)
                          setNewStatusLabel(status.label)
                          setNewStatusColor(status.color)
                          setNewStatusKind(status.kind)
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStatus(status.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add New Status */}
        {editingStatusId === null && (
          <div className="mt-4 rounded-lg border border-dashed border-border p-3 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Add New Status</p>
            <Input
              placeholder="Status label"
              value={newStatusLabel}
              onChange={(e) => setNewStatusLabel(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={newStatusColor}
                onValueChange={(v) => setNewStatusColor(v as BrandColor)}
              >
                {COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </Select>
              <Select
                value={newStatusKind}
                onValueChange={(v) => setNewStatusKind(v as any)}
              >
                {STATUS_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind.charAt(0).toUpperCase() + kind.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            <Button onClick={handleAddStatus} size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Status
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
