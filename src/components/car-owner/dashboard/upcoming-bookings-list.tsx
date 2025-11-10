"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { useGetBookingsByAccountIdQuery, useGetCarOwnerUpcommingBookingsQuery } from "@/lib/services/booking-api"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import { BookingStatusBadge } from "../booking/status-badge"

interface UpcomingBookingsListProps {
  accountId: string
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function dayDiff(a?: string, b?: string) {
  if (!a || !b) return 0
  const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime())
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export default function UpcomingBookingsList({ accountId }: UpcomingBookingsListProps) {
  const { data, isLoading, isError } = useGetCarOwnerUpcommingBookingsQuery({ accountId, limit: 3 })
  const bookings = data?.data ?? []


  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-base sm:text-lg">Upcoming Bookings</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Next confirmed and pending bookings</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading && (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading bookings...</div>
          )}
          {isError && (
            <div className="p-4 text-sm text-red-600">Failed to load bookings.</div>
          )}
          {!isLoading && !isError && bookings.slice(0, 3).map((booking) => (
            <div key={booking.bookingNumber} className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{booking.carName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">#{booking.bookingNumber}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(booking.pickupDate)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{dayDiff(booking.pickupDate, booking.returnDate)} days</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{booking.pickUpLocation || "-"}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {typeof booking.basePrice === "number" ? formatCurrency(booking.basePrice) : booking.basePrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
