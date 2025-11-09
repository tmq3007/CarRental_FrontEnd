import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const CAR_OWNER_STATUS_PRIORITY = [
  "confirmed",
  "in_progress",
  "pending_payment",
  "pending_deposit",
]

export const CAR_OWNER_DEFAULT_STATUS_FILTER = [...CAR_OWNER_STATUS_PRIORITY]

export const CAR_OWNER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "pending_deposit", label: "Pending Deposit" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  in_progress: {
    label: "In Progress",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  pending_payment: {
    label: "Pending Payment",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  pending_deposit: {
    label: "Pending Deposit",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  completed: {
    label: "Completed",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  default: {
    label: "Unknown",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
}

interface BookingStatusBadgeProps {
  status: string
  className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const normalized = status?.toLowerCase?.() ?? ""
  const config = STATUS_STYLES[normalized] ?? STATUS_STYLES.default

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
