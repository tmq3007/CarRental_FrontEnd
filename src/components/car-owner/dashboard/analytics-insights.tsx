"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useGetEarningsMetricsQuery } from "@/lib/services/car-owner-api"

export default function AnalyticsInsights() {
  const { data, isLoading, isError } = useGetEarningsMetricsQuery()
  const monthly = data?.data?.monthlyRevenue ?? []

  // Fallback sample if no data yet
  const chartData = monthly.length
    ? monthly.map((m) => ({ label: m.month, revenue: m.total }))
    : [
        { label: "Jan", revenue: 0 },
        { label: "Feb", revenue: 0 },
        { label: "Mar", revenue: 0 },
        { label: "Apr", revenue: 0 },
      ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Revenue by Month */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-base sm:text-lg">Revenue by Month</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total revenue in selected year</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          {isError ? (
            <div className="text-sm text-red-600">Failed to load revenue.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="label" stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monthly revenue trend</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          {isError ? (
            <div className="text-sm text-red-600">Failed to load revenue.</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="label" stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
