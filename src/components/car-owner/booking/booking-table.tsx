'use client'

import { memo, useMemo } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarRange,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  User,
  WalletCards,
  XCircle,
} from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BookingStatusBadge } from '@/components/car-owner/booking/status-badge'
import type { BookingActionTarget } from '@/components/car-owner/booking/types'
import { formatCurrency, formatDate, formatDateTime, formatDurationInDays } from '@/lib/utils/format'
import type { CarOwnerBookingQueryParams, CarOwnerBookingVO } from '@/lib/services/booking-api'
import type { PaginationMetadata } from '@/lib/store'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type BookingSortKey = NonNullable<CarOwnerBookingQueryParams['sortBy']>
type BookingSortDirection = NonNullable<CarOwnerBookingQueryParams['sortDirection']>

interface BookingTableProps {
  bookings: CarOwnerBookingVO[]
  isLoading: boolean
  isFetching?: boolean
  sortBy: BookingSortKey
  sortDirection: BookingSortDirection
  onSortChange: (sortKey: BookingSortKey) => void
  onSelectBooking: (booking: CarOwnerBookingVO) => void
  onConfirmDeposit: (booking: BookingActionTarget) => void
  onCancelBooking: (booking: BookingActionTarget) => void
  pagination?: PaginationMetadata
  onPageChange: (page: number) => void
  disableActions?: boolean
}

const SkeletonRow = () => (
  <TableRow>
    <TableCell colSpan={7}>
      <div className="flex flex-col gap-3 py-4">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </TableCell>
  </TableRow>
)

function renderSortIndicator(active: boolean, direction: BookingSortDirection) {
  if (!active) {
    return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-400" />
  }
  return direction === 'asc' ? (
    <ArrowUp className="ml-1 h-3.5 w-3.5 text-emerald-500" />
  ) : (
    <ArrowDown className="ml-1 h-3.5 w-3.5 text-emerald-500" />
  )
}

