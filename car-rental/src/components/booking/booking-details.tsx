"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookingHeader from "@/components/booking/booking-header"
import BookingInformation from "@/components/booking/booking-information";
import CarInformation from "@/components/booking/car-information";
import PaymentInformation from "@/components/booking/payment-information";

export default function BookingDetails({bookingId}: {bookingId: string}) {
    const [activeTab, setActiveTab] = useState("booking-information")

    return (
        <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                    Home
                </Link>
                <span className="text-gray-500">&gt;</span>
                <Link href="/my-bookings" className="text-gray-500 hover:text-gray-700">
                    My Bookings
                </Link>
                <span className="text-gray-500">&gt;</span>
                <span className="text-gray-700">Booking details</span>
            </div>

            <BookingHeader
                title="Booking Details"
                carName="Nissan Navara El 2017"
                fromDate="13/02/2022 - 12:00 PM"
                toDate="23/02/2022 - 14:00 PM"
                numberOfDays={10}
                bookingNo="012345"
                bookingStatus="Confirmed"
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="booking-information">Booking Information</TabsTrigger>
                    <TabsTrigger value="car-information">Car Information</TabsTrigger>
                    <TabsTrigger value="payment-information">Payment Information</TabsTrigger>
                </TabsList>
                <TabsContent value="booking-information">
                    <BookingInformation />
                </TabsContent>
                <TabsContent value="car-information">
                    <CarInformation />
                </TabsContent>
                <TabsContent value="payment-information">
                    <PaymentInformation />
                </TabsContent>
            </Tabs>
        </div>
    )
}
