import { cn } from "@/lib/utils"
import { COLOR_CLASSES } from "@/lib/flossy/utils"
import type { GuestStatus } from "@/lib/flossy/types"

export function StatusBadge({
  status,
  className,
}: {
  status: GuestStatus | undefined
  className?: string
}) {
  if (!status) return null
  const c = COLOR_CLASSES[status.color]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        c.soft,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {status.label}
    </span>
  )
}
