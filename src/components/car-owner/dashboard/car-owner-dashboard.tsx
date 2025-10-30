"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import EarningsSummaryCards from "./earnings-summary-cards"
import UpcomingBookingsList from "./upcoming-bookings-list"
import RatingsReviewsSection from "./ratings-reviews-section"
import AnalyticsInsights from "./analytics-insights"

interface CarOwnerDashboardProps {
  userId: string
}

export default function CarOwnerDashboard({ userId }: CarOwnerDashboardProps) {
  // Mock data - replace with real API calls
  const earningsData = [
    { month: "May", earnings: 2400 },
    { month: "Jun", earnings: 1398 },
    { month: "Jul", earnings: 9800 },
    { month: "Aug", earnings: 3908 },
    { month: "Sep", earnings: 4800 },
    { month: "Oct", earnings: 3800 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your car rental business overview.</p>
        </div>

        {/* Earnings & Payments Overview */}
        <div className="mb-8">
          <EarningsSummaryCards />
        </div>

        {/* Earnings Chart */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Earnings Over Last 6 Months
              </CardTitle>
              <CardDescription>Your revenue trend for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    formatter={(value) => `$${value}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Bookings - Takes 2 columns */}
          <div className="lg:col-span-2">
            <UpcomingBookingsList />
          </div>

          {/* Ratings & Reviews - Takes 1 column */}
          <div>
            <RatingsReviewsSection />
          </div>
        </div>

        {/* Analytics & Insights */}
        <div>
          <AnalyticsInsights />
        </div>
      </div>
    </div>
  )
}