const BookingTableComponent = ({
  bookings,
  isLoading,
  isFetching,
  sortBy,
  sortDirection,
  onSortChange,
  onSelectBooking,
  onConfirmDeposit,
  onCancelBooking,
  pagination,
  onPageChange,
  disableActions,
}: BookingTableProps) => {
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.pageNumber ?? 1

  const hasData = bookings.length > 0
  const isEmpty = !isLoading && !isFetching && !hasData

  const paginationItems = useMemo(() => {
    if (!pagination) return []
    const pages: number[] = []
    const total = Math.max(1, pagination.totalPages)
    const current = Math.min(Math.max(1, pagination.pageNumber), total)

    const delta = 1
    const range = [] as number[]
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i += 1) {
      range.push(i)
    }

    const includeLeftEllipsis = current - delta > 2
    const includeRightEllipsis = current + delta < total - 1

    if (total >= 1) pages.push(1)
    if (includeLeftEllipsis) pages.push(-1)
    pages.push(...range)
    if (includeRightEllipsis) pages.push(-2)
    if (total > 1) pages.push(total)

    return pages
  }, [pagination])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-[960px]">
          <TableHeader className="bg-slate-50/60">
            <TableRow>
              <TableHead className="w-[24%]">
                <button
                  type="button"
                  className="flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                  onClick={() => onSortChange('pickupDate')}
                >
                  Booking
                  {renderSortIndicator(sortBy === 'pickupDate', sortDirection)}
                </button>
              </TableHead>
              <TableHead className="w-[12%]">
                <button
                  type="button"
                  className="flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                  onClick={() => onSortChange('totalAmount')}
                >
                  Total
                  {renderSortIndicator(sortBy === 'totalAmount', sortDirection)}
                </button>
              </TableHead>
              <TableHead className="w-[16%]">
                <button
                  type="button"
                  className="flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                  onClick={() => onSortChange('status')}
                >
                  Status
                  {renderSortIndicator(sortBy === 'status', sortDirection)}
                </button>
              </TableHead>
              <TableHead className="w-[20%]">Renter</TableHead>
              <TableHead className="w-[12%]">Dates</TableHead>
              <TableHead className="w-[8%]">Payment</TableHead>
              <TableHead className="w-[16%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={`booking-skeleton-${index}`} />)}
            {!isLoading && hasData &&
              bookings.map((booking) => {
                const status = booking.status?.toLowerCase?.() ?? ''
                const totalAmount = booking.totalAmount ?? booking.basePrice ?? 0
                const bookingId = booking.bookingId ?? booking.bookingNumber
                const allowCancel = ['confirmed', 'pending_payment', 'pending_deposit'].includes(status)
                const allowDeposit = ['pending_payment', 'pending_deposit'].includes(status)
                const actionTarget: BookingActionTarget = {
                  bookingNumber: booking.bookingNumber ?? bookingId ?? '',
                  bookingId,
                  carName: booking.carName,
                  status: booking.status ?? status,
                  deposit: booking.deposit,
                  basePrice: booking.basePrice,
                  totalAmount,
                  pickupDate: booking.pickupDate,
                  returnDate: booking.returnDate,
                  paymentType: booking.paymentType,
                }

                return (
                  <TableRow
                    key={booking.bookingNumber}
                    className="cursor-pointer transition-colors hover:bg-emerald-50/40"
                    onClick={() => onSelectBooking(booking)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <span className="line-clamp-1">{booking.carName}</span>
                        </div>
                        <div className="text-xs text-slate-500">#{booking.bookingNumber}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <CalendarRange className="h-3.5 w-3.5" />
                          <span>
                            {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">{formatCurrency(totalAmount ?? 0)}</p>
                        <p className="text-xs text-slate-500">Deposit: {formatCurrency(booking.deposit ?? 0)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <BookingStatusBadge status={status} />
                        <p className="text-xs text-slate-500">
                          Updated {formatDateTime(booking.updatedAt ?? booking.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-2 font-medium text-slate-900">
                          <User className="h-4 w-4 text-emerald-500" />
                          <span className="line-clamp-1">{booking.renterFullName ?? 'Unknown renter'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="line-clamp-1">{booking.renterEmail ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{booking.renterPhoneNumber ?? '—'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-slate-700">
                        <p>{formatDurationInDays(booking.pickupDate, booking.returnDate)}</p>
                        <p className="text-xs text-slate-500">Created {formatDateTime(booking.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="capitalize">{booking.paymentType ?? '—'}</span>
                        </div>
                        <p className="text-xs text-slate-500">{booking.paymentStatus ?? 'Status unknown'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {allowDeposit && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={(event) => {
                              event.stopPropagation()
                              onConfirmDeposit(actionTarget)
                            }}
                            disabled={disableActions}
                          >
                            <WalletCards className="mr-1 h-3.5 w-3.5" /> Deposit
                          </Button>
                        )}
                        {allowCancel && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation()
                              onCancelBooking(actionTarget)
                            }}
                            disabled={disableActions}
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" /> Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            {isEmpty && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center gap-2 py-16 text-center">
                    <div className="rounded-full border border-dashed border-emerald-200 p-4">
                      <CalendarRange className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">No bookings found</p>
                    <p className="max-w-md text-sm text-slate-500">
                      Adjust the filters or date range to find bookings. New bookings will appear here as soon as they are made.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-slate-200 bg-slate-50/60 px-4 py-3">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage > 1) {
                      onPageChange(currentPage - 1)
                    }
                  }}
                  className="gap-1"
                />
              </PaginationItem>
              {paginationItems.map((page) => (
                <PaginationItem key={`page-${page}`}>
                  {page < 0 ? (
                    <span className="px-3 text-sm text-slate-400">…</span>
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (page !== currentPage) onPageChange(page)
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage < totalPages) {
                      onPageChange(currentPage + 1)
                    }
                  }}
                  className="gap-1"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        </div>
      )}
    </div>
  )
}

export const BookingTable = memo(BookingTableComponent)
