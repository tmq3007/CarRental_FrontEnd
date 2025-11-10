'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookingStatusBadge } from '@/components/car-owner/booking/status-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Car,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  User,
  WalletCards,
  XCircle,
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'
import { useGetBookingDetailQuery } from '@/lib/services/booking-api'
import type { BookingActionTarget } from '@/components/car-owner/booking/types'

interface BookingDetailModalProps {
  bookingNumber?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDeposit?: (booking: BookingActionTarget) => void
  onCancelBooking?: (booking: BookingActionTarget) => void
  disableActions?: boolean
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800">{value ?? '—'}</span>
    </div>
  )
}

function composeAddress(...parts: Array<string | undefined>) {
  const filtered = parts.filter((part) => part && part.trim().length > 0) as string[]
  return filtered.length > 0 ? filtered.join(', ') : '—'
}

export function BookingDetailModal({
  bookingNumber,
  open,
  onOpenChange,
  onConfirmDeposit,
  onCancelBooking,
  disableActions,
}: BookingDetailModalProps) {
  const shouldFetch = Boolean(open && bookingNumber)
  const { data, isLoading, isError, refetch, isFetching } = useGetBookingDetailQuery(bookingNumber ?? '', {
    skip: !shouldFetch,
  })

  const booking = data?.data
  const normalizedStatus = booking?.status?.toLowerCase?.() ?? ''
  const allowDeposit = ['pending_payment', 'pending_deposit'].includes(normalizedStatus)
  const allowCancel = ['confirmed', 'pending_payment', 'pending_deposit'].includes(normalizedStatus)

  const actionTarget: BookingActionTarget | null = booking
    ? {
        bookingNumber: booking.bookingNumber,
        carName: booking.carName,
        status: booking.status,
        deposit: booking.deposit,
        basePrice: booking.basePrice,
        paymentType: booking.paymentType,
        pickupDate: booking.pickUpTime,
        returnDate: booking.dropOffTime,
      }
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-4xl overflow-hidden p-0">
        <DialogHeader className="space-y-1 border-b border-slate-200 px-6 py-4 text-left">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-slate-900">
            <Car className="h-5 w-5 text-emerald-500" />
            Booking details
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Comprehensive overview of the booking, renter, and vehicle details.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col gap-4 px-6 py-8">
            <div className="h-6 w-40 animate-pulse rounded-md bg-emerald-100/60" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`booking-detail-skeleton-${index}`} className="h-20 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && isError && (
          <div className="space-y-4 px-6 py-8">
            <Alert variant="destructive">
              <AlertTitle>Unable to load booking details</AlertTitle>
              <AlertDescription>
                Please try again. If the problem persists, contact support with booking #{bookingNumber}.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && booking && (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-8 px-6 py-6">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Booking number</p>
                    <p className="text-lg font-semibold text-slate-900">#{booking.bookingNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={booking.status} />
                    <div className="text-sm text-slate-500">
                      Pick-up {formatDateTime(booking.pickUpTime, undefined, booking.pickUpTime ?? '—')}
                    </div>
                  </div>
                </div>
                {(onConfirmDeposit || onCancelBooking) && actionTarget && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {allowDeposit && onConfirmDeposit && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => onConfirmDeposit(actionTarget)}
                        disabled={disableActions}
                      >
                        <WalletCards className="mr-1 h-4 w-4" /> Confirm deposit
                      </Button>
                    )}
                    {allowCancel && onCancelBooking && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onCancelBooking(actionTarget)}
                        disabled={disableActions}
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Cancel booking
                      </Button>
                    )}
                  </div>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoRow label="Car" value={booking.carName} />
                  <InfoRow label="License plate" value={booking.licensePlate} />
                  <InfoRow label="Pickup" value={formatDateTime(booking.pickUpTime, undefined, booking.pickUpTime ?? '—')} />
                  <InfoRow label="Return" value={formatDateTime(booking.dropOffTime, undefined, booking.dropOffTime ?? '—')} />
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Renter</h3>
                  </div>
                  <div className="grid gap-4">
                    <InfoRow label="Full name" value={booking.renterFullName} />
                    <InfoRow label="Email" value={booking.renterEmail} />
                    <InfoRow label="Phone" value={booking.renterPhoneNumber} />
                    <InfoRow label="National ID" value={booking.renterNationalId} />
                    <InfoRow
                      label="Address"
                      value={composeAddress(
                        booking.renterHouseNumberStreet,
                        booking.renterWard,
                        booking.renterDistrict,
                        booking.renterCityProvince,
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Driver</h3>
                  </div>
                  {booking.isRenterSameAsDriver ? (
                    <p className="text-sm text-slate-500">Renter and driver are the same person.</p>
                  ) : (
                    <div className="grid gap-4">
                      <InfoRow label="Full name" value={booking.driverFullName} />
                      <InfoRow label="Email" value={booking.driverEmail} />
                      <InfoRow label="Phone" value={booking.driverPhoneNumber} />
                      <InfoRow label="National ID" value={booking.driverNationalId} />
                      <InfoRow
                        label="Address"
                        value={composeAddress(
                          booking.driverHouseNumberStreet,
                          booking.driverWard,
                          booking.driverDistrict,
                          booking.driverCityProvince,
                        )}
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Car className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Vehicle</h3>
                  </div>
                  <div className="grid gap-4">
                    <InfoRow label="Brand" value={booking.brand} />
                    <InfoRow label="Model" value={booking.model} />
                    <InfoRow label="Color" value={booking.color} />
                    <InfoRow label="Year" value={booking.productionYear} />
                    <InfoRow label="Seats" value={booking.numberOfSeats} />
                    <InfoRow label="Transmission" value={booking.isAutomatic ? 'Automatic' : 'Manual'} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Payment</h3>
                  </div>
                  <div className="grid gap-4">
                    <InfoRow label="Base price" value={formatCurrency(booking.basePrice ?? 0)} />
                    <InfoRow label="Deposit" value={formatCurrency(booking.deposit ?? 0)} />
                    <InfoRow label="Payment type" value={booking.paymentType} />
                  </div>
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Locations</h3>
                  </div>
                  <div className="grid gap-4">
                    <InfoRow label="Pick-up" value={booking.pickUpLocation} />
                    <InfoRow label="Drop-off" value={booking.dropOffLocation} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Car address</h3>
                  </div>
                  <p className="text-sm text-slate-700">{booking.carAddress ?? '—'}</p>
                </div>
              </section>
            </div>
          </ScrollArea>
        )}

        {isFetching && !isLoading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
