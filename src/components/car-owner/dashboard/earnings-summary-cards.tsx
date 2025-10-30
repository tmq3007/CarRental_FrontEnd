"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Clock, CheckCircle, Calendar } from "lucide-react"

export default function EarningsSummaryCards() {
  // Mock data - replace with real API calls
  const cards = [
    {
      title: "Total Earnings",
      subtitle: "This Month",
      value: "$2,340",
      icon: DollarSign,
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
      trend: "+12.5%",
      trendColor: "text-green-600",
    },
    {
      title: "Pending Payments",
      subtitle: "Awaiting Transfer",
      value: "$540",
      icon: Clock,
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600",
      trend: "-2.3%",
      trendColor: "text-yellow-600",
    },
    {
      title: "Completed Bookings",
      subtitle: "This Month",
      value: "12",
      icon: CheckCircle,
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      trend: "+8.2%",
      trendColor: "text-blue-600",
    },
    {
      title: "Last Payout Date",
      subtitle: "Previous Transfer",
      value: "Oct 25",
      icon: Calendar,
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      trend: "On Schedule",
      trendColor: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{card.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{card.subtitle}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
                <span className={`text-xs font-semibold ${card.trendColor}`}>{card.trend}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
