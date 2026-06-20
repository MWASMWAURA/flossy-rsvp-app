"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Users, CheckCircle, XCircle, HelpCircle, LogIn, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFlossy } from "@/components/flossy-store"
import { computeMetrics } from "@/lib/flossy/utils"

export default function DashboardPage() {
  const { eventGuests, state, currentEvent } = useFlossy()

  const metrics = useMemo(
    () => computeMetrics(eventGuests, state.statuses),
    [eventGuests, state.statuses],
  )

  const contactedPercent = Math.round(
    metrics.invited > 0 ? (metrics.contacted / metrics.invited) * 100 : 0,
  )
  const confirmedPercent = Math.round(
    metrics.invited > 0 ? (metrics.confirmed / metrics.invited) * 100 : 0,
  )

  const stats = [
    {
      label: "Invited",
      value: metrics.invited,
      icon: Users,
      color: "cobalt",
    },
    {
      label: "Confirmed",
      value: metrics.confirmed,
      icon: CheckCircle,
      color: "teal",
    },
    {
      label: "Declined",
      value: metrics.declined,
      icon: XCircle,
      color: "coral",
    },
    {
      label: "No Response",
      value: metrics.noResponse,
      icon: HelpCircle,
      color: "violet",
    },
    {
      label: "Contacted",
      value: metrics.contacted,
      icon: TrendingUp,
      color: "amber",
    },
    {
      label: "Arrived",
      value: metrics.arrived,
      icon: LogIn,
      color: "teal",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      {currentEvent && (
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 border border-primary/20">
          <h1 className="text-3xl font-semibold">{currentEvent.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentEvent.date} at {currentEvent.time} • {currentEvent.location}
          </p>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-${stat.color}/10 p-3`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Contacted Progress */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Contact Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Guests Contacted</p>
              <p className="font-semibold">{contactedPercent}%</p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-amber transition-all"
                style={{ width: `${contactedPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.contacted} of {metrics.invited} guests contacted
            </p>
          </div>
        </Card>

        {/* Confirmed Progress */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Confirmation Rate</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Guests Confirmed</p>
              <p className="font-semibold">{confirmedPercent}%</p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-teal transition-all"
                style={{ width: `${confirmedPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.confirmed} of {metrics.invited} guests confirmed
            </p>
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Guest Status Breakdown</h2>
        <div className="space-y-3">
          {state.statuses.map((status) => {
            const count = eventGuests.filter((g) => g.statusId === status.id).length
            const percent = Math.round((count / metrics.invited) * 100) || 0
            return (
              <div key={status.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{status.label}</p>
                  <p className="text-sm font-semibold">{count}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full bg-${status.color} transition-all`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/app/guests">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Users className="mr-2 h-4 w-4" />
            Manage Guests
          </Button>
        </Link>
        <Link href="/app/check-in">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Check-in
          </Button>
        </Link>
        <Link href="/app/templates">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <TrendingUp className="mr-2 h-4 w-4" />
            Templates
          </Button>
        </Link>
        <Link href="/app/settings">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Users className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
