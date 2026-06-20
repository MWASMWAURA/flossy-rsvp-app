"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, Phone, MessageSquare, QrCode, Clock, Copy } from "lucide-react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFlossy } from "@/components/flossy-store"
import { fullName, formatPhone, statusById, relativeTime } from "@/lib/flossy/utils"
import { StatusBadge } from "@/components/app/status-badge"
import { toast } from "sonner"

export default function GuestDetailPage() {
  const params = useParams()
  const guestId = params.id as string
  const { eventGuests, state, currentEvent, updateGuest, setGuestStatus, logContact } =
    useFlossy()
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState("")
  const [qrImage, setQrImage] = useState<string>("")

  const guest = eventGuests.find((g) => g.id === guestId)

  if (!guest) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <p className="text-muted-foreground">Guest not found</p>
        <Link href="/app/guests">
          <Button variant="outline" size="sm">
            Back to Guest List
          </Button>
        </Link>
      </div>
    )
  }

  const status = statusById(state.statuses, guest.statusId)

  const handleNotesEdit = () => {
    if (!isEditingNotes) {
      setNotesText(guest.notes)
    }
    setIsEditingNotes(!isEditingNotes)
  }

  const handleNotesSave = () => {
    updateGuest(guest.id, { notes: notesText })
    setIsEditingNotes(false)
    toast.success("Notes saved")
  }

  const handleCall = () => {
    logContact(guest.id, "call")
    toast.success("Call logged")
    // In a real app, this would open tel: link
    window.location.href = `tel:${guest.phone}`
  }

  const handleText = () => {
    logContact(guest.id, "text", "Message sent")
    toast.success("Text logged")
    // In a real app, this would open sms: link
    window.location.href = `sms:${guest.phone}`
  }

  const handleGenerateQR = async () => {
    try {
      const url = await QRCode.toDataURL(guest.qrCodeId)
      setQrImage(url)
      toast.success("QR code generated")
    } catch {
      toast.error("Failed to generate QR code")
    }
  }

  const handleCopyQR = () => {
    if (qrImage) {
      navigator.clipboard.writeText(qrImage)
      toast.success("QR code copied to clipboard")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/app/guests">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{fullName(guest)}</h1>
            <p className="text-sm text-muted-foreground">{guest.phone}</p>
          </div>
        </div>
        {status && <StatusBadge status={status} className="text-sm" />}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Button
          size="lg"
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={handleCall}
        >
          <Phone className="h-6 w-6" />
          <span className="text-xs">Call</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={handleText}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">Text</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={handleGenerateQR}
        >
          <QrCode className="h-6 w-6" />
          <span className="text-xs">QR Code</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-24 flex-col gap-2 disabled:opacity-50"
          disabled={!qrImage}
          onClick={handleCopyQR}
        >
          <Copy className="h-6 w-6" />
          <span className="text-xs">Copy QR</span>
        </Button>
      </div>

      {/* QR Code Display */}
      {qrImage && (
        <Card className="flex flex-col items-center gap-4 p-6">
          <img src={qrImage} alt="QR Code" className="h-40 w-40" />
          <p className="text-center text-xs text-muted-foreground">
            Guest ID: {guest.qrCodeId}
          </p>
        </Card>
      )}

      {/* Guest Info */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Guest Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name</label>
              <Input
                value={guest.firstName}
                onChange={(e) => updateGuest(guest.id, { firstName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name</label>
              <Input
                value={guest.lastName}
                onChange={(e) => updateGuest(guest.id, { lastName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone</label>
              <Input
                value={guest.phone}
                onChange={(e) => updateGuest(guest.id, { phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                value={guest.email}
                onChange={(e) => updateGuest(guest.id, { email: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Status */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Status</h2>
        <div className="flex flex-wrap gap-2">
          {state.statuses.map((st) => (
            <Button
              key={st.id}
              variant={st.id === guest.statusId ? "default" : "outline"}
              size="sm"
              onClick={() => setGuestStatus(guest.id, st.id)}
            >
              {st.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Notes</h2>
          {!isEditingNotes && <Button size="sm" variant="ghost" onClick={handleNotesEdit}>
            Edit
          </Button>}
        </div>
        {isEditingNotes ? (
          <div className="space-y-2">
            <Textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add notes about this guest..."
              className="min-h-24"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleNotesSave}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingNotes(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{guest.notes || "No notes yet"}</p>
        )}
      </Card>

      {/* Activity History */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Clock className="h-4 w-4" />
          Activity
        </h2>
        <div className="space-y-3">
          {guest.history.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 border-l border-border pl-3">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/50 translate-y-2" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{entry.label}</p>
                <p className="text-xs text-muted-foreground">{relativeTime(entry.at)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
