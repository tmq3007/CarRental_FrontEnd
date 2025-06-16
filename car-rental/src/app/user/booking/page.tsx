"use client";

import { useEffect, useState } from "react";
import { useGetBookingsByAccountIdQuery, BookingVO } from "@/lib/services/booking-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookingListPage() {
    const [accountId, setAccountId] = useState<string | null>(null);

    // Lấy accountId từ localStorage
    useEffect(() => {
        const storedAccountId = localStorage.getItem("accountId");
        setAccountId(storedAccountId);
    }, []);

    // Gọi API theo accountId
    const {
        data,
        isLoading,
        isError,
    } = useGetBookingsByAccountIdQuery({ accountId: accountId || "" }, { skip: !accountId });

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
                {bookings.length > 0 ? (
                    bookings.map((booking: BookingVO, index: number) => (
                        <Card key={index} className="flex flex-col md:flex-row gap-4 p-4 shadow">
                            <div className="w-full md:w-1/3 bg-gray-100 flex items-center justify-center aspect-video">
                                <span className="text-gray-500">[Car Image Placeholder]</span>
                            </div>

                            <CardContent className="flex-1 p-0">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-semibold text-blue-800">{booking.carName}</h2>
                                    <div className="flex flex-col gap-3 ml-4 mr-4 mt-2">
                                        <Button className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white w-full">View details</Button>
                                        {(booking.status === "confirmed" || booking.status === "pending_payment") && (
                                            <>
                                                <Button className="bg-gray-200 text-black hover:bg-gray-300 text-xs w-full">Confirm Pickup</Button>
                                                <Button className="bg-red-500 hover:bg-red-600 text-white text-xs w-full">Cancel Booking</Button>
                                            </>
                                        )}
                                        {booking.status === "waiting_confirmed" && (
                                            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs w-full">Return Car</Button>
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700 mt-1 space-y-1">
                                    <p><strong>From:</strong> {new Date(booking.pickupDate).toLocaleString('en-US')}</p>
                                    <p><strong>To:</strong> {new Date(booking.returnDate).toLocaleString('en-US')}</p>
                                    <p><strong>Pick-up:</strong> {booking.pickUpLocation}</p>
                                    <p><strong>Drop-off:</strong> {booking.dropOffLocation}</p>
                                    <p><strong>Base Price:</strong> {booking.basePrice.toLocaleString('en-US')}₫</p>
                                    <p><strong>Deposit:</strong> {booking.deposit.toLocaleString('en-US')}₫</p>
                                    <p><strong>Payment:</strong> {booking.paymentType}</p>
                                    <p><strong>Booking No:</strong> <span className="text-black font-medium">{booking.bookingNumber}</span></p>
                                    <p>
                                        <strong>Status:</strong>
                                        <span className={`ml-1 font-semibold ${booking.status === "confirmed"
                                            ? "text-green-600"
                                            : booking.status === "waiting_confirmed"
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
                    ))
                ) : (
                    !isLoading && <p className="text-center text-gray-500">No bookings found.</p>
                )}
            </div>
        </div>
    );
}
