"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CalendarCheck, ClipboardList, CreditCard, DollarSign, Users, Wallet } from "lucide-react"
import { useGetEarningsMetricsQuery } from "@/lib/services/car-owner-api"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import {
  formatInteger,
  isPositiveChange,
  type MetricCard,
} from "./metric-helpers"

interface EarningsSummaryCardsProps {
  accountId: string
}

const calculateBookingDuration = (start?: string, end?: string) => {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0
  }
  const diff = endDate.getTime() - startDate.getTime()
  if (diff <= 0) return 0
  return Math.max(1, diff / (1000 * 60 * 60 * 24))
}

const formatAmount = (value?: number) => (typeof value === "number" ? formatCurrency(value) : "—")

export default function EarningsSummaryCards({ accountId }: EarningsSummaryCardsProps) {
  const { data: earningsResp, isLoading: earningsLoading } = useGetEarningsMetricsQuery()

  const earnings = earningsResp?.data
  const monthly = earnings?.monthlyRevenue ?? []
  const now = new Date()
  const currentMonthLabel = now.toLocaleString(undefined, { month: "long" })
  const currentMonthEntry = monthly.find((m) => {
    if (!m?.month) return false
    const parsed = new Date(m.month)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getMonth() === now.getMonth() && parsed.getFullYear() === now.getFullYear()
    }
    return m.month.toLowerCase().includes(currentMonthLabel.toLowerCase())
  })

  const pendingPayouts = earnings?.pendingPayouts ?? undefined
  const netProfitChange = earnings?.netProfitChange ?? earnings?.revenueChange
  const completedBookings = formatInteger(earnings?.completedBookingsThisMonth ?? undefined)
  const completedBookingsChange = earnings?.bookingsChange ?? ""
  const totalBookings = formatInteger(earnings?.totalBookings ?? undefined)
  const totalBookingsChange = earnings?.bookingsChange ?? ""
  const customers = formatInteger(earnings?.totalCustomers ?? undefined)
  const customersChange = earnings?.customersChange ?? ""

  const topMetrics: MetricCard[] = [
    {
      key: "net-profit",
      title: "Net Profit",
      value: earningsLoading ? "…" : formatAmount(earnings?.netProfit ?? undefined),
      change: earningsLoading ? "" : netProfitChange ?? "",
      isPositive: isPositiveChange(netProfitChange),
      subtitle: typeof earnings?.netProfit === "number" ? "After platform fees" : undefined,
      icon: Wallet,
      bgGradient: "from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-950/40",
      iconBg: "bg-green-100 dark:bg-green-900/40",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ]

  topMetrics.push({
    key: "avg-booking-value",
    title: "Avg. Booking Value",
    value: earningsLoading ? "…" : formatAmount(earnings?.averageBookingValue ?? undefined),
    change: earningsLoading ? "" : earnings?.averageBookingValueChange ?? "",
    isPositive: isPositiveChange(earnings?.averageBookingValueChange),
    subtitle: "Per completed booking",
    icon: CreditCard,
    bgGradient: "from-indigo-50 to-blue-100 dark:from-indigo-950/40 dark:to-blue-950/40",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  })

  topMetrics.push({
    key: "completed-bookings",
    title: "Completed Bookings",
    value: earningsLoading ? "…" : completedBookings,
    change: earningsLoading ? "" : completedBookingsChange,
    isPositive: isPositiveChange(completedBookingsChange),
    subtitle: "This month",
    icon: CalendarCheck,
    bgGradient: "from-purple-50 to-fuchsia-100 dark:from-purple-950/40 dark:to-fuchsia-950/40",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  })

  const totalEarnings = formatAmount(earnings?.totalRevenue ?? undefined)
  const thisMonth = formatAmount(currentMonthEntry?.total)

  const supportingMetrics: MetricCard[] = [
    {
      key: "total-earnings",
      title: "Total Earnings",
      value: earningsLoading ? "…" : totalEarnings,
      change: earningsLoading ? "" : earnings?.revenueChange ?? "",
      isPositive: isPositiveChange(earnings?.revenueChange),
      icon: DollarSign,
      bgGradient: "from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ]

  if (typeof pendingPayouts === "number") {
    supportingMetrics.splice(1, 0, {
      key: "pending-payouts",
      title: "Pending Payouts",
      value: earningsLoading ? "…" : formatAmount(pendingPayouts),
      change: "",
      isPositive: true,
      icon: CreditCard,
      bgGradient: "from-blue-50 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
    })
  }

  if (earningsLoading || earnings?.totalBookings !== undefined) {
    supportingMetrics.push({
      key: "total-bookings",
      title: "Total Bookings",
      value: earningsLoading ? "…" : totalBookings,
      change: earningsLoading ? "" : totalBookingsChange,
      isPositive: isPositiveChange(totalBookingsChange),
      icon: ClipboardList,
      bgGradient: "from-sky-50 to-blue-100 dark:from-sky-950/30 dark:to-blue-950/30",
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    })
  }

  if (earningsLoading || earnings?.totalCustomers !== undefined) {
    supportingMetrics.push({
      key: "total-customers",
      title: "Total Customers",
      value: earningsLoading ? "…" : customers,
      change: earningsLoading ? "" : customersChange,
      isPositive: isPositiveChange(customersChange),
      icon: Users,
      bgGradient: "from-rose-50 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30",
      iconBg: "bg-rose-100 dark:bg-rose-900/40",
      iconColor: "text-rose-600 dark:text-rose-400",
    })
  }

  if (currentMonthEntry) {
    supportingMetrics.push({
      key: "monthly-revenue",
      title: `${currentMonthLabel} Revenue`,
      value: earningsLoading ? "…" : thisMonth,
      change: earningsLoading ? "" : earnings?.bookingsChange ?? "",
      isPositive: isPositiveChange(earnings?.bookingsChange),
      icon: DollarSign,
      bgGradient: "from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
    })
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {topMetrics.map(renderCard)}
      </div>

      {supportingMetrics.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Financial Snapshot</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {supportingMetrics.map(renderCard)}
          </div>
        </div>
      )}
    </div>
  )
}
