"use client";

import { useState } from "react";
import {
    useGetBookingsByAccountIdQuery,
    BookingVO,
    useReturnCarMutation,
    useRateCarMutation,
} from "@/lib/services/booking-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCancelBookingMutation, useConfirmPickupMutation } from "@/lib/services/booking-api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/common/loading";
import NoResult from "@/components/common/no-result";
import * as Dialog from "@radix-ui/react-dialog";
import { Star } from "lucide-react";

export default function BookingListPage() {
    const userId = useSelector((state: RootState) => state.user?.id);
    const [cancelBooking] = useCancelBookingMutation();
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const router = useRouter();
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingVO | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [rateCar] = useRateCarMutation();

    const handleCancelBooking = async (booking: BookingVO) => {
        const confirmed = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmed) return;

        setCancellingId(booking.bookingNumber);
        try {
            await cancelBooking({ bookingId: booking.bookingNumber }).unwrap();
            toast.success("Booking cancelled successfully", {
                description: `Booking No: ${booking.bookingNumber}`,
            });
        } catch (err: any) {
            console.error("Error cancelling booking", err);
            toast.error("Failed to cancel booking", {
                description: err?.data?.message || "Please try again later.",
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
        } catch (error: any) {
            toast.error("Failed to confirm pick-up", {
                description: error?.data?.message || "Please try again later.",
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
            setSelectedBooking(booking);
            setRatingDialogOpen(true);
        } catch (error: any) {
            const errMsg = error?.data?.message || "Failed to return car";
            toast.error("Error", { description: errMsg });
        }
    };

    const handleSubmitRating = async () => {
        console.log("User ID:", userId);
        if (!selectedBooking || rating === 0) {
            toast.error("Please select a rating and ensure a booking is selected");
            return;
        }

        try {
            const response = await rateCar({
                bookingNumber: selectedBooking.bookingNumber,
                rating,
                comment: review,
            }).unwrap();
            toast.success(response.data?.message || "Rating and review submitted successfully", {
                description: `You rated ${selectedBooking.carName} ${rating} star${rating > 1 ? "s" : ""}.`,
            });
            setRatingDialogOpen(false);
            setRating(0);
            setReview("");
            setSelectedBooking(null);
        } catch (error: any) {
            const errMsg = error?.data?.message || "Failed to submit rating and review";
            toast.error("Error", { description: errMsg });
        }
    };

    const handleViewDetails = (bookingId: string) => {
        router.push(`/user/booking/${bookingId}`);
    };

    const {
        data,
        isLoading,
        isError,
    } = useGetBookingsByAccountIdQuery({ accountId: userId || "" }, { skip: !userId });

    const bookings = data?.data || [];

    if (isLoading) return <LoadingPage />;
    if (isError) return <NoResult />;

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
                                        <Button
                                            onClick={() => handleViewDetails(String(booking.bookingNumber))}
                                            className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white w-full"
                                        >
                                            View details
                                        </Button>
                                        {(booking.status === "confirmed" || booking.status === "pending_payment") && (
                                            <>
                                                <Button
                                                    className="w-full text-sm py-2 rounded-md bg-gray-200 text-black hover:bg-gray-300"
                                                    onClick={() => handleConfirmPickup(booking)}
                                                >
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
                                    <p><strong>From:</strong> {pickupDate.toLocaleString("en-US")}</p>
                                    <p><strong>To:</strong> {returnDate.toLocaleString("en-US")}</p>
                                    <p><strong>Number of days:</strong> {numberOfDays} day{numberOfDays > 1 ? "s" : ""}</p>
                                    <p><strong>Base price:</strong> {booking.basePrice.toLocaleString("en-US")}₫</p>
                                    <p><strong>Total:</strong> {total.toLocaleString("en-US")}₫</p>
                                    <p><strong>Deposit:</strong> {booking.deposit.toLocaleString("en-US")}₫</p>
                                    <p><strong>Payment:</strong> {booking.paymentType}</p>
                                    <p>
                                        <strong>Booking No:</strong>{" "}
                                        <span className="text-black font-medium">{booking.bookingNumber}</span>
                                    </p>
                                    <p>
                                        <strong>Status:</strong>
                                        <span
                                            className={`ml-1 font-semibold ${
                                                booking.status === "confirmed"
                                                    ? "text-green-600"
                                                    : booking.status === "in_progress"
                                                        ? "text-blue-600"
                                                        : booking.status === "pending_payment"
                                                            ? "text-yellow-600"
                                                            : booking.status === "completed"
                                                                ? "text-gray-600"
                                                                : "text-red-600"
                                            }`}
                                        >
                      {booking.status}
                    </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Rating Dialog */}
            <Dialog.Root open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <Dialog.Title className="text-lg font-bold">Rate your trip</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mt-2">
                            Do you enjoy your trip, please let us know what you think
                        </Dialog.Description>
                        <div className="flex justify-center gap-2 my-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer ${
                                        rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    }`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your review here..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <Dialog.Close asChild>
                                <Button className="bg-gray-200 text-black hover:bg-gray-300">Skip</Button>
                            </Dialog.Close>
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleSubmitRating}
                                disabled={rating === 0}
                            >
                                Send Review
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}