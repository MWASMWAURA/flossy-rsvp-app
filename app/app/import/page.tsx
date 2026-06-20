"use client"

import { useState, useRef } from "react"
import { ChevronLeft, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { toast } from "sonner"
import { useFlossy } from "@/components/flossy-store"
import { cleanPhone, fullName } from "@/lib/flossy/utils"
import type { Guest } from "@/lib/flossy/types"
import * as XLSX from "xlsx"

type ColumnMapping = Record<string, string | null>
type ImportRow = Record<string, string>

const FIELD_OPTIONS = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "ignore", label: "Ignore" },
]

export default function ImportPage() {
  const { currentEvent, addGuests, eventGuests } = useFlossy()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "result">("upload")
  const [rawData, setRawData] = useState<ImportRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [previewRows, setPreviewRows] = useState<ImportRow[]>([])
  const [duplicates, setDuplicates] = useState<string[]>([])
  const [duplicateAction, setDuplicateAction] = useState<"skip" | "merge" | "import">("skip")
  const [importCount, setImportCount] = useState(0)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: "array" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        if (!sheet) {
          toast.error("No sheet found in file")
          return
        }

        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (string | number)[][]
        if (json.length < 2) {
          toast.error("File must have header row and at least one data row")
          return
        }

        const headerRow = json[0] as string[]
        const dataRows = json.slice(1)

        // Convert to objects
        const rows: ImportRow[] = dataRows.map((row) => {
          const obj: ImportRow = {}
          headerRow.forEach((header, i) => {
            obj[header as string] = String(row[i] ?? "").trim()
          })
          return obj
        })

        setHeaders(headerRow as string[])
        setRawData(rows)

        // Initialize mapping (smart detection)
        const mapping: ColumnMapping = {}
        headerRow.forEach((h) => {
          const lower = h.toLowerCase()
          if (lower.includes("first")) mapping[h] = "firstName"
          else if (lower.includes("last")) mapping[h] = "lastName"
          else if (lower.includes("phone")) mapping[h] = "phone"
          else if (lower.includes("email")) mapping[h] = "email"
          else mapping[h] = null
        })
        setColumnMapping(mapping)
        setStep("mapping")
        toast.success(`Loaded ${rows.length} rows`)
      } catch (err) {
        toast.error("Failed to parse file")
        console.error(err)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleMappingChange = (header: string, value: string | null) => {
    setColumnMapping((prev) => ({ ...prev, [header]: value }))
  }

  const handleMappingConfirm = () => {
    const firstFiveRows = rawData.slice(0, 5)
    setPreviewRows(firstFiveRows)

    // Check for duplicates
    const existingPhones = new Set(
      eventGuests
        .map((g) => cleanPhone(g.phone, currentEvent?.defaultCountryCode))
        .filter(Boolean),
    )

    const dups: string[] = []
    firstFiveRows.forEach((row) => {
      const phone = row[Object.keys(columnMapping).find((h) => columnMapping[h] === "phone") || ""]
      if (phone) {
        const cleaned = cleanPhone(phone, currentEvent?.defaultCountryCode)
        if (existingPhones.has(cleaned)) {
          dups.push(cleaned)
        }
      }
    })

    setDuplicates(dups)
    setStep("preview")
  }

  const handleConfirmImport = () => {
    if (!currentEvent) return

    const existingPhones = new Set(
      eventGuests
        .map((g) => cleanPhone(g.phone, currentEvent.defaultCountryCode))
        .filter(Boolean),
    )

    const guestsToAdd: Omit<
      Guest,
      "id" | "qrCodeId" | "contactAttempts" | "lastContactedAt" | "arrivedAt" | "history" | "statusId"
    >[] = []

    rawData.forEach((row) => {
      const phoneField = Object.keys(columnMapping).find((h) => columnMapping[h] === "phone")
      const phone = phoneField ? row[phoneField] : ""
      const cleanedPhone = cleanPhone(phone, currentEvent.defaultCountryCode)

      // Skip if duplicate and action is "skip"
      if (duplicateAction === "skip" && existingPhones.has(cleanedPhone)) {
        return
      }

      // Build guest object
      const guest: Omit<
        Guest,
        "id" | "qrCodeId" | "contactAttempts" | "lastContactedAt" | "arrivedAt" | "history" | "statusId"
      > = {
        eventId: currentEvent.id,
        firstName: "",
        lastName: "",
        phone: cleanedPhone,
        email: "",
        notes: "",
        customFields: {},
      }

      Object.entries(columnMapping).forEach(([header, field]) => {
        if (field && field !== "ignore") {
          guest[field as keyof typeof guest] = row[header] || ""
        }
      })

      guestsToAdd.push(guest)
    })

    if (guestsToAdd.length === 0) {
      toast.error("No guests to import")
      return
    }

    addGuests(guestsToAdd)
    setImportCount(guestsToAdd.length)
    setStep("result")
    toast.success(`Imported ${guestsToAdd.length} guests`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/app/guests">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Import Guests</h1>
      </div>

      {step === "upload" && (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="rounded-full bg-muted p-6">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Upload CSV or Excel file</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a spreadsheet with guest information
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="w-full max-w-xs"
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      )}

      {step === "mapping" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="mb-4 font-semibold">Map your columns</h2>
            <div className="space-y-3">
              {headers.map((header) => (
                <div key={header} className="flex items-center gap-3">
                  <span className="min-w-[150px] text-sm text-muted-foreground">{header}</span>
                  <Select
                    value={columnMapping[header] ?? ""}
                    onValueChange={(value) =>
                      handleMappingChange(header, value === "" ? null : value)
                    }
                  >
                    <option value="">- Select field -</option>
                    {FIELD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStep("upload")
                setHeaders([])
                setRawData([])
              }}
            >
              Back
            </Button>
            <Button onClick={handleMappingConfirm} className="flex-1">
              Preview Import
            </Button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          {duplicates.length > 0 && (
            <Card className="border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                {duplicates.length} duplicate phone number(s) found
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Choose how to handle existing phone numbers:
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant={duplicateAction === "skip" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuplicateAction("skip")}
                >
                  Skip Duplicates
                </Button>
                <Button
                  variant={duplicateAction === "merge" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuplicateAction("merge")}
                >
                  Merge
                </Button>
                <Button
                  variant={duplicateAction === "import" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuplicateAction("import")}
                >
                  Import Anyway
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h2 className="mb-3 font-semibold">Preview (first 5 rows)</h2>
            <div className="space-y-2 overflow-x-auto">
              {previewRows.map((row, i) => {
                const firstName =
                  row[
                    Object.keys(columnMapping).find((h) => columnMapping[h] === "firstName") || ""
                  ] || ""
                const lastName =
                  row[Object.keys(columnMapping).find((h) => columnMapping[h] === "lastName") || ""] ||
                  ""
                const phone =
                  row[Object.keys(columnMapping).find((h) => columnMapping[h] === "phone") || ""] || ""
                const email =
                  row[Object.keys(columnMapping).find((h) => columnMapping[h] === "email") || ""] || ""

                return (
                  <div
                    key={i}
                    className="rounded border border-border p-3 text-sm"
                  >
                    <div className="font-medium">{firstName} {lastName}</div>
                    <div className="text-xs text-muted-foreground">
                      {phone} {email && `• ${email}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep("mapping")}
            >
              Back
            </Button>
            <Button onClick={handleConfirmImport} className="flex-1">
              Import {rawData.length} Guests
            </Button>
          </div>
        </div>
      )}

      {step === "result" && (
        <Card className="p-8 text-center">
          <div className="mb-4 text-4xl">✓</div>
          <h2 className="text-lg font-semibold">Import Complete</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {importCount} guest{importCount !== 1 ? "s" : ""} added to {currentEvent?.name}
          </p>
          <Link href="/app/guests">
            <Button className="mt-6 w-full">View Guest List</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
