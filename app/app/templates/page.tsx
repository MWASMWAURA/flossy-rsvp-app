"use client"

import { useState, useMemo } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFlossy } from "@/components/flossy-store"
import { renderTemplate } from "@/lib/flossy/utils"
import { toast } from "sonner"

export default function TemplatesPage() {
  const { state, currentEvent, addTemplate, updateTemplate, deleteTemplate, eventGuests } =
    useFlossy()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newBody, setNewBody] = useState("")
  const [showForm, setShowForm] = useState(false)

  const templates = state.templates
  const sampleGuest = eventGuests[0] || {
    firstName: "Sarah",
    lastName: "Smith",
    phone: "+1 (555) 123-4567",
    email: "sarah@example.com",
    id: "sample",
    eventId: "",
    statusId: "",
    notes: "",
    customFields: {},
    qrCodeId: "",
    contactAttempts: 0,
    lastContactedAt: null,
    arrivedAt: null,
    history: [],
  }

  const previewText = useMemo(() => {
    return renderTemplate(newBody, sampleGuest, currentEvent)
  }, [newBody, sampleGuest, currentEvent])

  const handleSave = () => {
    if (!newName.trim() || !newBody.trim()) {
      toast.error("Name and body required")
      return
    }

    if (editingId) {
      updateTemplate(editingId, { name: newName, body: newBody })
      toast.success("Template updated")
    } else {
      addTemplate({ name: newName, body: newBody })
      toast.success("Template created")
    }

    setNewName("")
    setNewBody("")
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (id: string, name: string, body: string) => {
    setEditingId(id)
    setNewName(name)
    setNewBody(body)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingId(null)
    setNewName("")
    setNewBody("")
    setShowForm(false)
  }

  const placeholders = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "full_name", label: "Full Name" },
    { key: "event_name", label: "Event Name" },
    { key: "event_date", label: "Event Date" },
    { key: "event_time", label: "Event Time" },
    { key: "event_location", label: "Event Location" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Message Templates</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Template Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Initial Invite"
              className="mt-1"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Message Body</label>
              <p className="text-xs text-muted-foreground">{newBody.length} characters</p>
            </div>
            <Textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Write your message. Use {{placeholder}} to insert variables."
              className="min-h-32"
            />
          </div>

          {/* Placeholder Buttons */}
          <div className="rounded-lg bg-muted p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Quick Insert:</p>
            <div className="flex flex-wrap gap-2">
              {placeholders.map((ph) => (
                <button
                  key={ph.key}
                  onClick={() => setNewBody((prev) => `${prev}{{${ph.key}}}`)}
                  className="rounded bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {ph.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {newBody && (
            <div className="rounded-lg border border-border bg-accent/50 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Preview:</p>
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">{previewText}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {editingId ? "Update Template" : "Create Template"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Templates List */}
      {templates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No templates yet</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            Create Your First Template
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {templates.map((tpl) => {
            const preview = renderTemplate(tpl.body, sampleGuest, currentEvent).substring(0, 100)
            return (
              <Card key={tpl.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{tpl.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{preview}...</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tpl.body.length} characters
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(tpl.id, tpl.name, tpl.body)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        deleteTemplate(tpl.id)
                        toast.success("Template deleted")
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
