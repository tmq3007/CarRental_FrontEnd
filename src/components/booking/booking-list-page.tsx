"use client"

import { useState, useMemo } from "react"
import {
  useGetBookingsByAccountIdQuery,
  useSearchBookingsByAccountIdQuery,
  useReturnCarMutation,
  useCancelBookingMutation,
  useConfirmPickupMutation,
  useRateCarMutation,
  BookingVO,
  BookingQueryParams,
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
import { Search, Filter, Calendar, Car, CreditCard, MapPin, Star, Check, RotateCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"

export default function BookingListPage() {
  const userId = useSelector((state: RootState) => state.user?.id)
  const router = useRouter()
  const [cancelBooking] = useCancelBookingMutation()
  const [confirmPickup] = useConfirmPickupMutation()
  const [returnCar] = useReturnCarMutation()
  const [rateCar] = useRateCarMutation()

  // State cho search mới
  const [searchParams, setSearchParams] = useState<BookingQueryParams>({
    searchTerm: "",
    sortOrder: "newest",
    statuses: ["confirmed", "in_progress", "pending_payment", "pending_deposit"],
  })

  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // API calls
  const { data: allBookingsData, isLoading: isLoadingAll, isError: isErrorAll } = useGetBookingsByAccountIdQuery(
      { accountId: userId || "" },
      { skip: !userId }
  )

  const { data: searchedBookingsData, isLoading: isLoadingSearch, isError: isErrorSearch } = useSearchBookingsByAccountIdQuery(
      {
        accountId: userId || "",
        queryParams: searchParams
      },
      {
        skip: !userId || !isSearching
      }
  )

  // Quyết định dùng data nào
  const bookingsData = isSearching ? searchedBookingsData : allBookingsData
  const bookings = bookingsData?.data || []
  const isLoading = isLoadingAll || (isSearching && isLoadingSearch)
  const isError = isErrorAll || (isSearching && isErrorSearch)

  // Handle search
  const handleSearch = () => {
    if (!searchParams.searchTerm &&
        searchParams.statuses?.length === statusOptions.length &&
        searchParams.sortOrder === "newest") {
      // Nếu không có filter nào được áp dụng, tắt search mode
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
    setCurrentPage(1) // Reset về trang đầu tiên
  }

  // Handle reset
  const handleReset = () => {
    setSearchParams({
      searchTerm: "",
      sortOrder: "newest",
      statuses: ["confirmed", "in_progress", "pending_payment", "pending_deposit"],
    })
    setIsSearching(false)
    setCurrentPage(1)
  }

  // Status options
  const statusOptions = [
    { value: "confirmed", label: "Confirmed" },
    { value: "in_progress", label: "In Progress" },
    { value: "pending_payment", label: "Pending Payment" },
    { value: "pending_deposit", label: "Pending Deposit" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  // Pagination
  const totalPages = Math.ceil(bookings.length / itemsPerPage)
  const paginatedBookings = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleConfirmPickup = async (booking: BookingVO) => {
    try {
      const confirmPromise = confirmPickup({ bookingNumber: booking.bookingNumber }).unwrap()
      toast.promise(confirmPromise, {
        loading: "Confirming pickup...",
        success: `Pickup confirmed for ${booking.carName}`,
        error: "Failed to confirm pickup. Please try again.",
      })
    } catch (error) {
      toast.error("Failed to confirm pickup")
    }
  }

  const handleCancelBooking = async (booking: BookingVO) => {
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833 2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
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
                          try {
                            const cancelPromise = cancelBooking({ bookingId: booking.bookingNumber }).unwrap()
                            toast.promise(cancelPromise, {
                              loading: "Cancelling booking...",
                              success: `Booking ${booking.bookingNumber} cancelled successfully`,
                              error: "Failed to cancel booking. Please try again.",
                            })
                          } catch (error) {
                            toast.error("Failed to cancel booking")
                          }
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

  const handleReturnCar = async (booking: BookingVO) => {
    const pickupDate = new Date(booking.pickupDate ?? "")
    const returnDate = new Date(booking.returnDate ?? "")
    const total = (booking.basePrice ?? 0)
    const refundAmount = (booking.deposit ?? 0) - total

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
                      Total cost: <span className="font-medium">{formatCurrency(total)}</span>
                    </p>
                    <p>
                      Deposit: <span className="font-medium">{formatCurrency(booking.deposit ?? 0)}</span>
                    </p>
                    <p className={`font-medium ${refundAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {refundAmount > 0
                          ? `Refund: ${formatCurrency(refundAmount)}`
                          : `Remaining charge: ${formatCurrency(Math.abs(refundAmount))}`}
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
                          try {
                            const returnPromise = returnCar({ bookingId: booking.bookingNumber }).unwrap()
                            toast.promise(returnPromise, {
                              loading: "Processing car return...",
                              success: () => {
                                setSelectedBooking(booking)
                                setRatingDialogOpen(true)
                                return `Car returned successfully for ${booking.carName}`
                              },
                              error: "Failed to return car. Please try again.",
                            })
                          } catch (error) {
                            toast.error("Failed to return car")
                          }
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

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingVO | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>("")

  const handleSubmitRating = async () => {
    if (!selectedBooking || rating === 0) {
      toast.error("Please select a rating and ensure a booking is selected")
      return
    }

    try {
      const response = await rateCar({
        bookingNumber: selectedBooking.bookingNumber,
        rating,
        comment: review,
      }).unwrap()
      toast.success(response.data?.message || "Rating and review submitted successfully", {
        description: `You rated ${selectedBooking.carName} ${rating} star${rating > 1 ? "s" : ""}.`,
      })
      setRatingDialogOpen(false)
      setRating(0)
      setReview("")
      setSelectedBooking(null)
    } catch (error: any) {
      const errMsg = error?.data?.message || "Failed to submit rating and review"
      toast.error("Error", { description: errMsg })
    }
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
  if (isError) return <div>Error loading bookings</div>
  // if (bookings.length === 0 && !isLoading) return <NoResult />

  return (
      <div className="space-y-6 p-16">
        {/* Header với Search mới */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your car rental bookings</p>
            </div>

            {/* Search và Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Search by brand, model or booking number..."
                    value={searchParams.searchTerm || ""}
                    onChange={(e) => setSearchParams(prev => ({
                      ...prev,
                      searchTerm: e.target.value
                    }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 w-full border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    Sort: {searchParams.sortOrder === "newest" ? "Newest" : "Oldest"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                      onClick={() => setSearchParams(prev => ({ ...prev, sortOrder: "newest" }))}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                      onClick={() => setSearchParams(prev => ({ ...prev, sortOrder: "oldest" }))}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Oldest First
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {searchParams.statuses?.length === statusOptions.length ? "All" : searchParams.statuses?.length}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {statusOptions.map((option) => (
                      <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={searchParams.statuses?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            setSearchParams(prev => ({
                              ...prev,
                              statuses: checked
                                  ? [...(prev.statuses || []), option.value]
                                  : prev.statuses?.filter(s => s !== option.value) || []
                            }))
                          }}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                    onClick={handleSearch}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoadingSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>

                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Search Status Indicator */}
          {isSearching && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-700 text-sm">
                    <Search className="w-4 h-4 mr-2" />
                    <span>
                  Showing filtered results {searchParams.searchTerm && `for "${searchParams.searchTerm}"`}
                      {searchParams.statuses && searchParams.statuses.length > 0 &&
                          ` with ${searchParams.statuses.length} status filter(s)`}
                </span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {bookings.length} results
                  </Badge>
                </div>
              </div>
          )}

        </div>

        {/* Bookings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedBookings.map((booking: BookingVO) => {
            const pickupDate = new Date(booking.pickupDate ?? "")
            const returnDate = new Date(booking.returnDate ?? "")
            const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

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
                        <span className="font-semibold text-gray-900">{formatCurrency(booking.basePrice ?? 0)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                          onClick={() => router.push(`/user/booking/${booking.bookingNumber}`)}
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
                  totalItems={bookings.length}
                  startIndex={(currentPage - 1) * itemsPerPage}
                  endIndex={Math.min(currentPage * itemsPerPage, bookings.length)}
                  onPageChange={setCurrentPage}
              />
            </div>
        )}

        {/* Rating Dialog */}
        <Dialog.Root open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <Dialog.Title className="text-lg font-bold">Rate your trip</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-2">
                Do you enjoy your trip, please let us know what you think
              </Dialog.Description>
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                            rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                    />
                ))}
              </div>
              <textarea
                  className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your review here..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
              />
              <div className="flex justify-end gap-4 mt-4">
                <Dialog.Close asChild>
                  <Button className="bg-gray-200 text-black hover:bg-gray-300">Skip</Button>
                </Dialog.Close>
                <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={handleSubmitRating}
                    disabled={rating === 0}
                >
                  Send Review
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
  )
}