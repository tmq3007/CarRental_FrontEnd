"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { DateRange } from "react-day-picker"
import { endOfDay, startOfDay } from "date-fns"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { RootState } from "@/lib/store"
import useDebounce from "@/lib/hook/use-debounce"
import {
	type CarOwnerBookingQueryParams,
	type CarOwnerBookingVO,
	useGetCarOwnerBookingsQuery,
	useGetBookingDetailQuery,
} from "@/lib/services/booking-api"
import { BookingActionPanel, type ActionKey } from "@/components/booking/booking-action-panel"
import { toast } from "sonner"

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
	const [pendingActionKey, setPendingActionKey] = useState<ActionKey | null>(null)
	const [actionRunnerContext, setActionRunnerContext] = useState<{
		bookingNumber: string
		actionKey: ActionKey
		requestId: number
	} | null>(null)

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

	const handleRequestAction = useCallback(
		(booking: CarOwnerBookingVO, action: ActionKey) => {
			setSelectedBookingNumber(booking.bookingNumber)
			setActionRunnerContext({
				bookingNumber: booking.bookingNumber,
				actionKey: action,
				requestId: Date.now(),
			})
		},
		[]
	)

	const handleActionCompleted = useCallback(
		async (_actionKey: ActionKey) => {
			await refetch()
		},
		[refetch]
	)

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
		<main className="mx-auto flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
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
				onRequestAction={handleRequestAction}
				pagination={pagination}
				onPageChange={handlePageChange}
				disableActions={false}
			/>

			{actionRunnerContext && (
				<OwnerActionRunner
					key={actionRunnerContext.requestId}
					context={actionRunnerContext}
					onClose={() => setActionRunnerContext(null)}
					onActionCompleted={handleActionCompleted}
				/>
			)}

			<BookingDetailModal
				bookingNumber={selectedBookingNumber}
				open={detailOpen}
				onOpenChange={(open: boolean) => {
					setDetailOpen(open)
					if (!open) {
						setSelectedBookingNumber(null)
						setPendingActionKey(null)
					}
				}}
				disableActions={false}
				initialActionKey={pendingActionKey}
				onInitialActionHandled={() => setPendingActionKey(null)}
			/>
		</main>
	)
}

interface OwnerActionRunnerProps {
	context: {
		bookingNumber: string
		actionKey: ActionKey
	}
	onClose: () => void
	onActionCompleted: (actionKey: ActionKey) => Promise<void> | void
}

function OwnerActionRunner({ context, onClose, onActionCompleted }: OwnerActionRunnerProps) {
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
					role="car_owner"
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
