"use client"

import { format } from "date-fns"
import { BOOKING_STATUS_LABEL } from "@/lib/constants/booking-status"
import type { BookingStatus, BookingStatusHistoryEntry } from "@/lib/services/booking-api"

interface BookingStatusTimelineProps {
  history?: BookingStatusHistoryEntry[] | null | undefined
  className?: string
}

function toStatusLabel(status: string | undefined): string {
  if (!status) return "Unknown"
  const key = status.toLowerCase() as BookingStatus
  const labelFromMap = BOOKING_STATUS_LABEL[key]
  if (labelFromMap) {
    return labelFromMap
  }
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function BookingStatusTimeline({ history, className }: BookingStatusTimelineProps) {
  const sortedHistory = (history ?? [])
    .slice()
    .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime())

  if (!sortedHistory.length) {
    return (
      <div className={className}>
        <p className="text-sm text-slate-500">No status changes recorded for this booking yet.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 border-l pl-4 ${className ?? ""}`}>
      {sortedHistory.map((entry, index) => {
        const hasImage = Boolean(entry.pictureUrl)
        const formattedDate = format(new Date(entry.changedAt), "dd MMM yyyy • HH:mm")
        return (
          <div key={`${entry.id ?? index}-${entry.changedAt}`} className="relative pl-8">
            <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-blue-500"></div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-700">
                {toStatusLabel(entry.oldStatus)}
                <span className="mx-1 text-slate-400">→</span>
                {toStatusLabel(entry.newStatus)}
              </p>
              {entry.note && <p className="text-sm text-slate-500">{entry.note}</p>}
              {hasImage && (
                <img
                  src={entry.pictureUrl as string}
                  alt={`Status change evidence ${index + 1}`}
                  className="h-24 w-24 rounded-md border object-cover"
                />
              )}
              <p className="text-xs text-slate-400">{formattedDate}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
