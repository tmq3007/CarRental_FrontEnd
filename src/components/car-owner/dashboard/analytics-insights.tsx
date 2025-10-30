"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, Zap, Activity } from "lucide-react"

export default function AnalyticsInsights() {
  // Mock data - replace with real API calls
  const bookingsPerCar = [
    { name: "Toyota Corolla", bookings: 10 },
    { name: "Honda Civic", bookings: 8 },
    { name: "BMW 3 Series", bookings: 6 },
    { name: "Audi A4", bookings: 5 },
  ]

  const bookingSource = [
    { name: "App", value: 65, color: "#22c55e" },
    { name: "Web", value: 35, color: "#3b82f6" },
  ]

  const insights = [
    {
      title: "Top Performing Car",
      value: "Toyota Corolla",
      subtitle: "10 rentals this month",
      icon: TrendingUp,
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      title: "Peak Booking Time",
      value: "Weekends",
      subtitle: "Fri–Sun (65% of bookings)",
      icon: Activity,
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
    {
      title: "Returning Customers",
      value: "25%",
      subtitle: "Of total bookings",
      icon: Users,
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
    },
    {
      title: "Utilization Rate",
      value: "78%",
      subtitle: "Fleet average",
      icon: Zap,
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className={`${insight.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${insight.iconColor}`} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{insight.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{insight.value}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">{insight.subtitle}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookings per Car */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Bookings per Car</CardTitle>
            <CardDescription>Performance by vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsPerCar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Bar dataKey="bookings" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Source */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Booking Source</CardTitle>
            <CardDescription>App vs Web distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingSource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingSource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
