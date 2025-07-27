"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
    type CarFilters,
    type CarVO_ViewACar,
    useGetCarsQuery,
    useConfirmDepositMutation,
    useGetBookingDetailsByCarIdsQuery,
} from "@/lib/services/car-api";
import NoResult from "@/components/common/no-result";
import Breadcrumb from "@/components/common/breadcum";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import LoadingPage from "@/components/common/loading";
import { PaginationControls } from "@/components/common/pagination-controls";

// Define TypeScript interfaces
interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface BookingDetail {
    bookingNumber: string;
    status: string;
    carId: string;
}

interface CarListPageProps {
    accountId: string;
}

export default function CarListPage({ accountId }: CarListPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<CarFilters>({
        sortBy: "id",
        sortDirection: "desc",
    });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const userId = useSelector((state: RootState) => state.user?.id || accountId);
    const { data: carsData, error, isLoading, isFetching } = useGetCarsQuery({
        accountId: userId,
        pageNumber: currentPage,
        pageSize,
        filters,
    });

    const [confirmDeposit, { isLoading: isConfirmingDeposit }] =
        useConfirmDepositMutation();

    const cars: CarVO_ViewACar[] = carsData?.data.data || [];
    const pagination: Pagination = carsData?.data.pagination || {
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
    };

    // Fetch booking details for all cars in a single query
    const carIds = useMemo(() => cars.map((car) => car.id.toString()), [cars]);
    const { data: bookingData, isLoading: isLoadingBookings } =
        useGetBookingDetailsByCarIdsQuery(carIds, { skip: carIds.length === 0 });

    const bookingDetails = useMemo(() => {
        return bookingData?.data || {};
    }, [bookingData]);

    const handleViewDetails = (carId: string) => {
        router.push(`/car-owner/my-car/edit-car/${carId}`);
    };

    const handleSortChange = (value: string) => {
        setIsTransitioning(true);
        const [sortBy, sortDirection] = value.split("-");
        setFilters({
            sortBy,
            sortDirection: sortDirection as "asc" | "desc",
        });
        setCurrentPage(1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages || newPage === currentPage)
            return;
        setIsTransitioning(true);
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const handlePageSizeChange = (size: string) => {
        const newSize = Number.parseInt(size);
        if (isNaN(newSize) || newSize <= 0) return;
        setIsTransitioning(true);
        setPageSize(newSize);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const handleConfirmDeposit = async (bookingId: string) => {
        try {
            const response = await confirmDeposit(bookingId).unwrap();
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Deposit confirmed successfully.",
                    variant: "default",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to confirm deposit.",
                variant: "destructive",
            });
        }
    };

    const formatPrice = (price: number) => {
        return `${(price / 1000).toFixed(0)}k/day`;
    };

    const formatLocation = (car: CarVO_ViewACar) => {
        const parts = [car.ward, car.district, car.cityProvince].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "Location not specified";
    };

    const getStatusBadgeProps = (status: string) => {
        switch (status.toLowerCase()) {
            case "available":
                return {
                    variant: "default" as const,
                    className: "bg-green-100 text-green-800 hover:bg-green-200",
                };
            case "booked":
            case "rented":
            case "in_progress":
                return {
                    variant: "secondary" as const,
                    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
                };
            case "stopped":
            case "maintenance":
                return {
                    variant: "destructive" as const,
                    className: "bg-red-100 text-red-800 hover:bg-red-200",
                };
            case "pending_deposit":
                return {
                    variant: "outline" as const,
                    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                };
            case "confirmed":
                return {
                    variant: "outline" as const,
                    className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
                };
            default:
                return {
                    variant: "outline" as const,
                    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
                };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingPage />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="animate-in fade-in duration-500">
                    <Breadcrumb
                        items={[
                            { label: "Home", path: "/home" },
                            { label: "My Car", path: "/car-owner/my-car" },
                        ]}
                    />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 animate-in slide-in-from-top duration-500">
                    <h1 className="text-2xl font-bold">
                        List of Cars {pagination.totalRecords ? `(${pagination.totalRecords} total)` : ""}
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/car-owner/add-car">
                            <Button className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105">
                                Add car
                            </Button>
                        </Link>
                        <Select defaultValue="id-desc" onValueChange={handleSortChange}>
                            <SelectTrigger className="w-48 hover:border-blue-300 focus:border-blue-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="animate-in fade-in slide-in-from-top-2">
                                <SelectItem value="id-desc">Newest to Latest</SelectItem>
                                <SelectItem value="id-asc">Oldest to Newest</SelectItem>
                                <SelectItem value="basePrice-desc">Price: High to Low</SelectItem>
                                <SelectItem value="basePrice-asc">Price: Low to High</SelectItem>
                                <SelectItem value="brand-asc">Brand: A to Z</SelectItem>
                                <SelectItem value="brand-desc">Brand: Z to A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-red-600 text-center py-12 animate-in fade-in duration-500">
                        <NoResult />
                    </div>
                )}

                {/* Car Cards */}
                <div
                    className={`space-y-4 ${isTransitioning || isFetching || isLoadingBookings ? "opacity-50" : "opacity-100"}`}
                >
                    {cars.length === 0 ? (
                        <div className="text-center py-12 animate-in fade-in duration-500">
                            <p className="text-gray-500 mb-4">No cars found</p>
                            <Link href="/car-owner/add-car">
                                <Button className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105">
                                    Add Your First Car!
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        cars.map((car: CarVO_ViewACar, index: number) => {
                            const booking = bookingDetails[car.id.toString()];
                            return (
                                <Card
                                    key={car.id}
                                    className="bg-white hover:shadow-lg hover:scale-[1.01] animate-in fade-in slide-in-from-bottom"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex gap-6">
                                            {/* Car Image */}
                                            <div className="relative w-64 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden group">
                                                {car.carImageFront ? (
                                                    <img
                                                        src={car.carImageFront}
                                                        alt={`${car.brand} ${car.model}`}
                                                        className="w-full h-full object-cover group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Car Details */}
                                            <div className="flex-1 space-y-3">
                                                <h3 className="text-xl font-semibold hover:text-blue-600">
                                                    {car.brand} {car.model} {car.productionYear}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="hover:bg-gray-50 p-2 rounded">
                                                        <span className="font-medium">Price:</span>
                                                        <div className="mt-1 font-semibold text-green-600">
                                                            {formatPrice(car.basePrice)}
                                                        </div>
                                                    </div>
                                                    <div className="hover:bg-gray-50 p-2 rounded">
                                                        <span className="font-medium">Location:</span>
                                                        <div className="mt-1 text-blue-600">{formatLocation(car)}</div>
                                                    </div>
                                                    <div className="hover:bg-gray-50 p-2 rounded">
                                                        <span className="font-medium">Seats:</span>
                                                        <div className="mt-1">{car.numberOfSeats} seats</div>
                                                    </div>
                                                    <div className="hover:bg-gray-50 p-2 rounded">
                                                        <span className="font-medium">Status:</span>
                                                        <div className="mt-1">
                                                            <Badge {...getStatusBadgeProps(booking?.status || car.status)}>
                                                                {booking?.status || car.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {booking && (
                                                        <div className="hover:bg-gray-50 p-2 rounded">
                                                            <span className="font-medium">Booking Number:</span>
                                                            <div className="mt-1">{booking.bookingNumber}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    onClick={() => handleViewDetails(car.id.toString())}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                >
                                                    View details
                                                </Button>
                                                {booking?.status?.toLowerCase() === "pending_deposit" && (
                                                    <Button
                                                        onClick={() => handleConfirmDeposit(booking.bookingNumber)}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isConfirmingDeposit}
                                                        className="text-blue-600 border-blue-600 hover:bg-blue-50 disabled:opacity-50"
                                                    >
                                                        {isConfirmingDeposit ? "Confirming..." : "Confirm deposit"}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Rows per page:</span>
                                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[5, 10, 20, 50].map((size) => (
                                                <SelectItem key={size} value={size.toString()}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                    isFetching={isFetching}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}