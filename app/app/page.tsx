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
    <div className="space-y-8 pb-8">
      {/* Header */}
      {currentEvent && (
        <div className="animate-fade-in-up rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 border border-primary/30 backdrop-blur-sm">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{currentEvent.name}</h1>
            <p className="text-base text-muted-foreground flex items-center gap-2">
              <span>📅 {currentEvent.date}</span>
              <span>•</span>
              <span>🕐 {currentEvent.time}</span>
              <span>•</span>
              <span>📍 {currentEvent.location}</span>
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => (
          <Card 
            key={stat.label} 
            className="animate-fade-in-up p-6 border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="mt-3 text-4xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-xl bg-${stat.color}/15 p-4 ring-1 ring-${stat.color}/30`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Contacted Progress */}
        <Card className="animate-fade-in-up p-6 border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `150ms` }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Contact Progress</h2>
              <span className="text-2xl font-bold text-amber">{contactedPercent}%</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full overflow-hidden rounded-full bg-muted/50 ring-1 ring-amber/20">
                <div
                  className="h-full bg-gradient-to-r from-amber to-amber/70 transition-all duration-500"
                  style={{ width: `${contactedPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {metrics.contacted} of {metrics.invited} guests contacted
              </p>
            </div>
          </div>
        </Card>

        {/* Confirmed Progress */}
        <Card className="animate-fade-in-up p-6 border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `200ms` }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Confirmation Rate</h2>
              <span className="text-2xl font-bold text-teal">{confirmedPercent}%</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full overflow-hidden rounded-full bg-muted/50 ring-1 ring-teal/20">
                <div
                  className="h-full bg-gradient-to-r from-teal to-teal/70 transition-all duration-500"
                  style={{ width: `${confirmedPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {metrics.confirmed} of {metrics.invited} guests confirmed
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="animate-fade-in-up p-6 border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `250ms` }}>
        <h2 className="mb-6 text-lg font-semibold">Guest Status Breakdown</h2>
        <div className="space-y-4">
          {state.statuses.map((status) => {
            const count = eventGuests.filter((g) => g.statusId === status.id).length
            const percent = Math.round((count / metrics.invited) * 100) || 0
            return (
              <div key={status.id} className="space-y-2 hover:opacity-80 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${status.color}`} />
                    <p className="text-sm font-medium">{status.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{count} ({percent}%)</p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted/50 ring-1 ring-border/20">
                  <div
                    className={`h-full bg-gradient-to-r from-${status.color} to-${status.color}/60 transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-4">
        <Link href="/app/guests">
          <Button className="w-full justify-start gap-3 h-12 font-semibold group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-cobalt to-cobalt/90 hover:from-cobalt/90 hover:to-cobalt/80">
            <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Manage Guests</span>
          </Button>
        </Link>
        <Link href="/app/check-in">
          <Button className="w-full justify-start gap-3 h-12 font-semibold group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-teal to-teal/90 hover:from-teal/90 hover:to-teal/80">
            <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Check-in</span>
          </Button>
        </Link>
        <Link href="/app/templates">
          <Button className="w-full justify-start gap-3 h-12 font-semibold group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-amber to-amber/90 hover:from-amber/90 hover:to-amber/80">
            <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Templates</span>
          </Button>
        </Link>
        <Link href="/app/settings">
          <Button className="w-full justify-start gap-3 h-12 font-semibold group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-violet to-violet/90 hover:from-violet/90 hover:to-violet/80">
            <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
