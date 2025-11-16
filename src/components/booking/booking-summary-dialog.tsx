"use client"

import { useMemo } from "react"
import Image from "next/image"
import { AlertCircle, PartyPopper } from "lucide-react"

import { BookingStatusBadge } from "@/components/car-owner/booking/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingSummaryVO } from "@/lib/services/booking-api"
import { cn } from "@/lib/utils"
import { formatDateTimeVi, formatVnd } from "@/lib/utils/format"
import { useBookingSummaryDialog } from "@/hooks/use-booking-summary-dialog"

interface BookingSummaryDialogProps {
  bookingNumber: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingSummaryDialog({ bookingNumber, open, onOpenChange }: BookingSummaryDialogProps) {
  const { status, summary, isLoading, isAborted, error, refetch } = useBookingSummaryDialog(bookingNumber, open)

  const shouldShowSkeleton = status === "idle" || status === "loading"
  const shouldShowError = status === "error" || status === "aborted"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking summary</DialogTitle>
          <DialogDescription>
            Review the final charges, settlement, and timeline once a booking has wrapped up.
          </DialogDescription>
        </DialogHeader>

        {shouldShowSkeleton && <BookingSummarySkeleton />}

        {shouldShowError && (
          <SummaryError
            isAborted={status === "aborted"}
            onRetry={() => {
              if (!bookingNumber) return
              refetch()
            }}
            description={
              status === "aborted"
                ? "The summary request was cancelled. Try again if you still need the details."
                : error && typeof error === "object" && "message" in error && typeof error.message === "string"
                  ? error.message
                  : "We could not load the booking summary. Please try again."
            }
          />
        )}

        {status === "success" && summary && (
          <BookingSummaryContent summary={summary} />
        )}

        {status === "idle" && !isLoading && !summary && !shouldShowError && (
          <SummaryError
            description="Summary data is not available for this booking yet."
            hideRetry
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface BookingSummaryContentProps {
  summary: BookingSummaryVO
}

export function BookingSummaryContent({ summary }: BookingSummaryContentProps) {
  const isCompleted = summary.status?.toString().toLowerCase() === "completed"
  const isPendingPayment = summary.status?.toString().toLowerCase() === "pending_payment"

  const pickupTime = formatDateTimeVi(summary.pickUpTime)
  const dropoffTime = formatDateTimeVi(summary.dropOffTime)
  const actualReturnTime = formatDateTimeVi(summary.actualReturnTime)

  const timeline = useMemo(() => {
    return [...(summary.timeline ?? [])]
      .filter(Boolean)
      .sort((a, b) => {
        const aTime = new Date(a?.changedAt ?? 0).getTime()
        const bTime = new Date(b?.changedAt ?? 0).getTime()
        return aTime - bTime
      })
  }, [summary.timeline])

  const hasTimeline = timeline.length > 0

  const basePricePerDay = summary.basePricePerDayCents ?? 0
  const totalDays = summary.totalDays ?? 0
  const basePriceTotal = summary.basePriceCents ?? 0

  const remainingCharge = summary.remainingChargedCents ?? 0
  const refundToRenter = summary.refundToRenterCents ?? 0

  return (
    <div className="space-y-6">
      {isCompleted && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <PartyPopper className="mt-0.5 h-6 w-6 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Congratulations! Booking #{summary.bookingNumber} is officially completed.
            </p>
            <p className="text-sm text-emerald-600">
              We have summarized the trip details, charges, and settlement for your records.
            </p>
          </div>
        </div>
      )}

      <section aria-labelledby="booking-summary-header" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Booking number</p>
            <p className="text-2xl font-semibold">#{summary.bookingNumber}</p>
          </div>
          <BookingStatusBadge status={summary.status?.toString() ?? ""} />
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {pickupTime && (
            <InformationItem label="Pick-up time" value={pickupTime} />
          )}
          {dropoffTime && (
            <InformationItem label="Drop-off time" value={dropoffTime} />
          )}
          {actualReturnTime && (
            <InformationItem label="Actual return" value={actualReturnTime} />
          )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pricing breakdown</CardTitle>
            <CardDescription>
              Final charges calculated for the trip based on duration and additional adjustments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {basePricePerDay > 0 && totalDays > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">Base price</span>
                <span className="text-muted-foreground">
                  {formatVnd(basePricePerDay)} × {totalDays} day{totalDays > 1 ? "s" : ""}
                  <span className="ml-2 font-semibold text-foreground">= {formatVnd(basePriceTotal)}</span>
                </span>
              </div>
            )}

            <MoneyRow label="Extra distance fee" value={summary.extraKmFeeCents} />
            <MoneyRow label="Extra charges" value={summary.extraChargesCents} />
            <MoneyRow label="Deposit snapshot" value={summary.depositSnapshotCents} />
            <MoneyRow label="Discount" value={summary.discountCents} variant="negative" />

            <Separator className="my-4" />
            <MoneyRow label="Total" value={summary.totalCalculatedCents} variant="emphasis" forceShow />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settlement</CardTitle>
            <CardDescription>
              Outstanding balances and refunds calculated after deposit and fees are applied.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <MoneyRow
              label="Remaining balance due"
              value={remainingCharge}
              variant={remainingCharge > 0 ? (isPendingPayment ? "warning" : "default") : "default"}
              forceShow={remainingCharge > 0}
            />
            <MoneyRow
              label="Refund to renter"
              value={refundToRenter}
              variant={refundToRenter > 0 ? "success" : "default"}
              forceShow={refundToRenter > 0}
            />

            {remainingCharge <= 0 && refundToRenter <= 0 && (
              <p className="text-muted-foreground">
                No additional settlement is required for this booking.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue split</CardTitle>
          <CardDescription>
            Breakdown of how the trip revenue is allocated between owner and platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">From deposit</p>
            <MoneyRow label="Owner share" value={summary.ownerShareFromDepositCents} />
            <MoneyRow label="Admin share" value={summary.adminShareFromDepositCents} />
            {(!summary.ownerShareFromDepositCents || summary.ownerShareFromDepositCents === 0) &&
              (!summary.adminShareFromDepositCents || summary.adminShareFromDepositCents === 0) && (
                <p className="text-muted-foreground">No revenue was distributed from the deposit.</p>
              )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">From remaining balance</p>
            <MoneyRow label="Owner share" value={summary.ownerShareFromRemainingCents} />
            <MoneyRow label="Admin share" value={summary.adminShareFromRemainingCents} />
            {(!summary.ownerShareFromRemainingCents || summary.ownerShareFromRemainingCents === 0) &&
              (!summary.adminShareFromRemainingCents || summary.adminShareFromRemainingCents === 0) && (
                <p className="text-muted-foreground">No revenue was distributed from the remaining balance.</p>
              )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>
            Status updates and notes recorded over the lifetime of this booking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasTimeline ? (
            <ol className="space-y-3" aria-label="Booking progress timeline">
              {timeline.map((entry, index) => {
                const changedAt = formatDateTimeVi(entry.changedAt) ?? "Unknown time"
                const note = entry.note?.trim()
                const pictureUrl = entry.pictureUrl?.trim()
                const newStatus = entry.newStatus?.toString() ?? ""

                return (
                  <li
                    key={`${entry.changedAt}-${entry.newStatus}-${index}`}
                    className="rounded-lg border border-border bg-card px-4 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <BookingStatusBadge status={newStatus} />
                      <span className="text-xs text-muted-foreground">{changedAt}</span>
                    </div>
                    {note && <p className="mt-2 text-sm text-foreground">{note}</p>}
                    {pictureUrl && (
                      <a
                        className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4"
                        href={pictureUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View evidence for status ${newStatus}`}
                      >
                        <Image
                          src={pictureUrl}
                          alt={`Evidence for status ${newStatus}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                        View attachment
                      </a>
                    )}
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">No timeline entries are available for this booking yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface MoneyRowProps {
  label: string
  value?: number | null
  variant?: "default" | "warning" | "success" | "negative" | "emphasis"
  forceShow?: boolean
}

function MoneyRow({ label, value, variant = "default", forceShow = false }: MoneyRowProps) {
  const shouldRender = forceShow || (typeof value === "number" && value !== 0)

  if (!shouldRender) {
    return null
  }

  const safeValue = typeof value === "number" ? Math.abs(value) : 0
  const displayValue = variant === "negative" ? `- ${formatVnd(safeValue)}` : formatVnd(safeValue)

  const highlightClass =
    variant === "warning"
      ? "border border-amber-200 bg-amber-50 text-amber-900"
      : variant === "success"
        ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
        : variant === "emphasis"
          ? "font-semibold"
          : undefined

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5",
        highlightClass,
        variant === "default" || variant === "negative" ? "px-0 py-0" : undefined,
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{displayValue}</span>
    </div>
  )
}

interface InformationItemProps {
  label: string
  value: string
}

function InformationItem({ label, value }: InformationItemProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

interface SummaryErrorProps {
  description: string
  onRetry?: () => void
  hideRetry?: boolean
  isAborted?: boolean
}

function SummaryError({ description, onRetry, hideRetry, isAborted }: SummaryErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
        <p className="font-semibold">
          {isAborted ? "Summary request cancelled" : "Unable to load summary"}
        </p>
      </div>
      <p className="text-muted-foreground">{description}</p>
      {!hideRetry && onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-destructive/50">
          Try again
        </Button>
      )}
    </div>
  )
}

function BookingSummarySkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((index) => (
          <Card key={`summary-skeleton-${index}`}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-2 h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[70%]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[75%]" />
          <Skeleton className="h-4 w-[60%]" />
        </CardContent>
      </Card>
    </div>
  )
}
