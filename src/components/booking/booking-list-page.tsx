"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  useGetBookingsByAccountIdQuery,
  useSearchBookingsByAccountIdQuery,
  useGetBookingDetailQuery,
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
import {
  Search,
  Filter,
  Calendar,
  CreditCard,
  MapPin,
  Star,
  RotateCcw,
  CheckCircle2,
  Ban,
  Undo2,
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { BookingActionPanel, type ActionKey } from "@/components/booking/booking-action-panel"
import { CustomerBookingDetailModal } from "@/components/booking/customer-booking-detail-modal"
import { BookingStatusBadge } from "../car-owner/booking/status-badge"
import { BookingSummaryDialog } from "@/components/booking/booking-summary-dialog"
import { BOOKING_STATUS_OPTIONS } from "@/lib/constants/booking-status"

type CustomerActionConfig = {
  key: ActionKey
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: LucideIcon
}

const CUSTOMER_ACTION_CONFIG: Partial<Record<ActionKey, CustomerActionConfig>> = {
  customer_confirm_pickup: {
    key: "customer_confirm_pickup",
    label: "Confirm pickup",
    variant: "default",
    icon: CheckCircle2,
  },
  customer_cancel: {
    key: "customer_cancel",
    label: "Cancel booking",
    variant: "destructive",
    icon: Ban,
  },
  customer_request_return: {
    key: "customer_request_return",
    label: "Request return",
    variant: "default",
    icon: Undo2,
  },
  customer_return_again: {
    key: "customer_return_again",
    label: "Request again",
    variant: "secondary",
    icon: RefreshCw,
  },
}

function normalizeStatus(status?: string | null) {
  return (status ?? "").toLowerCase()
}

function getCustomerActionsForStatus(status?: string | null): ActionKey[] {
  switch (normalizeStatus(status)) {
    case "waiting_confirmed":
      return ["customer_cancel"]
    case "pending_deposit":
      return ["customer_cancel"]
    case "confirmed":
      return ["customer_confirm_pickup"]
    case "in_progress":
      return ["customer_request_return"]
    case "waiting_confirm_return":
      return []
    case "rejected_return":
      return ["customer_return_again"]
    case "pending_payment":
      return ["customer_request_return"]
    default:
      return []
  }
}

export default function BookingListPage() {
  const userId = useSelector((state: RootState) => state.user?.id)
  const router = useRouter()
  const [rateCar] = useRateCarMutation()

  // State cho search mới
  const [searchParams, setSearchParams] = useState<BookingQueryParams>({
    searchTerm: "",
    sortOrder: "newest",
    statuses: ["confirmed", "in_progress", "pending_payment", "pending_deposit", "rejected_return", "waiting_confirm_return", "waiting_confirmed", "completed", "cancelled"],
  })

  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedBookingNumber, setSelectedBookingNumber] = useState<string | null>(null)
  const [pendingActionKey, setPendingActionKey] = useState<ActionKey | null>(null)
  const [actionRunnerContext, setActionRunnerContext] = useState<{
    bookingNumber: string
    actionKey: ActionKey
    requestId: number
  } | null>(null)
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)
  const [summaryBookingNumber, setSummaryBookingNumber] = useState<string | null>(null)

  const statusRegistryRef = useRef<Map<string, string>>(new Map())
  const hasInitializedStatusesRef = useRef(false)
  const completionQueueRef = useRef<string[]>([])
  const shownCompletionsRef = useRef<Set<string>>(new Set())

  // API calls
  const {
    data: allBookingsData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAllBookings,
  } = useGetBookingsByAccountIdQuery(
    { accountId: userId || "" },
    { skip: !userId }
  )

  const {
    data: searchedBookingsData,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    refetch: refetchSearchedBookings,
  } = useSearchBookingsByAccountIdQuery(
    {
      accountId: userId || "",
      queryParams: searchParams,
    },
    {
      skip: !userId || !isSearching,
    }
  )

  // Quyết định dùng data nào
  const bookingsData = isSearching ? searchedBookingsData : allBookingsData
  const bookings = bookingsData?.data || []
  const isLoading = isLoadingAll || (isSearching && isLoadingSearch)
  const isError = isErrorAll || (isSearching && isErrorSearch)

  const refreshBookings = useCallback(async (): Promise<BookingVO[]> => {
    if (isSearching) {
      const result = await refetchSearchedBookings()
      if ('data' in result && result.data?.data) {
        return result.data.data
      }
    } else {
      const result = await refetchAllBookings()
      if ('data' in result && result.data?.data) {
        return result.data.data
      }
    }
    return bookings
  }, [isSearching, refetchAllBookings, refetchSearchedBookings, bookings])

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
  const statusOptions = BOOKING_STATUS_OPTIONS

  // Pagination
  const totalPages = Math.ceil(bookings.length / itemsPerPage)
  const paginatedBookings = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)


  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingVO | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>("")

  const openDetailModal = useCallback(
    (booking: BookingVO, actionKey?: ActionKey | null) => {
      setSelectedBooking(booking)
      setSelectedBookingNumber(booking.bookingNumber)
      setPendingActionKey(actionKey ?? null)
      setDetailModalOpen(true)
    },
    []
  )

  const triggerCustomerAction = useCallback(
    (booking: BookingVO, actionKey: ActionKey) => {
      setSelectedBooking(booking)
      setSelectedBookingNumber(booking.bookingNumber)
      setActionRunnerContext({
        bookingNumber: booking.bookingNumber,
        actionKey,
        requestId: Date.now(),
      })
    },
    []
  )

  const showNextCompletion = useCallback(() => {
      if (summaryModalOpen) {
        return
      }

      const nextBookingNumber = completionQueueRef.current.shift()
      if (!nextBookingNumber) {
        return
      }

      shownCompletionsRef.current.add(nextBookingNumber)
      setSummaryBookingNumber(nextBookingNumber)
      setSummaryModalOpen(true)
      toast.success("Congratulations! Your trip is complete.", {
        description: `Booking #${nextBookingNumber} has been completed. Review the summary for full details.`,
      })
    }, [summaryModalOpen])

  const handleDetailModalOpenChange = useCallback((open: boolean) => {
    setDetailModalOpen(open)
    if (!open) {
      setPendingActionKey(null)
      setSelectedBookingNumber(null)
      setSelectedBooking(null)
    }
  }, [])

  const handleActionCompleted = useCallback(
    async (actionKey: ActionKey) => {
      const updatedBookings = await refreshBookings()
      if (actionKey === "customer_request_return" || actionKey === "customer_return_again") {
        let targetBooking: BookingVO | null = selectedBooking
        if (selectedBookingNumber) {
          const latest = updatedBookings.find((item) => item.bookingNumber === selectedBookingNumber)
          if (latest) {
            targetBooking = latest
          }
        }
        if (targetBooking) {
          setSelectedBooking(targetBooking)
          setRatingDialogOpen(true)
        }
      }
    },
    [refreshBookings, selectedBookingNumber, selectedBooking]
  )

  useEffect(() => {
    if (!bookings.length) {
      statusRegistryRef.current.clear()
      completionQueueRef.current = []
      hasInitializedStatusesRef.current = false
      return
    }

    const registry = statusRegistryRef.current
    const newCompletions: string[] = []

    bookings.forEach((booking: BookingVO) => {
      const normalized = normalizeStatus(booking.status)
      const previous = registry.get(booking.bookingNumber)
      if (
        hasInitializedStatusesRef.current &&
        normalized === "completed" &&
        previous !== "completed" &&
        !shownCompletionsRef.current.has(booking.bookingNumber) &&
        !completionQueueRef.current.includes(booking.bookingNumber)
      ) {
        newCompletions.push(booking.bookingNumber)
      }
      registry.set(booking.bookingNumber, normalized)
    })

    hasInitializedStatusesRef.current = true

    if (newCompletions.length) {
      completionQueueRef.current.push(...newCompletions)
      showNextCompletion()
    }
  }, [bookings, showNextCompletion])

  useEffect(() => {
    if (!summaryModalOpen) {
      showNextCompletion()
    }
  }, [summaryModalOpen, showNextCompletion])

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
      await refreshBookings()
    } catch (error: any) {
      const errMsg = error?.data?.message || "Failed to submit rating and review"
      toast.error("Error", { description: errMsg })
    }
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
          const normalizedStatus = normalizeStatus(booking.status)
          const customerActions = getCustomerActionsForStatus(normalizedStatus)

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
                <div className="absolute top-3 right-3"><BookingStatusBadge status={normalizedStatus} /></div>
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
                    onClick={() => openDetailModal(booking)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Manage Booking
                  </Button>

                  <Button
                    onClick={() => router.push(`/user/booking/${booking.bookingNumber}`)}
                    variant="outline"
                    size="sm"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  >
                    View Details
                  </Button>

                  {customerActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {customerActions.map((actionKey) => {
                        const config = CUSTOMER_ACTION_CONFIG[actionKey]
                        if (!config) {
                          return null
                        }
                        const Icon = config.icon
                        const buttonClass =
                          config.variant === "outline"
                            ? "flex-1 border-green-200 text-green-700 hover:bg-green-50"
                            : config.variant === "secondary"
                              ? "flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "flex-1"
                        return (
                          <Button
                            key={`${booking.bookingNumber}-${actionKey}`}
                            variant={config.variant}
                            size="sm"
                            className={buttonClass}
                            onClick={() => triggerCustomerAction(booking, actionKey)}
                          >
                            <Icon className="mr-1 h-3.5 w-3.5" />
                            {config.label}
                          </Button>
                        )
                      })}
                    </div>
                  )}

                  {normalizedStatus === "completed" && (
                    <Button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setSelectedBookingNumber(booking.bookingNumber)
                        setRatingDialogOpen(true)
                      }}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center gap-2"
                    >
                      <Star className="h-4 w-4 text-emerald-500" />
                      Leave a review
                    </Button>
                  )}
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

      {actionRunnerContext && (
        <CustomerActionRunner
          key={actionRunnerContext.requestId}
          context={actionRunnerContext}
          onClose={() => setActionRunnerContext(null)}
          onActionCompleted={handleActionCompleted}
        />
      )}

      <CustomerBookingDetailModal
        bookingNumber={selectedBookingNumber}
        open={detailModalOpen}
        onOpenChange={handleDetailModalOpenChange}
        disableActions={false}
        initialActionKey={pendingActionKey}
        onInitialActionHandled={() => setPendingActionKey(null)}
        onActionCompleted={handleActionCompleted}
      />

      <BookingSummaryDialog
        bookingNumber={summaryBookingNumber}
        open={summaryModalOpen}
        onOpenChange={(open) => {
          setSummaryModalOpen(open)
          if (!open) {
            setSummaryBookingNumber(null)
          }
        }}
      />

      {/* Rating Dialog */}
      <Dialog.Root
        open={ratingDialogOpen}
        onOpenChange={(open) => {
          setRatingDialogOpen(open)
          if (!open) {
            setRating(0)
            setReview("")
          }
        }}
      >
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
                  className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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

interface CustomerActionRunnerProps {
  context: {
    bookingNumber: string
    actionKey: ActionKey
  }
  onClose: () => void
  onActionCompleted: (actionKey: ActionKey) => Promise<void> | void
}

function CustomerActionRunner({ context, onClose, onActionCompleted }: CustomerActionRunnerProps) {
  const { bookingNumber, actionKey } = context
  const { data, isFetching, isError } = useGetBookingDetailQuery(bookingNumber, {
    skip: !bookingNumber,
  })
  const bookingDetail = data?.data

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load booking details for this action")
      onClose()
    }
  }, [isError, onClose])

  return (
    <div className="hidden" aria-hidden="true">
      {bookingDetail ? (
        <BookingActionPanel
          booking={bookingDetail}
          role="customer"
          isRefreshing={isFetching}
          initialActionKey={actionKey}
          onActionCompleted={async (completedKey) => {
            await onActionCompleted(completedKey)
            onClose()
          }}
        />
      ) : null}
    </div>
  )
}