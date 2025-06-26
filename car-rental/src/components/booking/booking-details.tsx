"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHeader from "@/components/booking/booking-header"
import BookingInformation from "@/components/booking/booking-information"
import CarInformation from "@/components/booking/car-information"
import PaymentInformation from "@/components/booking/payment-information"
import {useGetBookingDetailQuery} from "@/lib/services/booking-api";
import LoadingPage from "@/components/common/loading";
import NoResult from "@/components/common/no-result";
import Breadcrumb from "@/components/common/breadcum";

export default function BookingDetails({ bookingId }: { bookingId: string }) {
    const [activeTab, setActiveTab] = useState("booking-information")
    const { data, isLoading, isError } = useGetBookingDetailQuery(bookingId)

    if (isLoading) {
        return (
           <LoadingPage />
        )
    }

    if (isError || !data?.data) {
        return (
            <NoResult/>
        )
    }

    const bookingDetail = data.data

    function formatDate(dateString?: string): string {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString() + " - " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }

    function calculateNumberOfDays(startDate?: string, endDate?: string): number {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return (
        <div className="max-w-5xl mx-auto mb-5 mt-5">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: "Home", path: "/" },
                { label: "My Booking", path: "/booking" },
                { label: `${bookingDetail.bookingNumber}`  }]} />

            <BookingHeader
                title="Booking Details"
                carName={bookingDetail.carName}
                carId={bookingDetail.carId}
                fromDate={formatDate(bookingDetail.pickUpTime )}
                toDate={formatDate(bookingDetail.dropOffTime )}
                numberOfDays={calculateNumberOfDays(
                    bookingDetail.pickUpTime ,
                    bookingDetail.dropOffTime
                )}
                bookingNo={bookingDetail.bookingNumber}
                bookingStatus={bookingDetail.status}
                basePrice={String(bookingDetail.basePrice)}
                deposit={String(bookingDetail.deposit)}
                total={String(Number(bookingDetail.basePrice) * calculateNumberOfDays(
                    bookingDetail.pickUpTime ,
                    bookingDetail.dropOffTime
                ))}
                carImageFront={bookingDetail.carImageFront}
                carImageBack={bookingDetail.carImageBack}
                carImageLeft={bookingDetail.carImageLeft}
                carImageRight={bookingDetail.carImageRight}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="booking-information">Booking Information</TabsTrigger>
                    <TabsTrigger value="car-information">Car Information</TabsTrigger>
                    <TabsTrigger value="payment-information">Payment Information</TabsTrigger>
                </TabsList>
                <TabsContent value="booking-information">
                    <BookingInformation bookingDetail={bookingDetail} />
                </TabsContent>
                <TabsContent value="car-information">
                    <CarInformation bookingDetail={bookingDetail} />
                </TabsContent>
                <TabsContent value="payment-information">
                    <PaymentInformation bookingDetail={bookingDetail} />
                </TabsContent>
            </Tabs>
        </div>
    )
}