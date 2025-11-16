"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHeader from "@/components/booking/booking-header"
import BookingInformation from "@/components/booking/booking-information"
import CarInformation from "@/components/booking/car-information"
import PaymentInformation from "@/components/booking/payment-information"
import LoadingPage from "@/components/common/loading"
import NoResult from "@/components/common/no-result"
import Breadcrumb from "@/components/common/breadcum"
import { useGetBookingDetailQuery } from "@/lib/services/booking-api"
import type { BookingStatusHistoryEntry } from "@/lib/services/booking-api"
import { BookingStatusTimeline } from "@/components/booking/booking-status-timeline"
import { BookingStatusProgress } from "@/components/booking/booking-status-progress"
import { BookingActionPanel } from "@/components/booking/booking-action-panel"
import type { RootState } from "@/lib/store"

interface BookingDetailsProps {
    bookingId: string
}

function selectHistory(booking?: any): BookingStatusHistoryEntry[] {
    if (!booking) return []
    const candidates = [
        booking.statusHistory,
        booking.historyEntries,
        booking.history,
        booking.timeline,
        booking.statusHistories,
    ]
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate as BookingStatusHistoryEntry[]
        }
    }
    return []
}

export default function BookingDetails({ bookingId }: BookingDetailsProps) {
    const [activeTab, setActiveTab] = useState("booking-information")
    const { data, isLoading, isError, refetch, isFetching } = useGetBookingDetailQuery(bookingId, {
        refetchOnMountOrArgChange: true,
    })
    const role = useSelector((state: RootState) => state.user?.role)

    const bookingDetail = data?.data
    const timelineEndRef = useRef<HTMLDivElement | null>(null)
    const previousHistoryLength = useRef<number>(0)

    const historyEntries = useMemo(() => selectHistory(bookingDetail), [bookingDetail])

    useEffect(() => {
        const length = historyEntries.length
        if (!length) {
            previousHistoryLength.current = 0
            return
        }
        const shouldAnimate = previousHistoryLength.current > 0 && length > previousHistoryLength.current
        const element = timelineEndRef.current
        if (element) {
            element.scrollIntoView({ behavior: shouldAnimate ? "smooth" : "auto", block: "end" })
        }
        previousHistoryLength.current = length
    }, [historyEntries])

    if (isLoading) {
        return <LoadingPage />
    }

    if (isError || !bookingDetail) {
        return <NoResult />
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-28">
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "My Bookings", path: "/booking" },
                    { label: `${bookingDetail.bookingNumber}` },
                ]}
            />

            <BookingHeader bookingData={bookingDetail} />

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <BookingStatusProgress status={bookingDetail.status} />
            </div>

            <BookingActionPanel
                booking={bookingDetail}
                role={role}
                onActionCompleted={async (_actionKey) => {
                    await refetch()
                }}
                isRefreshing={isFetching}
            />

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 rounded-t-xl border-b bg-slate-50">
                            <TabsTrigger
                                value="booking-information"
                                className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                            >
                                Booking Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="car-information"
                                className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                            >
                                Car Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="payment-information"
                                className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                            >
                                Payment Information
                            </TabsTrigger>
                        </TabsList>
                        <div className="p-6">
                            <TabsContent value="booking-information" className="mt-0">
                                <BookingInformation bookingDetail={bookingDetail} />
                            </TabsContent>
                            <TabsContent value="car-information" className="mt-0">
                                <CarInformation bookingDetail={bookingDetail} />
                            </TabsContent>
                            <TabsContent value="payment-information" className="mt-0">
                                <PaymentInformation bookingDetail={bookingDetail} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-base font-semibold text-slate-900">Status history</h3>
                            <p className="text-sm text-slate-500">Chronological log of booking status changes.</p>
                        </div>
                        <BookingStatusTimeline history={historyEntries} className="max-h-72 overflow-y-auto pr-2" />
                        <div ref={timelineEndRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}
