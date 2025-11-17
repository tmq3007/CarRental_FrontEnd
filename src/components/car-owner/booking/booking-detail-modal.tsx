'use client'

import { useEffect, useMemo, useRef } from 'react'
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
import { Calendar, Car, CreditCard, Loader2, MapPin, RefreshCw, User } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'
import { useGetBookingDetailQuery } from '@/lib/services/booking-api'
import type { BookingDetailVO, BookingStatusHistoryEntry } from '@/lib/services/booking-api'
import { BookingStatusTimeline } from '@/components/booking/booking-status-timeline'
import { BookingStatusProgress } from '@/components/booking/booking-status-progress'
import { BookingActionPanel, type ActionKey, type BookingActionCompletedPayload } from '@/components/booking/booking-action-panel'

interface BookingDetailModalProps {
  bookingNumber?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Legacy callbacks preserved for backwards compatibility with flow hooks.
   * They are no longer used as actions are handled internally.
   */
  onConfirmDeposit?: unknown
  onCancelBooking?: unknown
  disableActions?: boolean
  initialActionKey?: ActionKey | null
  onInitialActionHandled?: () => void
  onActionCompleted?: (actionKey: ActionKey, payload: BookingActionCompletedPayload) => Promise<void> | void
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

function selectHistory(booking?: BookingDetailVO | null): BookingStatusHistoryEntry[] {
  if (!booking) return []
  const candidates = [
    booking.statusHistory,
    booking.historyEntries,
    (booking as unknown as { history?: BookingStatusHistoryEntry[] }).history,
    (booking as unknown as { timeline?: BookingStatusHistoryEntry[] }).timeline,
    (booking as unknown as { statusHistories?: BookingStatusHistoryEntry[] }).statusHistories,
  ]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }
  return []
}

export function BookingDetailModal({
  bookingNumber,
  open,
  onOpenChange,
  disableActions,
  initialActionKey,
  onInitialActionHandled,
  onActionCompleted,
}: BookingDetailModalProps) {
  const shouldFetch = Boolean(open && bookingNumber)
  const { data, isLoading, isError, refetch, isFetching } = useGetBookingDetailQuery(bookingNumber ?? '', {
    skip: !shouldFetch,
  })

  const booking = data?.data
  const history = useMemo(() => selectHistory(booking), [booking])
  const timelineEndRef = useRef<HTMLDivElement | null>(null)
  const previousHistoryLength = useRef<number>(0)

  useEffect(() => {
    const length = history.length
    if (!length) {
      previousHistoryLength.current = 0
      return
    }
    const shouldAnimate = previousHistoryLength.current > 0 && length > previousHistoryLength.current
    const element = timelineEndRef.current
    if (element) {
      element.scrollIntoView({ behavior: shouldAnimate ? 'smooth' : 'auto', block: 'end' })
    }
    previousHistoryLength.current = length
  }, [history])

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
          <div className="flex min-h-[280px] items-center justify-center px-6 py-12 text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-500" />
            Loading booking details...
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
            <div className="space-y-6 px-6 py-6">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Booking number</div>
                    <div className="text-lg font-semibold text-slate-900">#{booking.bookingNumber}</div>
                    <div className="text-sm text-slate-500">Pick-up {formatDateTime(booking.pickUpTime)}</div>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <BookingStatusBadge status={booking.status} />
                    <div className="w-full rounded-xl border border-slate-200 bg-white p-3 lg:w-[320px]">
                      <BookingStatusProgress status={booking.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <BookingActionPanel
                    booking={booking}
                    role="car_owner"
                    onActionCompleted={async (actionKey, payload) => {
                      await refetch()
                      if (onActionCompleted) {
                        await onActionCompleted(actionKey, payload)
                      }
                    }}
                    isRefreshing={isFetching}
                    disabled={disableActions}
                    initialActionKey={initialActionKey}
                    onInitialActionHandled={onInitialActionHandled}
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoRow label="Car" value={booking.carName} />
                  <InfoRow label="License plate" value={booking.licensePlate} />
                  <InfoRow label="Pickup" value={formatDateTime(booking.pickUpTime)} />
                  <InfoRow label="Return" value={formatDateTime(booking.dropOffTime)} />
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="space-y-6">
                  <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                          <User className="h-4 w-4 text-emerald-500" /> Renter
                        </div>
                        <div className="grid gap-3 text-sm text-slate-700">
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

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                          <User className="h-4 w-4 text-emerald-500" /> Driver
                        </div>
                        {booking.isRenterSameAsDriver ? (
                          <p className="text-sm text-slate-500">Renter and driver are the same person.</p>
                        ) : (
                          <div className="grid gap-3 text-sm text-slate-700">
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
                    </div>
                  </section>

                  <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                        <Car className="h-4 w-4 text-emerald-500" /> Vehicle
                      </div>
                      <div className="grid gap-3 text-sm text-slate-700">
                        <InfoRow label="Brand" value={booking.brand} />
                        <InfoRow label="Model" value={booking.model} />
                        <InfoRow label="Color" value={booking.color} />
                        <InfoRow label="Year" value={booking.productionYear} />
                        <InfoRow label="Seats" value={booking.numberOfSeats} />
                        <InfoRow label="Transmission" value={booking.isAutomatic ? 'Automatic' : 'Manual'} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                        <CreditCard className="h-4 w-4 text-emerald-500" /> Payment
                      </div>
                      <div className="grid gap-3 text-sm text-slate-700">
                        <InfoRow label="Base price" value={formatCurrency(booking.basePrice ?? 0)} />
                        <InfoRow label="Deposit" value={formatCurrency(booking.deposit ?? 0)} />
                        <InfoRow label="Payment type" value={booking.paymentType} />
                        <InfoRow
                          label="Deposit status"
                          value={booking.depositPaid ? 'Paid' : booking.depositStatus ?? 'Pending'}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                        <Calendar className="h-4 w-4 text-emerald-500" /> Locations
                      </div>
                      <div className="grid gap-3 text-sm text-slate-700">
                        <InfoRow label="Pick-up" value={booking.pickUpLocation} />
                        <InfoRow label="Drop-off" value={booking.dropOffLocation} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                        <MapPin className="h-4 w-4 text-emerald-500" /> Car address
                      </div>
                      <p className="text-sm text-slate-700">{booking.carAddress ?? '—'}</p>
                    </div>
                  </section>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-slate-900">Status history</h3>
                    <p className="text-sm text-slate-500">Chronological log of booking status changes.</p>
                  </div>
                  <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
                    <BookingStatusTimeline history={history} />
                    <div ref={timelineEndRef} />
                  </div>
                </section>
              </div>
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
