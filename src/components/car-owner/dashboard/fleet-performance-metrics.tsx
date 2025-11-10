"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity, BarChart3, CalendarCheck, ClipboardList, Gauge, Timer } from "lucide-react"
import { useGetFleetMetricsQuery } from "@/lib/services/car-owner-api"
import {
  formatDurationDays,
  formatInteger,
  formatPercent,
  isPositiveChange,
  type MetricCard,
} from "./metric-helpers"

interface FleetPerformanceMetricsProps {
  accountId: string
}

const renderCard = (card: MetricCard) => {
  const Icon = card.icon
  return (
    <Card
      key={card.key}
      className={`border-0 shadow-sm bg-gradient-to-br ${card.bgGradient} hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{card.title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            {card.subtitle && (
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">{card.subtitle}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${card.iconBg}`}>
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
          </div>
        </div>
        {card.change && (
          <p
            className={`text-xs sm:text-sm font-medium ${card.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {card.change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function FleetPerformanceMetrics({ accountId: _accountId }: FleetPerformanceMetricsProps) {
  const { data: fleetResp, isLoading } = useGetFleetMetricsQuery()
  const fleet = fleetResp?.data

  const totalFleet =
    typeof fleet?.fleetSize === "number"
      ? fleet.fleetSize
      : typeof fleet?.activeFleet === "number" || typeof fleet?.inactiveFleet === "number"
        ? (fleet?.activeFleet ?? 0) + (fleet?.inactiveFleet ?? 0)
        : undefined

  const fleetSubtitle = (() => {
    if (isLoading) {
      return ""
    }
    if (typeof fleet?.activeFleet === "number" && typeof fleet?.inactiveFleet === "number") {
      return `${formatInteger(fleet.activeFleet)} active • ${formatInteger(fleet.inactiveFleet)} inactive`
    }
    return undefined
  })()

  const cancellationChange = fleet?.cancellationRateChange ?? ""
  const avgDurationChange = fleet?.averageBookingDurationChange ?? ""

  const metrics: MetricCard[] = [
    {
      key: "utilization",
      title: "Vehicle Utilization Rate",
      value: isLoading ? "…" : formatPercent(fleet?.fleetUtilization ?? undefined),
      change: isLoading ? "" : fleet?.utilizationChange ?? "",
      isPositive: isPositiveChange(fleet?.utilizationChange),
      subtitle: "Time cars are rented vs idle",
      icon: Gauge,
      bgGradient: "from-blue-50 to-sky-100 dark:from-blue-950/40 dark:to-sky-950/40",
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      key: "total-bookings",
      title: "Total Bookings",
      value: isLoading ? "…" : formatInteger(fleet?.totalBookings ?? undefined),
      change: isLoading ? "" : fleet?.bookingsChange ?? "",
      isPositive: isPositiveChange(fleet?.bookingsChange),
      subtitle: "Lifetime",
      icon: ClipboardList,
      bgGradient: "from-purple-50 to-fuchsia-100 dark:from-purple-950/40 dark:to-fuchsia-950/40",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      key: "avg-duration",
      title: "Avg. Booking Duration",
      value: isLoading ? "…" : formatDurationDays(fleet?.averageBookingDurationDays ?? undefined),
      change: isLoading ? "" : avgDurationChange,
      isPositive: isPositiveChange(avgDurationChange),
      subtitle: "Average rental length per booking",
      icon: Timer,
      bgGradient: "from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      key: "fleet-size",
      title: "Fleet Size",
      value: isLoading ? "…" : formatInteger(totalFleet),
      change: "",
      isPositive: true,
      subtitle: fleetSubtitle,
      icon: BarChart3,
      bgGradient: "from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-950/40",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "upcoming-bookings",
      title: "Upcoming Bookings",
      value: isLoading ? "…" : formatInteger(fleet?.upcomingBookings ?? undefined),
      change: "",
      isPositive: true,
      subtitle: "Next scheduled trips",
      icon: CalendarCheck,
      bgGradient: "from-sky-50 to-blue-100 dark:from-sky-950/40 dark:to-blue-950/40",
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      key: "cancellation-rate",
      title: "Cancellation Rate",
      value: isLoading ? "…" : formatPercent(fleet?.cancellationRate ?? undefined),
      change: isLoading ? "" : cancellationChange,
      isPositive: isPositiveChange(cancellationChange),
      subtitle: "Canceled vs confirmed bookings",
      icon: Activity,
      bgGradient: "from-rose-50 to-red-100 dark:from-rose-950/40 dark:to-red-950/40",
      iconBg: "bg-rose-100 dark:bg-rose-900/40",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {metrics.map((metric) => renderCard(metric))}
    </div>
  )
}
