import { cn } from "@/lib/utils"
import { COLOR_CLASSES } from "@/lib/flossy/utils"
import type { BrandColor } from "@/lib/flossy/types"

export function MetricCard({
  label,
  value,
  hint,
  color = "cobalt",
  icon: Icon,
}: {
  label: string
  value: number | string
  hint?: string
  color?: BrandColor
  icon?: React.ComponentType<{ className?: string }>
}) {
  const c = COLOR_CLASSES[color]
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {Icon && (
          <span className={cn("flex size-7 items-center justify-center rounded-lg", c.soft)}>
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <span className="font-heading text-3xl font-semibold tabular-nums text-foreground">
        {value}
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}
