"use client"

import { useState, useMemo } from "react"
import {
  useGetBookingsByAccountIdQuery,
  useReturnCarMutation,
  useCancelBookingMutation,
  useConfirmPickupMutation,
  BookingDetailVO,
} from "@/lib/services/booking-api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { toast } from "sonner"
import LoadingPage from "@/components/common/loading"
import NoResult from "@/components/common/no-result"
import { Pagination } from "@/components/wallet/pagination"
import { Search, Filter, Calendar, Car, CreditCard, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"

interface BookingListPageProps {
  onViewDetails: (bookingId: string) => void
}

export default function BookingListPage({ onViewDetails }: BookingListPageProps) {
  const userId = useSelector((state: RootState) => state.user?.id)
  const [cancelBooking] = useCancelBookingMutation()
  const [confirmPickup] = useConfirmPickupMutation()
  const [returnCar] = useReturnCarMutation()
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [searchTerm, setSearchTerm] = useState("")

  const { data, isLoading, isError } = useGetBookingsByAccountIdQuery({ accountId: userId || "" }, { skip: !userId })

  const bookings = data?.data || []

  const sortedBookings = useMemo(() => {
    let filteredBookings = bookings
    if (searchTerm) {
      filteredBookings = bookings.filter(
        (booking) =>
          booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return [...filteredBookings].sort((a, b) => {
      const dateA = new Date(a.pickUpTime ?? "").getTime()
      const dateB = new Date(b.pickUpTime ?? "").getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
  }, [bookings, sortOrder, searchTerm])

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage)
  const paginatedBookings = sortedBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleConfirmPickup = async (booking: BookingDetailVO) => {
    const confirmPromise = confirmPickup({ bookingNumber: booking.bookingNumber }).unwrap()

    toast.promise(confirmPromise, {
      loading: "Confirming pickup...",
      success: `Pickup confirmed for ${booking.carName}`,
      error: "Failed to confirm pickup. Please try again.",
    })
  }

  const handleCancelBooking = async (booking: BookingDetailVO) => {
    toast.custom(
      (t) => (
        <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">Cancel Booking</h3>
              <p className="mt-1 text-sm text-gray-600">
                Are you sure you want to cancel booking <span className="font-medium">{booking.bookingNumber}</span>?
              </p>
              <div className="mt-3 flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)} className="text-xs">
                  Keep Booking
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    toast.dismiss(t)
                    const cancelPromise = cancelBooking({ bookingId: booking.bookingNumber }).unwrap()
                    toast.promise(cancelPromise, {
                      loading: "Cancelling booking...",
                      success: `Booking ${booking.bookingNumber} cancelled successfully`,
                      error: "Failed to cancel booking. Please try again.",
                    })
                  }}
                  className="text-xs bg-red-600 hover:bg-red-700"
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 10000 },
    )
  }

  const handleReturnCar = async (booking: BookingDetailVO) => {
    const pickupDate = new Date(booking.pickUpTime ?? "")
    const returnDate = new Date(booking.dropOffTime ?? "")
    const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const total = booking.basePrice ?? -1 * numberOfDays
    const refundAmount = booking.deposit ?? -1 - total

    toast.custom(
      (t) => (
        <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">Return Car</h3>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>
                  Total cost: <span className="font-medium">{formatCurrency(total)} VND</span>
                </p>
                <p>
                  Deposit: <span className="font-medium">{formatCurrency(booking.deposit ?? -1)}</span>
                </p>
                <p className={`font-medium ${refundAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {refundAmount > 0
                    ? `Refund: ${formatCurrency(refundAmount ?? -1)}`
                    : `Additional charge: ${formatCurrency(Math.abs(refundAmount))}`}
                </p>
              </div>
              <div className="mt-3 flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    toast.dismiss(t)
                    const returnPromise = returnCar({ bookingId: booking.bookingNumber }).unwrap()
                    toast.promise(returnPromise, {
                      loading: "Processing car return...",
                      success: `Car returned successfully for ${booking.carName}`,
                      error: "Failed to return car. Please try again.",
                    })
                  }}
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  Confirm Return
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 15000 },
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
      in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending_payment: { label: "Pending Payment", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      pending_deposit: { label: "Pending Deposit", className: "bg-orange-100 text-orange-800 border-orange-200" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800 border-gray-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed
    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    )
  }

  if (isLoading) return <LoadingPage />
  if (isError || bookings.length === 0) return <NoResult />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your car rental bookings</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 w-64 border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedBookings.map((booking: BookingDetailVO) => {
          const pickupDate = new Date(booking.pickUpTime ?? "")
          const returnDate = new Date(booking.dropOffTime ?? "")
          const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
          const total = booking.basePrice ?? -1 * numberOfDays

          return (
            <Card
              key={booking.bookingNumber}
              className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200 bg-white"
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={booking.carImageFront || "/placeholder.svg?height=200&width=300&text=Car+Image"}
                  alt={booking.carName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">{getStatusBadge(booking.status)}</div>
              </div>

              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {booking.carName}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">#{booking.bookingNumber}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                    <span>
                      {pickupDate.toLocaleDateString()} - {returnDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-green-500" />
                    <span>
                      {numberOfDays} day{numberOfDays > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                    <span className="font-semibold text-gray-900">{total.toLocaleString()} VND</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={() => onViewDetails(booking.bookingNumber)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    View Details
                  </Button>

                  <div className="flex gap-2">
                    {booking.status === "confirmed" && (
                      <>
                        <Button
                          onClick={() => handleConfirmPickup(booking)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                        >
                          Confirm Pickup
                        </Button>
                        <Button
                          onClick={() => handleCancelBooking(booking)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {booking.status === "pending_deposit" && (
                      <Button
                        onClick={() => handleCancelBooking(booking)}
                        variant="outline"
                        size="sm"
                        className="w-full border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Cancel Booking
                      </Button>
                    )}

                    {booking.status === "in_progress" && (
                      <Button
                        onClick={() => handleReturnCar(booking)}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Return Car
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedBookings.length}
            startIndex={(currentPage - 1) * itemsPerPage}
            endIndex={Math.min(currentPage * itemsPerPage, sortedBookings.length)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
