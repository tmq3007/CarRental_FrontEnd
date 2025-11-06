"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"

export default function EarningsSummaryCards() {
  // Mock data - replace with real API calls
  const earningsCards = [
    {
      title: "Total Earnings",
      value: "$24,906",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Pending Payouts",
      value: "$3,240",
      change: "Due in 5 days",
      isPositive: true,
      icon: CreditCard,
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "This Month",
      value: "$8,420",
      change: "+8.2%",
      isPositive: true,
      icon: TrendingUp,
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Avg. Per Booking",
      value: "$156",
      change: "-2.1%",
      isPositive: false,
      icon: TrendingDown,
      bgGradient: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {earningsCards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className={`border-0 shadow-sm bg-gradient-to-br ${card.bgGradient} hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{card.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
                </div>
              </div>
              <p
                className={`text-xs sm:text-sm font-medium ${card.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {card.change}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
