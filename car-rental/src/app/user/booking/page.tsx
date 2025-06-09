"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Booking {
    carName: string;
    bookingNumber: string;
    pickUpLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    returnDate: string;
    basePrice: number;
    deposit: number;
    paymentType: string;
    createdAt: string;
    status: string;
}

export default function BookingListPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:5000/api/booking?page=${page}&pageSize=${pageSize}`)
            .then((res) => res.json())
            .then((data) => {
                setBookings(data.items || []);
                setTotalCount(data.totalCount || 0);
            })
            .catch((err) => console.error("Error fetching bookings:", err));
    }, [page]);

    const totalPages = Math.ceil(totalCount / pageSize);
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
            <p className="text-sm mb-4 text-gray-500">You have {bookings.length} on-going bookings</p>

            <div className="space-y-6">
                {bookings.map((booking, index) => (
                    <Card key={index} className="flex flex-col md:flex-row gap-4 p-4 shadow">
                        {/* Image */}
                        <div className="w-full md:w-1/3 bg-gray-100 flex items-center justify-center aspect-video">
                            <span className="text-gray-500">[Image Placeholder]</span>
                        </div>

                        {/* Details */}
                        <CardContent className="flex-1 p-0">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-blue-800">{booking.carName}</h2>
                                <Button className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white">View details</Button>
                            </div>

                            <div className="text-sm text-gray-700 mt-1 space-y-1">
                                <p><strong>From:</strong> {new Date(booking.pickupDate).toLocaleString()}</p>
                                <p><strong>To:</strong> {new Date(booking.returnDate).toLocaleString()}</p>
                                <p><strong>Pick-up:</strong> {booking.pickUpLocation}</p>
                                <p><strong>Drop-off:</strong> {booking.dropOffLocation}</p>
                                <p><strong>Base Price:</strong> {booking.basePrice.toLocaleString()}₫</p>
                                <p><strong>Deposit:</strong> {booking.deposit.toLocaleString()}₫</p>
                                <p><strong>Payment:</strong> {booking.paymentType}</p>
                                <p><strong>Booking No:</strong> <span className="text-black font-medium">{booking.bookingNumber}</span></p>
                                <p>
                                    <strong>Status:</strong>
                                    <span className={`ml-1 font-semibold ${booking.status === "Confirmed"
                                            ? "text-green-600"
                                            : booking.status === "In-Progress"
                                                ? "text-blue-600"
                                                : booking.status === "Pending deposit"
                                                    ? "text-yellow-600"
                                                    : booking.status === "Completed"
                                                        ? "text-gray-600"
                                                        : "text-red-600"
                                        }`}>
                                        {booking.status}
                                    </span>
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                {booking.status === "Confirmed" && (
                                    <>
                                        <Button className="bg-gray-200 text-black hover:bg-gray-300 text-xs">Confirm Pickup</Button>
                                        <Button className="bg-red-500 hover:bg-red-600 text-white text-xs">Cancel Booking</Button>
                                    </>
                                )}
                                {booking.status === "In-Progress" && (
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Return Car</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <Button onClick={handlePrev} disabled={page === 1} className="bg-gray-300 text-black disabled:opacity-50">
                    Previous
                </Button>
                <span className="text-sm">Page {page} of {totalPages || 1}</span>
                <Button onClick={handleNext} disabled={page >= totalPages} className="bg-gray-300 text-black disabled:opacity-50">
                    Next
                </Button>
            </div>
        </div>
    );
}
