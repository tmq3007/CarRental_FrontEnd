"use client";

import { useState } from "react";
import { useGetBookingsByAccountIdQuery, BookingVO, useReturnCarMutation } from "@/lib/services/booking-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCancelBookingMutation } from "@/lib/services/booking-api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "sonner";
import { useConfirmPickupMutation } from "@/lib/services/booking-api";

export default function BookingListPage() {
    const userId = useSelector((state: RootState) => state.user?.id);
    const [cancelBooking] = useCancelBookingMutation();
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancelBooking = async (booking: BookingVO) => {
        const confirmed = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmed) return;

        setCancellingId(booking.bookingNumber);
        try {
            await cancelBooking({ bookingId: booking.bookingNumber }).unwrap();
            toast.success("Booking cancelled successfully", {
                description: `Booking No: ${booking.bookingNumber}`,
            });
        } catch (err) {
            console.error("Error cancelling booking", err);
            toast.error("Failed to cancel booking", {
                description: "Please try again later.",
            });
        } finally {
            setCancellingId(null);
        }
    };
    const [confirmPickup] = useConfirmPickupMutation();

    const handleConfirmPickup = async (booking: BookingVO) => {
        const confirmed = window.confirm("Are you sure you want to confirm pick-up?");
        if (!confirmed) return;

        try {
            await confirmPickup({ bookingNumber: booking.bookingNumber }).unwrap();
            toast.success("Pick-up confirmed successfully", {
                description: `Booking No: ${booking.bookingNumber}`,
            });
        } catch (error) {
            toast.error("Failed to confirm pick-up", {
                description: "Please try again later.",
            });
        }
    };
    const [returnCar] = useReturnCarMutation();

    const handleReturnCar = async (booking: BookingVO) => {
        const pickupDate = new Date(booking.pickupDate);
        const returnDate = new Date(booking.returnDate);
        const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const total = booking.basePrice * numberOfDays;
        const deposit = booking.deposit;

        let message = "";
        if (total > deposit) {
            const diff = total - deposit;
            message = `Please confirm to return the car. The remaining amount of ${diff.toLocaleString()} VND will be deducted from your wallet.`;
        } else {
            const refund = deposit - total;
            message = `Please confirm to return the car. The exceeding amount of ${refund.toLocaleString()} VND will be returned to your wallet.`;
        }

        const confirmed = window.confirm(message);
        if (!confirmed) return;

        try {
            await returnCar({ bookingId: booking.bookingNumber }).unwrap();
            toast.success("Car returned successfully", {
                description: `Booking No: ${booking.bookingNumber}`,
            });
        } catch (error: any) {
            const errMsg = error?.data?.message || "Failed to return car";
            toast.error("Error", { description: errMsg });
        }
    };



    const {
        data,
        isLoading,
        isError,
    } = useGetBookingsByAccountIdQuery({ accountId: userId || "" }, { skip: !userId });

    const bookings = data?.data || [];

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError) return <p className="p-6 text-red-500">Error loading bookings.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
            <p className="text-sm mb-4 text-gray-500">
                You have {bookings.length} bookings.
            </p>

            <div className="space-y-6">
                {bookings.map((booking: BookingVO) => {
                    const pickupDate = new Date(booking.pickupDate);
                    const returnDate = new Date(booking.returnDate);
                    const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const total = booking.basePrice * numberOfDays;

                    return (
                        <Card key={booking.bookingNumber} className="flex flex-col md:flex-row gap-4 p-4 shadow rounded-lg">
                            <div className="w-full md:w-1/3 bg-gray-100 flex items-center justify-center aspect-video">
                                <span className="text-gray-500">[Car Image Placeholder]</span>
                            </div>

                            <CardContent className="flex-1 p-0">
                                <div className="flex justify-between items-start flex-wrap">
                                    <h2 className="text-lg font-semibold text-blue-800">{booking.carName}</h2>
                                    <div className="flex flex-col gap-3 ml-4">
                                        <Button className="w-full text-sm py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                                            View details
                                        </Button>

                                        {(booking.status === "confirmed" || booking.status === "pending_payment") && (
                                            <>
                                                <Button className="w-full text-sm py-2 rounded-md bg-gray-200 text-black hover:bg-gray-300"
                                                    onClick={() => handleConfirmPickup(booking)}>
                                                    Confirm Pick-up
                                                </Button>
                                                <Button
                                                    className="w-full text-sm py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => handleCancelBooking(booking)}
                                                    disabled={cancellingId === booking.bookingNumber}
                                                >
                                                    {cancellingId === booking.bookingNumber ? "Cancelling..." : "Cancel Booking"}
                                                </Button>
                                            </>
                                        )}

                                        {booking.status === "in_progress" && (
                                            <Button
                                                className="w-full text-sm py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                                                onClick={() => handleReturnCar(booking)}
                                            >
                                                Return Car
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700 mt-4 space-y-1">
                                    <p><strong>From:</strong> {pickupDate.toLocaleString('en-US')}</p>
                                    <p><strong>To:</strong> {returnDate.toLocaleString('en-US')}</p>
                                    <p><strong>Number of days:</strong> {numberOfDays} day{numberOfDays > 1 ? 's' : ''}</p>
                                    <p><strong>Base price:</strong> {booking.basePrice.toLocaleString('en-US')}₫</p>
                                    <p><strong>Total:</strong> {total.toLocaleString('en-US')}₫</p>
                                    <p><strong>Deposit:</strong> {booking.deposit.toLocaleString('en-US')}₫</p>
                                    <p><strong>Payment:</strong> {booking.paymentType}</p>
                                    <p><strong>Booking No:</strong> <span className="text-black font-medium">{booking.bookingNumber}</span></p>
                                    <p>
                                        <strong>Status:</strong>
                                        <span className={`ml-1 font-semibold ${booking.status === "confirmed"
                                            ? "text-green-600"
                                            : booking.status === "in_progress"
                                                ? "text-blue-600"
                                                : booking.status === "pending_payment"
                                                    ? "text-yellow-600"
                                                    : booking.status === "completed"
                                                        ? "text-gray-600"
                                                        : "text-red-600"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}



