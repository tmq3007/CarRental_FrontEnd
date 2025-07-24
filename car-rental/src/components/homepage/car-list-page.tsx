"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { type CarFilters, type CarVO_ViewACar, useGetCarsQuery } from "@/lib/services/car-api"
import CarListSkeleton from "@/components/skeleton/car-list-skeleton"
import NoResult from "@/components/common/no-result"
import Breadcrumb from "@/components/common/breadcum"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useRouter } from "next/navigation"
import LoadingPage from "@/components/common/loading"

interface CarListPageProps {
    accountId: string
}

export default function CarListPage({ accountId }: CarListPageProps) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [filters, setFilters] = useState<CarFilters>({
        sortBy: "id",
        sortDirection: "desc",
    })
    const [isTransitioning, setIsTransitioning] = useState(false)

    const handleViewDetails = (carId: string) => {
        router.push(`/car-owner/my-car/edit-car/${carId}`) // Thay đổi route sang edit-car/{id}
    }

    const {
        data,
        error,
        isLoading: loading,
    } = useGetCarsQuery({
        accountId: useSelector((state: RootState) => state.user?.id),
        pageNumber: currentPage,
        pageSize,
        filters,
    })
const cars = data?.data.data || [];
  const pagination = data?.data.pagination || {
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

    const handleSortChange = (value: string) => {
        setIsTransitioning(true)
        const [sortBy, sortDirection] = value.split("-")
        setFilters({
            sortBy,
            sortDirection: sortDirection as "asc" | "desc",
        })
        setCurrentPage(1)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handlePageChange = (page: number) => {
        setIsTransitioning(true)
        setCurrentPage(page)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handlePageSizeChange = (size: string) => {
        setIsTransitioning(true)
        setPageSize(Number.parseInt(size))
        setCurrentPage(1)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const formatPrice = (price: number) => {
        return `${(price / 1000).toFixed(0)}k/day`
    }

    const formatLocation = (car: CarVO_ViewACar) => {
        const parts = [car.ward, car.district, car.cityProvince].filter(Boolean)
        return parts.join(", ") || "Location not specified"
    }

    const getStatusBadgeProps = (status: string) => {
        switch (status.toLowerCase()) {
            case "available":
                return {
                    variant: "default" as const,
                    className: "bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200",
                }
            case "booked":
            case "rented":
                return {
                    variant: "secondary" as const,
                    className: "bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200",
                }
            case "stopped":
            case "maintenance":
                return {
                    variant: "destructive" as const,
                    className: "bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200",
                }
            default:
                return {
                    variant: "outline" as const,
                    className: "bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200",
                }
        }
    }

    const renderPaginationButtons = () => {
        if (!cars) return null
        const {pageNumber, totalPages} = {
            pageNumber: pagination?.pageNumber ?? 1,
            totalPages: pagination?.totalPages ?? 1
        }
        const buttons = []

        buttons.push(
            <Button
                key="prev"
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={!pagination?.hasPreviousPage}
                className="transition-all duration-200 hover:bg-gray-100 disabled:opacity-50"
            >
                {"<<<"}
            </Button>,
        )

        const startPage = Math.max(1, pageNumber - 2)
        const endPage = Math.min(totalPages, pageNumber + 2)

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className={`transition-all duration-200 ${
                        i === pageNumber ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "hover:bg-gray-100"
                    }`}
                >
                    {i}
                </Button>,
            )
        }

        if (endPage < totalPages) {
            buttons.push(
                <span key="ellipsis" className="mx-2 text-gray-400">
                    ...
                </span>,
            )
        }

        buttons.push(
            <Button
                key="next"
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={!pagination?.hasNextPage}
                className="transition-all duration-200 hover:bg-gray-100 disabled:opacity-50"
            >
                {">>>"}
            </Button>,
        )

        return buttons
    }

    if (loading || !cars) {
        return <LoadingPage/>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="animate-in fade-in duration-500">
                    <Breadcrumb
                        items={[
                            { label: "Home", path: "/home" },
                            { label: "My Car", path: "/car-owner/my-car" }, // Đường dẫn chính xác
                        ]}
                    />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 animate-in slide-in-from-top duration-500">
                    <h1 className="text-2xl font-bold transition-all duration-300">
                        List of Cars {pagination?.totalRecords ? `(${pagination?.totalRecords} total)` : ""}
                    </h1>
                    <div className="flex gap-4">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
                        >
                            Add car
                        </Button>
                        <Select defaultValue="id-desc" onValueChange={handleSortChange}>
                            <SelectTrigger
                                className="w-48 transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <SelectItem value="id-desc" className="hover:bg-blue-50 transition-colors duration-150">
                                    Newest to Latest
                                </SelectItem>
                                <SelectItem value="id-asc" className="hover:bg-blue-50 transition-colors duration-150">
                                    Oldest to Newest
                                </SelectItem>
                                <SelectItem value="basePrice-desc" className="hover:bg-blue-50 transition-colors duration-150">
                                    Price: High to Low
                                </SelectItem>
                                <SelectItem value="basePrice-asc" className="hover:bg-blue-50 transition-colors duration-150">
                                    Price: Low to High
                                </SelectItem>
                                <SelectItem value="brand-asc" className="hover:bg-blue-50 transition-colors duration-150">
                                    Brand: A to Z
                                </SelectItem>
                                <SelectItem value="brand-desc" className="hover:bg-blue-50 transition-colors duration-150">
                                    Brand: Z to A
                                </SelectItem>
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
                {cars && (
                    <div
                        className={`space-y-4 transition-all duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
                        {cars.length === 0 ? (
                            <div className="text-center py-12 animate-in fade-in duration-500">
                                <p className="text-gray-500 mb-4">Not Found Any Car</p>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
                                >
                                    Add Your First Car!
                                </Button>
                            </div>
                        ) : (
                            cars.map((car: CarVO_ViewACar, index: number) => (
                                <Card
                                    key={car.id}
                                    className="bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-in fade-in slide-in-from-bottom"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex gap-6">
                                            {/* Navigation Arrow Left */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="self-center transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>

                                            {/* Car Image */}
                                            <div
                                                className="relative w-64 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg overflow-hidden group"
                                            >
                                                {car.carImageFront ? (
                                                    <img
                                                        src={car.carImageFront || "/placeholder.svg"}
                                                        alt={`${car.brand} ${car.model}`}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-full h-full relative">
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center"
                                                            >
                                                                <div
                                                                    className="w-32 h-32 border border-gray-400 transform rotate-45 transition-transform duration-500 group-hover:rotate-90"
                                                                ></div>
                                                                <div
                                                                    className="absolute w-32 h-32 border border-gray-400 transform -rotate-45 transition-transform duration-500 group-hover:-rotate-90"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Dots indicator */}
                                                <div
                                                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
                                                >
                                                    <div
                                                        className="w-2 h-2 bg-gray-800 rounded-full transition-all duration-200"
                                                    ></div>
                                                    <div
                                                        className="w-2 h-2 bg-gray-400 rounded-full transition-all duration-200 hover:bg-gray-600"
                                                    ></div>
                                                    <div
                                                        className="w-2 h-2 bg-gray-400 rounded-full transition-all duration-200 hover:bg-gray-600"
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Navigation Arrow Right */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="self-center transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>

                                            {/* Car Details */}
                                            <div className="flex-1 space-y-3">
                                                <h3 className="text-xl font-semibold transition-colors duration-200 hover:text-blue-600">
                                                    {car.brand} {car.model} {car.productionYear}
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div
                                                        className="transition-all duration-200 hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium">Ratings:</span>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className="h-4 w-4 text-gray-300 transition-colors duration-200 hover:text-yellow-400"
                                                                />
                                                            ))}
                                                            <span className="text-gray-500 ml-2">No ratings yet</span>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="transition-all duration-200 hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium">No. of rides:</span>
                                                        <div className="mt-1 font-semibold text-blue-600">0</div>
                                                    </div>

                                                    <div
                                                        className="transition-all duration-200 hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium">Price:</span>
                                                        <div
                                                            className="mt-1 font-semibold text-green-600"
                                                        >
                                                            {formatPrice(car.basePrice)}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="transition-all duration-200 hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium">Locations:</span>
                                                        <div
                                                            className="mt-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                        >
                                                            {formatLocation(car)}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="transition-all duration-200 hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium">Seats:</span>
                                                        <div className="mt-1">{car.numberOfSeats} seats</div>
                                                    </div>

                                                    <div
                                                        className="transition-all duration-200 hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <span className="font-medium">Status:</span>
                                                        <div className="mt-1">
                                                            <Badge {...getStatusBadgeProps(car.status)}>
                                                                {car.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    onClick={() => handleViewDetails(String(car.id))}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                >
                                                    View details
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                >
                                                    Confirm deposit
                                                </Button>
                                                {car.status.toLowerCase() === "booked" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                    >
                                                        Confirm payment
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination?.totalPages && pagination.totalPages > 1 && (
                    <div
                        className="flex justify-between items-center mt-8 animate-in fade-in slide-in-from-bottom duration-500"
                    >
                        <div className="flex items-center gap-2">{renderPaginationButtons()}</div>

                        <div className="flex items-center gap-2">
                            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                <SelectTrigger
                                    className="w-20 transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <SelectItem value="5" className="hover:bg-blue-50 transition-colors duration-150">
                                        5
                                    </SelectItem>
                                    <SelectItem value="10" className="hover:bg-blue-50 transition-colors duration-150">
                                        10
                                    </SelectItem>
                                    <SelectItem value="20" className="hover:bg-blue-50 transition-colors duration-150">
                                        20
                                    </SelectItem>
                                    <SelectItem value="50" className="hover:bg-blue-50 transition-colors duration-150">
                                        50
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-600">per page</span>
                        </div>
                    </div>
                )}

                {/* Pagination Info */}
                {cars && (
                    <div className="text-center mt-4 text-sm text-gray-600 animate-in fade-in duration-500">
                        Showing {(pagination?.pageNumber ? (pagination.pageNumber - 1) * pagination.pageSize + 1 : 0)} to{" "}
                        {pagination?.pageNumber ? Math.min((pagination.pageNumber ?? 0) * (pagination.pageSize ?? 0), pagination.totalRecords ?? 0) : 0} of {pagination?.totalRecords ?? 0}{" "}
                        cars
                    </div>
                )}
            </div>
        </div>
    )
}