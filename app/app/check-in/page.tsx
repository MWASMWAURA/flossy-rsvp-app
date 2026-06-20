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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Event Check-In</h1>
        <p className="text-sm text-muted-foreground mt-2">
          🎉 {arrivedCount} of {eventGuests.length} guests have arrived ({Math.round((arrivedCount / eventGuests.length) * 100)}%)
        </p>
      </div>

      {/* Progress Card */}
      <Card className="animate-fade-in-up card-gradient p-6 border-0 hover:shadow-lg transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Check-in Progress</h2>
            <span className="text-2xl font-bold text-teal">{Math.round((arrivedCount / eventGuests.length) * 100)}%</span>
          </div>
          <div className="h-5 w-full overflow-hidden rounded-full bg-muted/50 ring-1 ring-teal/20">
            <div
              className="h-full bg-gradient-to-r from-teal to-teal/70 transition-all duration-300"
              style={{ width: `${(arrivedCount / eventGuests.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-medium">{arrivedCount} checked in, {eventGuests.length - arrivedCount} remaining</p>
        </div>
      </Card>

      {/* Mode Toggle */}
      <div className="animate-fade-in-up flex gap-3">
        <Button
          onClick={() => {
            setMode("search")
            setShowScanner(false)
            setSelectedGuestId(null)
          }}
          className={`flex-1 h-12 font-semibold transition-all duration-300 ${
            mode === "search"
              ? "bg-gradient-to-r from-cobalt to-cobalt/90 text-white hover:shadow-lg"
              : "bg-muted/50 text-foreground hover:bg-muted border-0"
          }`}
        >
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
        <Button
          onClick={() => {
            setMode("scan")
            setShowScanner(true)
            setSelectedGuestId(null)
          }}
          className={`flex-1 h-12 font-semibold transition-all duration-300 ${
            mode === "scan"
              ? "bg-gradient-to-r from-teal to-teal/90 text-white hover:shadow-lg"
              : "bg-muted/50 text-foreground hover:bg-muted border-0"
          }`}
        >
          <ScanLine className="mr-2 h-5 w-5" />
          Scan QR
        </Button>
      </div>

      {/* Search Mode */}
      {mode === "search" && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Type guest name to check them in..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-primary/20 focus:border-primary/40 transition-colors"
              autoFocus
            />
          </div>

          {selectedGuestId && (
            <Card className="animate-slide-in-left flex items-center gap-4 border-l-4 border-teal bg-gradient-to-r from-teal/15 to-teal/5 p-5 card-gradient border-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/20">
                <CheckCircle className="h-6 w-6 text-teal" />
              </div>
              <p className="text-base font-semibold text-foreground">
                ✓ {fullName(eventGuests.find((g) => g.id === selectedGuestId) || {})} checked in!
              </p>
            </Card>
          )}

          {notFound && (
            <Card className="animate-fade-in-up flex flex-col items-center gap-3 p-8 text-center card-gradient border-0">
              <div className="text-4xl">🔍</div>
              <div>
                <p className="font-semibold text-foreground">No guest found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  "{searchQuery}" is not registered — please verify the name
                </p>
              </div>
            </Card>
          )}

          {searchResults.map((guest, idx) => (
            <Card 
              key={guest.id} 
              className="animate-fade-in-up flex items-center justify-between gap-4 p-5 card-gradient border-0 hover:shadow-md hover:scale-102 transition-all duration-300 group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base group-hover:text-primary transition-colors">{fullName(guest)}</p>
                <p className="text-xs text-muted-foreground mt-1">📱 {guest.phone}</p>
              </div>
              <Button
                onClick={() => handleCheckInGuest(guest.id)}
                className="gap-2 bg-gradient-to-r from-teal to-teal/90 hover:from-teal/90 hover:to-teal/80 font-semibold text-white hover:shadow-lg transition-all"
              >
                <CheckCircle className="h-4 w-4" />
                Check In
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
