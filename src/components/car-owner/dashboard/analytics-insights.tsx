"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function AnalyticsInsights() {
  // Mock data - bookings by day
  const bookingsByDay = [
    { day: "Mon", bookings: 12, revenue: 1800 },
    { day: "Tue", bookings: 14, revenue: 2100 },
    { day: "Wed", bookings: 10, revenue: 1500 },
    { day: "Thu", bookings: 16, revenue: 2400 },
    { day: "Fri", bookings: 18, revenue: 2700 },
    { day: "Sat", bookings: 22, revenue: 3300 },
    { day: "Sun", bookings: 19, revenue: 2850 },
  ]

  const vehicleUtilization = [
    { name: "Toyota Camry", value: 78, color: "#10b981" },
    { name: "Honda Civic", value: 65, color: "#3b82f6" },
    { name: "Ford Explorer", value: 82, color: "#8b5cf6" },
    { name: "BMW X5", value: 45, color: "#f59e0b" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Weekly Bookings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-base sm:text-lg">Weekly Activity</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bookings and revenue by day</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookingsByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="day" stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                className="dark:bg-gray-900 dark:border-gray-700"
              />
              <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vehicle Utilization */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-base sm:text-lg">Vehicle Utilization</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average usage percentage</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3">
            {vehicleUtilization.map((vehicle) => (
              <div key={vehicle.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {vehicle.name}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{vehicle.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${vehicle.value}%`, backgroundColor: vehicle.color }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card className="border-0 shadow-sm lg:col-span-2">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Daily revenue for the week</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingsByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="day" stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-500" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                className="dark:bg-gray-900 dark:border-gray-700"
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
        </CardContent>
      </Card>
    </div>
  )
}
