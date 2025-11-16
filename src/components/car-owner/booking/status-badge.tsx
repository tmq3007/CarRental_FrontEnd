import { Badge } from "@/components/ui/badge"
import { BOOKING_STATUS_OPTIONS, resolveBookingStatusBadge } from "@/lib/constants/booking-status"
import { cn } from "@/lib/utils"

export const CAR_OWNER_STATUS_PRIORITY = [
  "waiting_confirmed",
  "waiting_confirm_return",
  "confirmed",
  "in_progress",
  "pending_payment",
  "pending_deposit",
  "rejected_return",
]

export const CAR_OWNER_DEFAULT_STATUS_FILTER = [...CAR_OWNER_STATUS_PRIORITY]

export const STATUS_OPTIONS: { value: string; label: string }[] = [...BOOKING_STATUS_OPTIONS]

interface BookingStatusBadgeProps {
  status: string
  className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = resolveBookingStatusBadge(status)

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  )
}
