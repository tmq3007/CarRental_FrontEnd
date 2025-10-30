"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"

export default function UpcomingBookingsList() {
  // Mock data - replace with real API calls
  const bookings = [
    {
      id: 1,
      carName: "Toyota Corolla",
      customerName: "John Doe",
      dateRange: "Nov 2–5, 2025",
      status: "Confirmed",
      statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      carName: "Honda Civic",
      customerName: "Jane Smith",
      dateRange: "Nov 3–7, 2025",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      carName: "BMW 3 Series",
      customerName: "Mike Johnson",
      dateRange: "Nov 6–10, 2025",
      status: "Confirmed",
      statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Upcoming Bookings
        </CardTitle>
        <CardDescription>Your next scheduled rentals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {/* Car Image */}
              <img
                src={booking.image || "/placeholder.svg"}
                alt={booking.carName}
                className="w-16 h-16 rounded-lg object-cover"
              />

              {/* Booking Details */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{booking.carName}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {booking.customerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {booking.dateRange}
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-3">
                <Badge className={booking.statusColor}>{booking.status}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20 bg-transparent"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
