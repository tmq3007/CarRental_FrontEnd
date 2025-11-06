"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"

export default function UpcomingBookingsList() {
  // Mock data - replace with real API calls
  const bookings = [
    {
      id: 1,
      customerName: "John Smith",
      carModel: "Toyota Camry 2024",
      startDate: "Dec 15, 2024",
      endDate: "Dec 18, 2024",
      pickupLocation: "Downtown",
      status: "Confirmed",
      totalDays: 3,
      totalAmount: "$450",
      rating: 4.8,
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      carModel: "Honda Civic 2024",
      startDate: "Dec 20, 2024",
      endDate: "Dec 22, 2024",
      pickupLocation: "Airport",
      status: "Pending",
      totalDays: 2,
      totalAmount: "$280",
      rating: null,
    },
    {
      id: 3,
      customerName: "Michael Chen",
      carModel: "Ford Explorer 2024",
      startDate: "Dec 25, 2024",
      endDate: "Dec 29, 2024",
      pickupLocation: "Downtown",
      status: "Confirmed",
      totalDays: 4,
      totalAmount: "$680",
      rating: 5.0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
      case "Completed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-base sm:text-lg">Upcoming Bookings</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Next 3 confirmed and pending bookings</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{booking.customerName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{booking.carModel}</p>
                </div>
                <Badge className={`flex-shrink-0 text-xs ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{booking.startDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{booking.totalDays} days</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{booking.pickupLocation}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{booking.totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
