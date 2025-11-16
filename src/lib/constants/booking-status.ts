import type { BookingStatus } from "@/lib/services/booking-api"

type BookingStatusBadgeConfig = {
  label: string
  className: string
}

export const BOOKING_STATUS_BADGE_DEFAULT: BookingStatusBadgeConfig = {
  label: "Unknown",
  className: "border-slate-200 bg-slate-50 text-slate-700",
}

export const BOOKING_STATUS_BADGE_CONFIG: Record<BookingStatus, BookingStatusBadgeConfig> = {
  waiting_confirmed: {
    label: "Waiting Confirmation",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  pending_deposit: {
    label: "Pending Deposit",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  pending_payment: {
    label: "Pending Payment",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  in_progress: {
    label: "In Progress",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  waiting_confirm_return: {
    label: "Awaiting Return Approval",
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
  rejected_return: {
    label: "Return Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  completed: {
    label: "Completed",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-200 bg-red-50 text-red-700",
  },
}

export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  "waiting_confirmed",
  "pending_deposit",
  "pending_payment",
  "confirmed",
  "in_progress",
  "waiting_confirm_return",
  "rejected_return",
  "completed",
  "cancelled",
]

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = Object.fromEntries(
  Object.entries(BOOKING_STATUS_BADGE_CONFIG).map(([status, config]) => [status, config.label])
) as Record<BookingStatus, string>

export const BOOKING_STATUS_OPTIONS = BOOKING_STATUS_ORDER.map((status) => ({
  value: status,
  label: BOOKING_STATUS_LABEL[status],
}))

export const TERMINAL_STATUSES: BookingStatus[] = ["completed", "cancelled"]

function prettifyStatusLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

export function resolveBookingStatusBadge(status?: string | null): BookingStatusBadgeConfig {
  const normalized = (status ?? "").toLowerCase()
  const config = BOOKING_STATUS_BADGE_CONFIG[normalized as BookingStatus]
  if (config) {
    return config
  }

  if (!normalized) {
    return BOOKING_STATUS_BADGE_DEFAULT
  }

  return {
    label: prettifyStatusLabel(normalized),
    className: BOOKING_STATUS_BADGE_DEFAULT.className,
  }
}
