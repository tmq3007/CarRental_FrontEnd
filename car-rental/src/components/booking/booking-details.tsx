"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHeader from "@/components/booking/booking-header"
import BookingInformation from "@/components/booking/booking-information"
import CarInformation from "@/components/booking/car-information"
import PaymentInformation from "@/components/booking/payment-information"
import LoadingPage from "@/components/common/loading"
import NoResult from "@/components/common/no-result"
import Breadcrumb from "@/components/common/breadcum"
import {
    useGetBookingDetailQuery,
    useCancelBookingMutation,
    useConfirmPickupMutation,
    useReturnCarMutation,
} from "@/lib/services/booking-api"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"
import { toast } from "sonner"

export default function BookingDetails({ bookingId }: { bookingId: string }) {
    const [activeTab, setActiveTab] = useState("booking-information")

    const { data, isLoading, isError } = useGetBookingDetailQuery(bookingId)
    const [cancelBooking] = useCancelBookingMutation()
    const [confirmPickup] = useConfirmPickupMutation()
    const [returnCar] = useReturnCarMutation()

    if (isLoading) {
        return <LoadingPage />
    }

    if (isError || !data?.data) {
        return <NoResult />
    }

    const bookingDetail = data.data

    function formatDate(dateString?: string): string {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString() + " - " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    function calculateNumberOfDays(startDate?: string, endDate?: string): number {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const handleConfirmPickup = async () => {
        const confirmPromise = confirmPickup({ bookingNumber: bookingDetail.bookingNumber }).unwrap()

        toast.promise(confirmPromise, {
            loading: "Confirming pickup...",
            success: `Pickup confirmed for ${bookingDetail.carName}`,
            error: "Failed to confirm pickup. Please try again.",
        })
    }

    const handleCancelBooking = async () => {
        toast.custom(
            (t) => (
                <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Cancel Booking</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Are you sure you want to cancel booking{" "}
                                <span className="font-medium">{bookingDetail.bookingNumber}</span>?
                            </p>
                            <div className="mt-3 flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)} className="text-xs">
                                    Keep Booking
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={async () => {
                                        toast.dismiss(t)
                                        const cancelPromise = cancelBooking({ bookingId: bookingDetail.bookingNumber }).unwrap()
                                        toast.promise(cancelPromise, {
                                            loading: "Cancelling booking...",
                                            success: `Booking ${bookingDetail.bookingNumber} cancelled successfully`,
                                            error: "Failed to cancel booking. Please try again.",
                                        })
                                    }}
                                    className="text-xs bg-red-600 hover:bg-red-700"
                                >
                                    Yes, Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            { duration: 10000 },
        )
    }

    const handleReturnCar = async () => {
        const numberOfDays = calculateNumberOfDays(bookingDetail.pickUpTime, bookingDetail.dropOffTime)
        const total = (bookingDetail.basePrice ?? 0) * numberOfDays
        const refundAmount = (bookingDetail.deposit ?? 0) - total

        toast.custom(
            (t) => (
                <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-md">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Car className="w-4 h-4 text-green-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Return Car</h3>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <p>
                                    Total cost: <span className="font-medium">{total.toLocaleString()} VND</span>
                                </p>
                                <p>
                                    Deposit: <span className="font-medium">{(bookingDetail.deposit ?? 0).toLocaleString()} VND</span>
                                </p>
                                <p className={`font-medium ${refundAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                                    {refundAmount > 0
                                        ? `Refund: ${refundAmount.toLocaleString()} VND`
                                        : `Additional charge: ${Math.abs(refundAmount).toLocaleString()} VND`}
                                </p>
                            </div>
                            <div className="mt-3 flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)} className="text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={async () => {
                                        toast.dismiss(t)
                                        const returnPromise = returnCar({ bookingId: bookingDetail.bookingNumber }).unwrap()
                                        toast.promise(returnPromise, {
                                            loading: "Processing car return...",
                                            success: `Car returned successfully for ${bookingDetail.carName}`,
                                            error: "Failed to return car. Please try again.",
                                        })
                                    }}
                                    className="text-xs bg-green-600 hover:bg-green-700"
                                >
                                    Confirm Return
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            { duration: 15000 },
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "My Bookings", path: "/booking" },
                    { label: `${bookingDetail.bookingNumber}` },
                ]}
            />

            <BookingHeader
                title="Booking Details"
                carName={bookingDetail.carName}
                carId={bookingDetail.carId}
                fromDate={formatDate(bookingDetail.pickUpTime)}
                toDate={formatDate(bookingDetail.dropOffTime)}
                numberOfDays={calculateNumberOfDays(bookingDetail.pickUpTime, bookingDetail.dropOffTime)}
                bookingNo={bookingDetail.bookingNumber}
                bookingStatus={bookingDetail.status}
                basePrice={String(bookingDetail.basePrice)}
                deposit={String(bookingDetail.deposit)}
                total={String(
                    Number(bookingDetail.basePrice) * calculateNumberOfDays(bookingDetail.pickUpTime, bookingDetail.dropOffTime),
                )}
                carImageFront={bookingDetail.carImageFront}
                carImageBack={bookingDetail.carImageBack}
                carImageLeft={bookingDetail.carImageLeft}
                carImageRight={bookingDetail.carImageRight}
                handleConfirmPickup={handleConfirmPickup}
                handleCancelBooking={handleCancelBooking}
                handleReturnCar={handleReturnCar}
            />

            <div className="bg-white rounded-xl shadow-sm border border-green-100">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full bg-green-50 rounded-t-xl border-b border-green-100">
                        <TabsTrigger
                            value="booking-information"
                            className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:border-green-200"
                        >
                            Booking Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="car-information"
                            className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:border-green-200"
                        >
                            Car Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="payment-information"
                            className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:border-green-200"
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
        </div>
    )
}
