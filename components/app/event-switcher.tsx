"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, MapPin, Plus, CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useFlossy } from "@/components/flossy-store"
import { COLOR_CLASSES, formatEventDate } from "@/lib/flossy/utils"
import type { BrandColor } from "@/lib/flossy/types"

const COLORS: BrandColor[] = ["cobalt", "teal", "amber", "violet", "coral"]

export function EventSwitcher() {
  const { state, currentEvent, setCurrentEvent, addEvent } = useFlossy()
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    color: "cobalt" as BrandColor,
  })

  function create() {
    if (!form.name.trim()) return
    addEvent({ ...form, defaultCountryCode: "+1" })
    setForm({ name: "", date: "", time: "", location: "", color: "cobalt" })
    setCreating(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="group flex max-w-full items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-2.5 pl-3 text-left transition-colors hover:bg-accent"
          />
        }
      >
        <span
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            currentEvent ? COLOR_CLASSES[currentEvent.color].dot : "bg-muted",
          )}
          aria-hidden
        />
        <span className="truncate font-heading text-sm font-semibold text-foreground">
          {currentEvent?.name ?? "Select event"}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{creating ? "Create event" : "Your events"}</DialogTitle>
          <DialogDescription>
            {creating
              ? "Set up a new celebration to manage its guest list."
              : "Switch between the events you're coordinating."}
          </DialogDescription>
        </DialogHeader>

        {!creating ? (
          <div className="flex flex-col gap-2">
            {state.events.map((e) => {
              const active = e.id === currentEvent?.id
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    setCurrentEvent(e.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    active ? "border-primary bg-accent" : "border-border hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      COLOR_CLASSES[e.color].solid,
                    )}
                  >
                    <CalendarDays className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-sm font-semibold">
                      {e.name}
                    </span>
                    <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {e.location || "No location"} ·{" "}
                      {formatEventDate(e.date)}
                    </span>
                  </span>
                  {active && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              )
            })}
            <Button
              variant="outline"
              className="mt-1 justify-start gap-2 rounded-xl border-dashed"
              onClick={() => setCreating(true)}
            >
              <Plus className="size-4" /> Create new event
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-name">Event name</Label>
              <Input
                id="ev-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Harper & Quinn Wedding"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="ev-date">Date</Label>
                <Input
                  id="ev-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="ev-time">Time</Label>
                <Input
                  id="ev-time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="5:00 PM"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-loc">Location</Label>
              <Input
                id="ev-loc"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Venue name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Accent color</Label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={cn(
                      "size-8 rounded-full ring-2 ring-offset-2 ring-offset-popover transition",
                      COLOR_CLASSES[c].dot,
                      form.color === c ? "ring-foreground" : "ring-transparent",
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="mt-1 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCreating(false)}>
                Back
              </Button>
              <Button className="flex-1" onClick={create} disabled={!form.name.trim()}>
                Create
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
