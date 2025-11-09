"use client"

import { useCallback, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { DateRange } from "react-day-picker"
import { endOfDay, startOfDay } from "date-fns"
import { toast } from "sonner"
import { AlertTriangle, Loader2, WalletCards } from "lucide-react"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"

import {
  BookingFilters,
  type BookingSortOption,
  type BookingSortDirection,
  type BookingSortKey,
} from "@/components/car-owner/booking/booking-filters"
import { BookingTable } from "@/components/car-owner/booking/booking-table"
import { BookingDetailModal } from "@/components/car-owner/booking/booking-detail-modal"
import {
  CAR_OWNER_DEFAULT_STATUS_FILTER,
  CAR_OWNER_STATUS_PRIORITY,
} from "@/components/car-owner/booking/status-badge"
import type { BookingActionTarget } from "@/components/car-owner/booking/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { CheckedState } from "@radix-ui/react-checkbox"
import type { RootState } from "@/lib/store"
import useDebounce from "@/lib/hook/use-debounce"
import {
  type CarOwnerBookingQueryParams,
  type CarOwnerBookingVO,
  useCancelBookingMutation,
  useConfirmDepositMutation,
  useGetCarOwnerBookingsQuery,
} from "@/lib/services/booking-api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

const SORT_OPTIONS: BookingSortOption[] = [
	{
		id: "pickupDate_desc",
		label: "Newest bookings",
		description: "Most recently scheduled pick-ups first",
		sortBy: "pickupDate",
		sortDirection: "desc",
	},
	{
		id: "pickupDate_asc",
		label: "Oldest bookings",
		description: "Oldest pick-up dates first",
		sortBy: "pickupDate",
		sortDirection: "asc",
	},
	{
		id: "totalAmount_desc",
		label: "Highest value",
		description: "Largest total amounts first",
		sortBy: "totalAmount",
		sortDirection: "desc",
	},
	{
		id: "totalAmount_asc",
		label: "Lowest value",
		description: "Smallest total amounts first",
		sortBy: "totalAmount",
		sortDirection: "asc",
	},
	{
		id: "status_asc",
		label: "Status (A-Z)",
		description: "Group bookings by status",
		sortBy: "status",
		sortDirection: "asc",
	},
		{
			id: "status_desc",
			label: "Status (Z-A)",
			description: "Reverse alphabetical status order",
			sortBy: "status",
			sortDirection: "desc",
		},
]

export default function CarOwnerBookingsPage() {
	const accountId = useSelector((state: RootState) => state.user?.id)

	const [searchTerm, setSearchTerm] = useState("")
	const [carName, setCarName] = useState("")
		const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => [...CAR_OWNER_DEFAULT_STATUS_FILTER])
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
	const [sortBy, setSortBy] = useState<BookingSortKey>("pickupDate")
	const [sortDirection, setSortDirection] = useState<BookingSortDirection>("desc")
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [detailOpen, setDetailOpen] = useState(false)
	const [selectedBookingNumber, setSelectedBookingNumber] = useState<string | null>(null)
		const [confirmDepositTarget, setConfirmDepositTarget] = useState<BookingActionTarget | null>(null)
		const [cancelTarget, setCancelTarget] = useState<BookingActionTarget | null>(null)
		const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
		const [cancelAcknowledged, setCancelAcknowledged] = useState(false)

	const debouncedSearch = useDebounce(searchTerm.trim(), 400)
	const debouncedCarName = useDebounce(carName.trim(), 400)

	const queryArgs = useMemo<CarOwnerBookingQueryParams | null>(() => {
		if (!accountId) return null
		return {
			accountId,
			page,
			pageSize,
			sortBy,
			sortDirection,
			search: debouncedSearch || undefined,
			carName: debouncedCarName || undefined,
			statuses: selectedStatuses,
			fromDate: dateRange?.from ? startOfDay(dateRange.from).toISOString() : undefined,
			toDate: dateRange?.to ? endOfDay(dateRange.to).toISOString() : undefined,
		}
	}, [accountId, page, pageSize, sortBy, sortDirection, debouncedSearch, debouncedCarName, selectedStatuses, dateRange?.from, dateRange?.to])

	const {
		data,
		isLoading,
		isFetching,
		isError,
		refetch,
	} = useGetCarOwnerBookingsQuery(queryArgs as CarOwnerBookingQueryParams, {
		skip: !queryArgs,
	})

		const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation()
		const [confirmDeposit, { isLoading: isConfirmingDeposit }] = useConfirmDepositMutation()

		const bookings: CarOwnerBookingVO[] = data?.data?.data ?? []
	const pagination = data?.data?.PaginationMetadata

	const bookingsWithPriority = useMemo(() => {
		if (!bookings.length) return bookings
		const prioritySet = new Set(CAR_OWNER_STATUS_PRIORITY)
		const priority: CarOwnerBookingVO[] = []
		const others: CarOwnerBookingVO[] = []

			bookings.forEach((booking: CarOwnerBookingVO) => {
			const normalizedStatus = booking.status?.toLowerCase?.() ?? ""
			if (prioritySet.has(normalizedStatus)) {
				priority.push(booking)
			} else {
				others.push(booking)
			}
		})

		return [...priority, ...others]
	}, [bookings])

			const isProcessingAction = isCancelling || isConfirmingDeposit

	const activeSortId = `${sortBy}_${sortDirection}`

	const handleSelectBooking = useCallback((booking: CarOwnerBookingVO) => {
		setSelectedBookingNumber(booking.bookingNumber)
		setDetailOpen(true)
	}, [])

	const handleStatusesChange = useCallback((values: string[]) => {
		const unique = Array.from(new Set(values))
		setSelectedStatuses(unique)
		setPage(1)
	}, [])

	const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
		setDateRange(range)
		setPage(1)
	}, [])

	const handleSortSelect = useCallback((optionId: string) => {
		const option = SORT_OPTIONS.find((item) => item.id === optionId)
		if (!option) return
		setSortBy(option.sortBy)
		setSortDirection(option.sortDirection)
		setPage(1)
	}, [])

	const handleTableSortChange = useCallback((key: BookingSortKey) => {
		setPage(1)
		if (sortBy === key) {
			setSortDirection((prev: BookingSortDirection) => (prev === "asc" ? "desc" : "asc"))
			return
		}
		setSortBy(key)
		setSortDirection(key === "status" ? "asc" : "desc")
	}, [sortBy])

	const handlePageChange = useCallback((nextPage: number) => {
		setPage(nextPage)
		window.scrollTo({ top: 0, behavior: "smooth" })
	}, [])

	const handlePageSizeChange = useCallback((size: number) => {
		setPageSize(size)
		setPage(1)
	}, [])

	const handleResetFilters = useCallback(() => {
		setSearchTerm("")
		setCarName("")
		setSelectedStatuses([...CAR_OWNER_DEFAULT_STATUS_FILTER])
		setDateRange(undefined)
		setSortBy("pickupDate")
		setSortDirection("desc")
		setPage(1)
		setPageSize(10)
	}, [])

	const handleConfirmDepositRequest = useCallback((booking: BookingActionTarget) => {
		setConfirmDepositTarget(booking)
	}, [])

	const executeConfirmDeposit = useCallback(() => {
		if (!confirmDepositTarget) return
		const { bookingNumber, carName } = confirmDepositTarget
		const action = confirmDeposit({ bookingNumber }).unwrap()
		toast.promise(action, {
			loading: "Confirming deposit...",
			success: () => {
				setConfirmDepositTarget(null)
				return `Deposit confirmed for ${carName ?? bookingNumber}`
			},
			error: "Unable to confirm deposit. Please try again.",
		})
	}, [confirmDeposit, confirmDepositTarget])

	const handleCancelBookingRequest = useCallback((booking: BookingActionTarget) => {
		setCancelTarget(booking)
		setCancelAcknowledged(false)
		setCancelDialogOpen(true)
	}, [])

	const executeCancelBooking = useCallback(() => {
		if (!cancelTarget) return
		const current = cancelTarget
		const identifier = current.bookingId ?? current.bookingNumber
		if (!identifier) {
			toast.error("Missing booking identifier. Please contact support.")
			return
		}
		const action = cancelBooking({ bookingId: identifier }).unwrap()
		toast.promise(action, {
			loading: "Cancelling booking...",
			success: () => {
				setCancelDialogOpen(false)
				setCancelTarget(null)
				return `Booking ${current.bookingNumber} cancelled`
			},
			error: "Unable to cancel booking.",
		})
	}, [cancelBooking, cancelTarget])

	if (!accountId) {
		return (
			<main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
				<Alert variant="destructive">
					<AlertTitle>Account required</AlertTitle>
					<AlertDescription>
						Please sign in as a car owner to manage bookings. Once authenticated, your bookings will appear here.
					</AlertDescription>
				</Alert>
			</main>
		)
	}

	return (
		<main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
			<BookingFilters
				searchValue={searchTerm}
				onSearchChange={(value: string) => {
					setSearchTerm(value)
					setPage(1)
				}}
				carNameValue={carName}
				onCarNameChange={(value: string) => {
					setCarName(value)
					setPage(1)
				}}
				selectedStatuses={selectedStatuses}
				onStatusesChange={handleStatusesChange}
				dateRange={dateRange}
				onDateRangeChange={handleDateRangeChange}
				sortOptions={SORT_OPTIONS}
				activeSortId={activeSortId}
				onSortSelect={handleSortSelect}
				onResetFilters={handleResetFilters}
				pageSize={pageSize}
				onPageSizeChange={handlePageSizeChange}
				isFetching={isFetching}
				onRefresh={refetch}
			/>

			{isError && (
				<Alert variant="destructive">
					<AlertTitle>Unable to load bookings</AlertTitle>
					<AlertDescription>
						Please refresh the page or adjust the filters. If the issue persists, try again later.
					</AlertDescription>
					<div className="mt-4">
						<Button variant="outline" size="sm" onClick={() => refetch()}>
							Retry now
						</Button>
					</div>
				</Alert>
			)}

			<BookingTable
				bookings={bookingsWithPriority}
				isLoading={isLoading}
				isFetching={isFetching}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onSortChange={handleTableSortChange}
				onSelectBooking={handleSelectBooking}
				onConfirmDeposit={handleConfirmDepositRequest}
				onCancelBooking={handleCancelBookingRequest}
				pagination={pagination}
				onPageChange={handlePageChange}
				disableActions={isProcessingAction}
			/>

			<BookingDetailModal
				bookingNumber={selectedBookingNumber}
				open={detailOpen}
				onOpenChange={(open: boolean) => {
					setDetailOpen(open)
					if (!open) {
						setSelectedBookingNumber(null)
					}
				}}
				onConfirmDeposit={handleConfirmDepositRequest}
				onCancelBooking={handleCancelBookingRequest}
				disableActions={isProcessingAction}
			/>

			<Dialog
				open={Boolean(confirmDepositTarget)}
				onOpenChange={(open: boolean) => {
					if (!open) {
						setConfirmDepositTarget(null)
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-lg">
							<WalletCards className="h-5 w-5 text-emerald-500" />
							Confirm deposit
						</DialogTitle>
						<DialogDescription>
							Verify the renter&rsquo;s deposit has been received before confirming this action.
						</DialogDescription>
					</DialogHeader>
					{confirmDepositTarget && (
						<div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
							<div className="flex flex-col">
								<span className="text-xs font-medium uppercase tracking-wide text-slate-500">Booking</span>
								<span className="font-semibold text-slate-900">#{confirmDepositTarget.bookingNumber}</span>
							</div>
							<div className="flex justify-between gap-3">
								<span>Vehicle</span>
								<span className="font-medium">{confirmDepositTarget.carName ?? "N/A"}</span>
							</div>
							<div className="flex justify-between gap-3">
								<span>Deposit amount</span>
								<span className="font-semibold text-emerald-600">
									{typeof confirmDepositTarget.deposit === "number"
										? formatCurrency(confirmDepositTarget.deposit)
										: "—"}
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span>Payment type</span>
								<span className="font-medium capitalize">
									{confirmDepositTarget.paymentType ?? "Not specified"}
								</span>
							</div>
						</div>
					)}
					<DialogFooter className="gap-2">
						<Button variant="outline" onClick={() => setConfirmDepositTarget(null)} disabled={isConfirmingDeposit}>
							Cancel
						</Button>
						<Button onClick={executeConfirmDeposit} disabled={isConfirmingDeposit} className="gap-2">
							{isConfirmingDeposit && <Loader2 className="h-4 w-4 animate-spin" />}
							Confirm deposit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={cancelDialogOpen}
				onOpenChange={(open: boolean) => {
					setCancelDialogOpen(open)
					if (!open) {
						setCancelTarget(null)
						setCancelAcknowledged(false)
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-lg text-red-600">
							<AlertTriangle className="h-5 w-5" />
							Cancel booking
						</DialogTitle>
						<DialogDescription>
							Cancelling will notify the renter and release any reserved dates. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					{cancelTarget && (
						<div className="space-y-3 rounded-lg border border-red-100 bg-red-50/60 p-4 text-sm text-red-700">
							<div className="flex flex-col">
								<span className="text-xs font-medium uppercase tracking-wide text-red-500/80">Booking</span>
								<span className="font-semibold text-red-700">#{cancelTarget.bookingNumber}</span>
							</div>
							<div className="flex justify-between gap-3">
								<span>Vehicle</span>
								<span className="font-medium text-red-700">{cancelTarget.carName ?? "N/A"}</span>
							</div>
						</div>
					)}
					<div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
										<Checkbox
											id="cancel-confirmation"
											checked={cancelAcknowledged}
											onCheckedChange={(checked: CheckedState) => setCancelAcknowledged(Boolean(checked))}
										/>
						<label htmlFor="cancel-confirmation" className="select-none">
							I understand this booking will be permanently cancelled and the renter will be notified immediately.
						</label>
					</div>
					<DialogFooter className="gap-2">
						<Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={isCancelling}>
							Keep booking
						</Button>
						<Button
							onClick={executeCancelBooking}
							disabled={!cancelAcknowledged || isCancelling}
							variant="destructive"
							className="gap-2"
						>
							{isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
							Cancel booking
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	)
}
