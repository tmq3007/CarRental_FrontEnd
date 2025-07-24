"use client";

import { useState, useMemo } from "react";
import {
    useGetBookingsByAccountIdQuery,
    BookingVO,
    useReturnCarMutation,
    useCancelBookingMutation,
    useConfirmPickupMutation
} from "@/lib/services/booking-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "sonner";
import LoadingPage from "@/components/common/loading";
import { useRouter } from "next/navigation";
import NoResult from "@/components/common/no-result";
import { Pagination } from "@/components/wallet/pagination";

export default function BookingListPage() {
    const userId = useSelector((state: RootState) => state.user?.id);
    const router = useRouter();

    const [cancelBooking] = useCancelBookingMutation();
    const [confirmPickup] = useConfirmPickupMutation();
    const [returnCar] = useReturnCarMutation();

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false); // Thêm trạng thái cho modal trả xe
    const [selectedBooking, setSelectedBooking] = useState<BookingVO | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError } = useGetBookingsByAccountIdQuery(
        { accountId: userId || "" },
        { skip: !userId }
    );

    const bookings = data?.data || [];

    const sortedBookings = useMemo(() => {
        let filteredBookings = bookings;
        if (searchTerm) {
            filteredBookings = bookings.filter(booking =>
                booking.carName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return [...filteredBookings].sort((a, b) => {
            const dateA = new Date(a.pickupDate).getTime();
            const dateB = new Date(b.pickupDate).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
    }, [bookings, sortOrder, searchTerm]);

    const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
    const paginatedBookings = sortedBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCancelBooking = async (booking: BookingVO) => {
        setSelectedBooking(booking);
        setIsCancelModalOpen(true);
    };

    const handleConfirmPickup = async (booking: BookingVO) => {
        setSelectedBooking(booking);
        setIsConfirmModalOpen(true);
    };

    const handleReturnCar = async (booking: BookingVO) => {
        setSelectedBooking(booking); // Lưu booking được chọn
        setIsReturnModalOpen(true); // Mở modal trả xe
    };

    const handleConfirmModalConfirm = async () => {
        if (!selectedBooking) return;

        try {
            await confirmPickup({ bookingNumber: selectedBooking.bookingNumber }).unwrap();
            toast.success("Pick-up confirmed");
        } catch {
            toast.error("Failed to confirm pick-up");
        } finally {
            setIsConfirmModalOpen(false);
            setSelectedBooking(null);
        }
    };

    const handleCancelModalConfirm = async () => {
        if (!selectedBooking) return;

        setCancellingId(selectedBooking.bookingNumber);
        try {
            await cancelBooking({ bookingId: selectedBooking.bookingNumber }).unwrap();
            toast.success("Booking cancelled successfully", {
                description: `Booking No: ${selectedBooking.bookingNumber}`,
            });
        } catch (err) {
            toast.error("Failed to cancel booking");
        } finally {
            setIsCancelModalOpen(false);
            setCancellingId(null);
            setSelectedBooking(null);
        }
    };

    const handleReturnModalConfirm = async () => {
        if (!selectedBooking) return;

        const pickupDate = new Date(selectedBooking.pickupDate);
        const returnDate = new Date(selectedBooking.returnDate);
        const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const total = selectedBooking.basePrice * numberOfDays;
        const deposit = selectedBooking.deposit;

        try {
            await returnCar({ bookingId: selectedBooking.bookingNumber }).unwrap();
            toast.success("Car returned successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to return car");
        } finally {
            setIsReturnModalOpen(false);
            setSelectedBooking(null);
        }
    };

    const handleModalCancel = () => {
        setIsConfirmModalOpen(false);
        setIsCancelModalOpen(false);
        setIsReturnModalOpen(false); // Đóng modal trả xe
        setSelectedBooking(null);
    };

    const handleViewDetails = (bookingId: string) => {
        router.push(`/user/booking/${bookingId}`);
    };

    const handleSortSelect = (order: "newest" | "oldest") => {
        setSortOrder(order);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (isLoading) return <LoadingPage />;
    if (isError || bookings.length === 0) return <NoResult />;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
            <div className="flex flex-row items-center justify-between mb-4 gap-4">
                <div>
                    <input
                        type="text"
                        placeholder="Search by car name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full md:w-[300px] px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-between w-[180px] px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                        <span>Sort by {sortOrder === "newest" ? "Newest" : "Oldest"}</span>
                        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-300 rounded shadow-lg z-10">
                            <button
                                onClick={() => handleSortSelect("newest")}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sort by Newest
                            </button>
                            <button
                                onClick={() => handleSortSelect("oldest")}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sort by Oldest
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {paginatedBookings.map((booking: BookingVO) => {
                    const pickupDate = new Date(booking.pickupDate);
                    const returnDate = new Date(booking.returnDate);
                    const numberOfDays = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const total = booking.basePrice * numberOfDays;

                    return (
                        <Card key={booking.bookingNumber} className="flex flex-col md:flex-row gap-4 p-4">
                            <div className="w-full md:w-1/3 bg-gray-100 flex items-center justify-center aspect-video">
                                <span className="text-gray-500">[Car Image Placeholder]</span>
                            </div>

                            <CardContent className="flex-1 p-0">
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-blue-800 mb-2">{booking.carName}</h2>
                                        <div className="text-sm text-gray-700 space-y-1">
                                            <p><strong>From:</strong> {pickupDate.toLocaleString("en-US")}</p>
                                            <p><strong>To:</strong> {returnDate.toLocaleString("en-US")}</p>
                                            <p><strong>Number of days:</strong> {numberOfDays} day{numberOfDays > 1 ? "s" : ""}</p>
                                            <p><strong>Base price:</strong> {booking.basePrice.toLocaleString("en-US")}₫</p>
                                            <p><strong>Total:</strong> {total.toLocaleString("en-US")}₫</p>
                                            <p><strong>Deposit:</strong> {booking.deposit.toLocaleString("en-US")}₫</p>
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
                                    </div>

                                    <div className="flex flex-col gap-3 w-40">
                                        <Button
                                            onClick={() => handleViewDetails(String(booking.bookingNumber))}
                                            className="w-full text-sm bg-blue-500 text-white"
                                        >
                                            View Details
                                        </Button>

                                        {booking.status === "confirmed" && (
                                            <>
                                                <Button
                                                    onClick={() => handleConfirmPickup(booking)}
                                                    className="w-full text-sm bg-gray-500 hover:bg-gray-600 text-white"
                                                >
                                                    Confirm Pick-up
                                                </Button>
                                                <Button
                                                    onClick={() => handleCancelBooking(booking)}
                                                    disabled={cancellingId === booking.bookingNumber}
                                                    className="w-full text-sm bg-red-500 text-white"
                                                >
                                                    {cancellingId === booking.bookingNumber ? "Cancelling..." : "Cancel"}
                                                </Button>
                                            </>
                                        )}

                                        {booking.status === "pending_deposit" && (
                                            <Button
                                                onClick={() => handleCancelBooking(booking)}
                                                disabled={cancellingId === booking.bookingNumber}
                                                className="w-full text-sm bg-red-500 text-white"
                                            >
                                                {cancellingId === booking.bookingNumber ? "Cancelling..." : "Cancel"}
                                            </Button>
                                        )}

                                        {booking.status === "in_progress" && (
                                            <Button
                                                onClick={() => handleReturnCar(booking)}
                                                className="w-full text-sm bg-blue-500 text-white"
                                            >
                                                Return Car
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedBookings.length}
                    startIndex={(currentPage - 1) * itemsPerPage}
                    endIndex={Math.min(currentPage * itemsPerPage, sortedBookings.length)}
                    onPageChange={setCurrentPage}
                />
            </div>

            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h2 className="text-lg font-semibold mb-4">Confirm Pick-up</h2>
                        <p className="mb-4">Are you sure you want to confirm pick-up for booking No: {selectedBooking?.bookingNumber}?</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={handleModalCancel}
                                className="text-sm bg-gray-500 hover:bg-gray-600 text-white"
                            >
                                No
                            </Button>
                            <Button
                                onClick={handleConfirmModalConfirm}
                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isCancelModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h2 className="text-lg font-semibold mb-4">Cancel Booking</h2>
                        <p className="mb-4">Are you sure you want to cancel booking No: {selectedBooking?.bookingNumber}?</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={handleModalCancel}
                                className="text-sm bg-gray-500 hover:bg-gray-600 text-white"
                            >
                                No
                            </Button>
                            <Button
                                onClick={handleCancelModalConfirm}
                                className="text-sm bg-red-500 hover:bg-red-600 text-white"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isReturnModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h2 className="text-lg font-semibold mb-4">Return Car</h2>
                        <p className="mb-4">
                            {selectedBooking && (
                                <>
                                    The total cost is {selectedBooking.basePrice * Math.ceil((new Date(selectedBooking.returnDate).getTime() - new Date(selectedBooking.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} VND, and the deposit is {selectedBooking.deposit} VND.{' '}
                                    {selectedBooking.basePrice * Math.ceil((new Date(selectedBooking.returnDate).getTime() - new Date(selectedBooking.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 > selectedBooking.deposit
                                        ? `Remaining ${selectedBooking.basePrice * Math.ceil((new Date(selectedBooking.returnDate).getTime() - new Date(selectedBooking.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 - selectedBooking.deposit} VND will be deducted.`
                                        : `Refund ${selectedBooking.deposit - (selectedBooking.basePrice * Math.ceil((new Date(selectedBooking.returnDate).getTime() - new Date(selectedBooking.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)} VND will be returned.`}
                                    Are you sure you want to proceed with returning the car for booking No: {selectedBooking.bookingNumber}?
                                </>
                            )}
                        </p>
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={handleModalCancel}
                                className="text-sm bg-gray-500 hover:bg-gray-600 text-white"
                            >
                                No
                            </Button>
                            <Button
                                onClick={handleReturnModalConfirm}
                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}