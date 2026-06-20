"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      
      // Show prompt after a short delay to not interrupt user immediately
      setTimeout(() => {
        if (!dismissed) {
          setShowPrompt(true)
          toast.custom(
            (t) => (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
                <Download className="size-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Install Flossy offline</p>
                  <p className="text-sm text-muted-foreground">Keep your guest list editable without internet</p>
                </div>
                <button
                  onClick={() => handleInstall(event)}
                  className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Install
                </button>
                <button
                  onClick={() => handleDismiss(t)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ),
            {
              duration: 10000,
              position: "bottom-center",
            },
          )
        }
      }, 2000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [dismissed])

  const handleInstall = async (event: BeforeInstallPromptEvent) => {
    if (!event) return
    
    try {
      await event.prompt()
      const { outcome } = await event.userChoice
      
      if (outcome === "accepted") {
        toast.success("Flossy installed! Works offline now.")
        setDeferredPrompt(null)
        setShowPrompt(false)
        setDismissed(true)
      }
    } catch (error) {
      console.error("Install prompt failed:", error)
    }
  }

  const handleDismiss = (toastId: string | number) => {
    setDismissed(true)
    setShowPrompt(false)
    toast.dismiss(toastId)
  }

  return null
}
