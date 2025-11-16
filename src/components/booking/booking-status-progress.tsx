"use client"

import { cn } from "@/lib/utils"
import { BOOKING_STATUS_LABEL, BOOKING_STATUS_ORDER } from "@/lib/constants/booking-status"
import type { BookingStatus } from "@/lib/services/booking-api"

interface BookingStatusProgressProps {
  status?: string
}

export function BookingStatusProgress({ status }: BookingStatusProgressProps) {
  const normalized = (status ?? "").toLowerCase() as BookingStatus
  const currentIndex = BOOKING_STATUS_ORDER.indexOf(normalized)

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-max items-center gap-4 px-1 py-3">
        {BOOKING_STATUS_ORDER.map((state, index) => {
          const isCompleted = currentIndex > index && currentIndex !== -1
          const isActive = currentIndex === index
          const label = BOOKING_STATUS_LABEL[state]

          return (
            <li key={state} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isActive && "border-blue-500 bg-blue-500 text-white",
                  isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                  !isActive && !isCompleted && "border-slate-200 bg-white text-slate-400"
                )}
              >
                {index + 1}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-xs text-slate-400 uppercase">{state.replace(/_/g, " ")}</span>
              </div>
              {index < BOOKING_STATUS_ORDER.length - 1 && (
                <div
                  className={cn(
                    "h-px w-12",
                    isCompleted || isActive ? "bg-emerald-400" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
