"use client"

import { useMemo } from "react"

import { useGetBookingSummaryQuery } from "@/lib/services/booking-api"

export type BookingSummaryDialogStatus = "idle" | "loading" | "success" | "error" | "aborted"

export function useBookingSummaryDialog(bookingNumber: string | null, open: boolean) {
  const skip = !bookingNumber || !open
  const result = useGetBookingSummaryQuery(bookingNumber ?? "", { skip })
  const isLoading = result.isLoading || result.isFetching
  const hasData = Boolean(result.data?.data)
  const isAborted = Boolean(result.error && (result.error as { name?: string }).name === "AbortError")

  const status: BookingSummaryDialogStatus = useMemo(() => {
    if (skip) {
      return "idle"
    }
    if (isLoading) {
      return "loading"
    }
    if (result.isError) {
      return isAborted ? "aborted" : "error"
    }
    if (hasData) {
      return "success"
    }
    return "idle"
  }, [skip, isLoading, result.isError, isAborted, hasData])

  return {
    status,
    summary: result.data?.data,
    isLoading,
    isIdle: status === "idle",
    isAborted,
    error: result.error,
    refetch: result.refetch,
  }
}
