"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, MoreHorizontal } from "lucide-react"
import { type CarFilters, type CarVO_ViewACar, useGetCarsQuery } from "@/lib/services/car-api"
import NoResult from "@/components/common/no-result"
import Breadcrumb from "@/components/common/breadcum"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LoadingPage from "@/components/common/loading"

// Define TypeScript interfaces for pagination
interface Pagination {
    pageNumber: number
    pageSize: number
    totalRecords: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

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
    const pageNumber = currentPage // Declare the variable before using it

    const { data, error, isLoading, isFetching } = useGetCarsQuery({
        accountId: useSelector((state: RootState) => state.user?.id || accountId),
        pageNumber: currentPage,
        pageSize,
        filters,
    })

    const cars: CarVO_ViewACar[] = data?.data.data || []
    const pagination: Pagination = data?.data.pagination || {
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
    }

    const handleViewDetails = (carId: string) => {
        router.push(`/car-owner/my-car/edit-car/${carId}`)
    }

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
        if (page < 1 || page > pagination.totalPages || page === currentPage) return
        setIsTransitioning(true)
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handlePageSizeChange = (size: string) => {
        const newSize = Number.parseInt(size)
        if (isNaN(newSize) || newSize <= 0) return
        setIsTransitioning(true)
        setPageSize(newSize)
        setCurrentPage(1)
        window.scrollTo({ top: 0, behavior: "smooth" })
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const formatPrice = (price: number) => {
        return `${(price / 1000).toFixed(0)}k/day`
    }

    const formatLocation = (car: CarVO_ViewACar) => {
        const parts = [car.ward, car.district, car.cityProvince].filter(Boolean)
        return parts.length > 0 ? parts.join(", ") : "Location not specified"
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

    const renderPagination = () => {
        const { pageNumber, totalPages } = pagination
        if (totalPages <= 1) return null

        const maxVisiblePages = 5
        let startPage = 1
        let endPage = totalPages

        if (totalPages > maxVisiblePages) {
            const halfVisible = Math.floor(maxVisiblePages / 2)

            if (pageNumber <= halfVisible) {
                endPage = maxVisiblePages
            } else if (pageNumber + halfVisible >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1
            } else {
                startPage = pageNumber - halfVisible
                endPage = pageNumber + halfVisible
            }
        }

        const pages = []

        // First page button
        pages.push(
            <Button
                key="first"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pageNumber === 1 || isFetching}
                className="h-10 px-3 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="First page"
            >
                <span className="text-xs font-medium">First</span>
            </Button>,
        )

        // Previous button
        pages.push(
            <Button
                key="prev"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={!pagination.hasPreviousPage || isFetching}
                className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>,
        )

        // First page + ellipsis (if needed)
        if (startPage > 1) {
            pages.push(
                <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                    1
                </Button>,
            )

            if (startPage > 2) {
                pages.push(
                    <div key="ellipsis-start" className="flex items-center justify-center h-10 w-10">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>,
                )
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    disabled={isFetching}
                    className={`h-10 w-10 p-0 transition-all duration-200 ${
                        i === pageNumber
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm"
                            : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                >
                    {i}
                </Button>,
            )
        }

        // Last page + ellipsis (if needed)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <div key="ellipsis-end" className="flex items-center justify-center h-10 w-10">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>,
                )
            }

            pages.push(
                <Button
                    key={totalPages}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                    {totalPages}
                </Button>,
            )
        }

        // Next button
        pages.push(
            <Button
                key="next"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={!pagination.hasNextPage || isFetching}
                className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>,
        )

        // Last page button
        pages.push(
            <Button
                key="last"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={pageNumber === totalPages || isFetching}
                className="h-10 px-3 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Last page"
            >
                <span className="text-xs font-medium">Last</span>
            </Button>,
        )

        return pages
    }

    const renderQuickJump = () => {
        const { pageNumber, totalPages } = pagination
        if (totalPages <= 5) return null

        const jumpOptions = []
        const jumpSize = Math.max(1, Math.floor(totalPages / 10))

        // Add quick jump buttons for every 10% of total pages
        for (let i = jumpSize; i < totalPages; i += jumpSize) {
            if (Math.abs(i - pageNumber) > 2) {
                jumpOptions.push(
                    <Button
                        key={`jump-${i}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                        {i}
                    </Button>,
                )
            }
        }

        if (jumpOptions.length === 0) return null

        return (
            <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500 mr-2">Quick jump:</span>
                {jumpOptions}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingPage />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
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
                    <h1 className="text-2xl font-bold transition-all duration-300">
                        List of Cars
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/car-owner/add-car">
                            <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                                Add car
                            </Button>
                        </Link>
                        <Link href="/car-owner/feedback">
                            <Button
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-200 hover:shadow-lg hover:scale-105 bg-transparent"
                            >
                                Feedback
                            </Button>
                        </Link>
                        <Select defaultValue="id-desc" onValueChange={handleSortChange}>
                            <SelectTrigger className="w-48 transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
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
                <div
                    className={`space-y-4 transition-opacity duration-300 ${
                        isTransitioning || isFetching ? "opacity-50" : "opacity-100"
                    }`}
                >
                    {cars.length === 0 ? (
                        <div className="text-center py-12 animate-in fade-in duration-500">
                            <p className="text-gray-500 mb-4">Not Found Any Car</p>
                            <Link href="/car-owner/add-car">
                                <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                                    Add Your First Car!
                                </Button>
                            </Link>
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
                                            disabled={true} // Placeholder: Implement image navigation
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        {/* Car Image */}
                                        <div className="relative w-64 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg overflow-hidden group">
                                            {car.carImageFront ? (
                                                <img
                                                    src={car.carImageFront || "/placeholder.svg"}
                                                    alt={`${car.brand} ${car.model}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-full h-full relative">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-32 h-32 border border-gray-400 transform rotate-45 transition-transform duration-500 group-hover:rotate-90"></div>
                                                            <div className="absolute w-32 h-32 border border-gray-400 transform -rotate-45 transition-transform duration-500 group-hover:-rotate-90"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Dots indicator (Placeholder: Implement image carousel) */}
                                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                                <div className="w-2 h-2 bg-gray-800 rounded-full transition-all duration-200"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full transition-all duration-200 hover:bg-gray-600"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full transition-all duration-200 hover:bg-gray-600"></div>
                                            </div>
                                        </div>

                                        {/* Navigation Arrow Right */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="self-center transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                                            disabled={true} // Placeholder: Implement image navigation
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>

                                        {/* Car Details */}
                                        <div className="flex-1 space-y-3">
                                            <h3 className="text-xl font-semibold transition-colors duration-200 hover:text-blue-600">
                                                {car.brand} {car.model} {car.productionYear}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="transition-all duration-200 hover:bg-gray-50 p-2 rounded">
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
                                                <div className="transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">No. of rides:</span>
                                                    <div className="mt-1 font-semibold text-blue-600">{car.numberOfSeats || 0}</div>
                                                </div>
                                                <div className="transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">Price:</span>
                                                    <div className="mt-1 font-semibold text-green-600">{formatPrice(car.basePrice)}</div>
                                                </div>
                                                <div className="transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">Locations:</span>
                                                    <div className="mt-1 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                                        {formatLocation(car)}
                                                    </div>
                                                </div>
                                                <div className="transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">Seats:</span>
                                                    <div className="mt-1">{car.numberOfSeats} seats</div>
                                                </div>
                                                <div className="transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">Status:</span>
                                                    <div className="mt-1">
                                                        <Badge {...getStatusBadgeProps(car.status)}>{car.status}</Badge>
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
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Improved Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                        {/* Pagination Bar */}
                        <div className="flex justify-center">
                            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                                {renderPagination()}
                            </div>
                        </div>

                        {/* Quick Jump */}
                        <div className="flex justify-center">{renderQuickJump()}</div>

                        {/* Page Size and Info */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Show</span>
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="w-20 h-8 text-sm border-gray-300 hover:border-blue-300 focus:border-blue-500 transition-all duration-200">
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
                                <span className="text-sm text-gray-600">cars per page</span>
                            </div>

                            {/* Pagination Info with Page Input */}
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Showing{" "}
                                    <span className="font-medium text-gray-900">
                    {(pagination.pageNumber - 1) * pagination.pageSize + 1}
                  </span>{" "}
                                    to{" "}
                                    <span className="font-medium text-gray-900">
                    {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalRecords)}
                  </span>{" "}
                                    of <span className="font-medium text-gray-900">{pagination.totalRecords}</span> cars
                                </div>

                                {/* Go to page input */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Go to:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={pagination.totalPages}
                                        placeholder={pageNumber.toString()}
                                        className="w-16 h-8 px-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition-all duration-200"
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                const value = Number.parseInt((e.target as HTMLInputElement).value)
                                                if (value >= 1 && value <= pagination.totalPages) {
                                                    handlePageChange(value)
                                                    ;(e.target as HTMLInputElement).value = ""
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
