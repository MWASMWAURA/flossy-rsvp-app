"use client"

import { useState, useMemo } from "react"
import { Search, ScanLine, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useFlossy } from "@/components/flossy-store"
import { fullName } from "@/lib/flossy/utils"
import { toast } from "sonner"

type Mode = "search" | "scan"

export default function CheckInPage() {
  const { eventGuests, markArrived, guestByQr } = useFlossy()
  const [mode, setMode] = useState<Mode>("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [lastScannedQr, setLastScannedQr] = useState<string>("")

  const arrivedCount = useMemo(() => eventGuests.filter((g) => g.arrivedAt).length, [eventGuests])

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return eventGuests
      .filter((g) => fullName(g).toLowerCase().includes(q))
      .filter((g) => !g.arrivedAt)
      .slice(0, 10)
  }, [searchQuery, eventGuests])

  const handleQrScan = (result: any) => {
    const qrText = result.getText()
    if (!qrText || qrText === lastScannedQr) return

    setLastScannedQr(qrText)
    const guest = guestByQr(qrText)

    if (guest) {
      if (guest.arrivedAt) {
        toast.info(`${fullName(guest)} already checked in`)
      } else {
        markArrived(guest.id)
        setSelectedGuestId(guest.id)
        toast.success(`${fullName(guest)} checked in`)
        // Reset after 2 seconds
        setTimeout(() => {
          setSelectedGuestId(null)
          setLastScannedQr("")
        }, 2000)
      }
    } else {
      toast.error("Guest not found")
      setLastScannedQr("")
    }
  }

  const handleCheckInGuest = (id: string) => {
    const guest = eventGuests.find((g) => g.id === id)
    if (!guest) return
    if (guest.arrivedAt) {
      toast.info(`${fullName(guest)} already checked in`)
      return
    }
    markArrived(id)
    setSelectedGuestId(id)
    toast.success(`${fullName(guest)} checked in`)
    setSearchQuery("")
    setTimeout(() => setSelectedGuestId(null), 2000)
  }

  const notFound = searchQuery && searchResults.length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Check-In</h1>
          <p className="text-sm text-muted-foreground">
            {arrivedCount} / {eventGuests.length} arrived
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "search" ? "default" : "outline"}
          onClick={() => {
            setMode("search")
            setShowScanner(false)
            setSelectedGuestId(null)
          }}
          className="flex-1"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button
          variant={mode === "scan" ? "default" : "outline"}
          onClick={() => {
            setMode("scan")
            setShowScanner(true)
            setSelectedGuestId(null)
          }}
          className="flex-1"
        >
          <ScanLine className="mr-2 h-4 w-4" />
          Scan
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Progress</p>
          <p className="text-sm font-semibold">{Math.round((arrivedCount / eventGuests.length) * 100)}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.round((arrivedCount / eventGuests.length) * 100)}%` }}
          />
        </div>
      </Card>

      {/* Search Mode */}
      {mode === "search" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Type guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {selectedGuestId && (
            <Card className="flex items-center gap-3 border-teal-200 bg-teal-50 p-4">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <p className="font-medium text-teal-900">
                {fullName(eventGuests.find((g) => g.id === selectedGuestId) || {})} checked in!
              </p>
            </Card>
          )}

          {notFound && (
            <Card className="flex flex-col items-center gap-2 p-6 text-center">
              <p className="text-muted-foreground">
                <strong>{searchQuery}</strong> not found
              </p>
              <p className="text-xs text-muted-foreground">
                Not registered — please go to the front desk
              </p>
            </Card>
          )}

          {searchResults.map((guest) => (
            <Card key={guest.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{fullName(guest)}</p>
                <p className="text-xs text-muted-foreground">{guest.phone}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleCheckInGuest(guest.id)}
              >
                Mark Arrived
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Scan Mode */}
      {mode === "scan" && (
        <div className="space-y-4">
          {showScanner && (
            <div className="overflow-hidden rounded-lg border border-border">
              <Scanner
                onDecode={handleQrScan}
                onError={(error) => console.error(error)}
                containerStyle={{ width: "100%", height: "400px" }}
              />
            </div>
          )}

          {selectedGuestId && (
            <Card className="flex flex-col items-center gap-4 p-6 text-center">
              <CheckCircle className="h-8 w-8 text-teal-600" />
              <div>
                <p className="font-semibold">
                  {fullName(eventGuests.find((g) => g.id === selectedGuestId) || {})}
                </p>
                <p className="text-sm text-muted-foreground">Checked in successfully</p>
              </div>
            </Card>
          )}

          {lastScannedQr && !selectedGuestId && (
            <Card className="flex flex-col items-center gap-2 p-6 text-center">
              <p className="text-sm text-muted-foreground">Not registered</p>
              <p className="text-xs">Please go to the front desk</p>
            </Card>
          )}

          <Card className="p-4 text-center text-sm text-muted-foreground">
            <p>Point camera at guest&apos;s QR code</p>
          </Card>
        </div>
      )}
    </div>
  )
}
