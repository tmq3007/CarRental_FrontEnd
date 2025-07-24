"use client"

import { useState } from "react"
import { Toaster } from "sonner"
import BookingListPage from "@/components/booking/booking-list-page"
import BookingDetails from "@/components/booking/booking-details"

export default function Home() {
    const [currentView, setCurrentView] = useState<"list" | "details">("list")
    const [selectedBookingId, setSelectedBookingId] = useState<string>("")

    const handleViewDetails = (bookingId: string) => {
        setSelectedBookingId(bookingId)
        setCurrentView("details")
    }

    const handleBackToList = () => {
        setCurrentView("list")
        setSelectedBookingId("")
    }

    return (
        <>

            {currentView === "list" && <BookingListPage onViewDetails={handleViewDetails} />}
            {currentView === "details" && selectedBookingId && (
                <div>
                    <button
                        onClick={handleBackToList}
                        className="mb-6 inline-flex items-center px-4 py-2 border border-green-200 shadow-sm text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Bookings
                    </button>
                    <BookingDetails bookingId={selectedBookingId} />
                </div>
            )}

        </>
    )
}
