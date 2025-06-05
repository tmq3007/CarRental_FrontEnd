"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5); // Số lượng bản ghi mỗi trang
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang (nếu backend trả về)

    useEffect(() => {
        fetch(`http://localhost:5000/api/booking?page=${page}&pageSize=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                setBookings(data.items || data);
                if (data.totalCount) {
                    setTotalPages(Math.ceil(data.totalCount / pageSize));
                }
            })
            .catch(err => console.error("Error fetching bookings:", err));
    }, [page]);

    const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
    const handleNext = () => setPage(prev => prev + 1);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
            <div className="grid gap-4">
                {bookings.map((booking: any, index: number) => (
                    <Card key={index}>
                        <CardContent className="p-4 space-y-2">
                            <p className="font-medium text-lg">Car: {booking.carName}</p>
                            <p>Booking Number: <strong>{booking.bookingNumber}</strong></p>
                            <p>Pickup Location: {booking.pickUpLocation}</p>
                            <p>Dropoff Location: {booking.dropOffLocation}</p>
                            <p>Pickup Date: {new Date(booking.pickupDate).toLocaleString()}</p>
                            <p>Return Date: {new Date(booking.returnDate).toLocaleString()}</p>
                            <p>Base Price: {booking.basePrice?.toLocaleString()}₫</p>
                            <p>Deposit: {booking.deposit?.toLocaleString()}₫</p>
                            <p>Payment: {booking.paymentType}</p>
                            <p>Created At: {new Date(booking.createdAt).toLocaleString()}</p>
                            <p>Status:
                                <span className={`ml-1 font-semibold ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {booking.status}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="font-medium">
                    Page {page} {totalPages > 1 && `of ${totalPages}`}
                </span>

                <button
                    onClick={handleNext}
                    disabled={totalPages !== 1 && page >= totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
