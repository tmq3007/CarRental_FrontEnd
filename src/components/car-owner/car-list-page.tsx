"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface CarListPageProps {
    accountId: string
}

export default function CarListPage({ accountId }: CarListPageProps) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [goToPageInput, setGoToPageInput] = useState("")
    const [filters, setFilters] = useState<CarFilters>({
        sortBy: "id",
        sortDirection: "desc",
    })
    const [isTransitioning, setIsTransitioning] = useState(false)

    const pageSize = 5
    const maxVisiblePages = 5

    const { data, error, isLoading, isFetching } = useGetCarsQuery({
        accountId: useSelector((state: RootState) => state.user?.id || accountId),
        pageNumber: currentPage,
        pageSize,
        filters,
    })

    const safePagination = useMemo(() => {
        const raw = data?.data?.pagination
        if (!raw) {
            return {
                pageNumber: 1,
                pageSize: 5,
                totalRecords: 0,
                totalPages: 1,
                hasPreviousPage: false,
                hasNextPage: false,
            }
        }

        const totalPages = Math.max(1, raw.totalPages || 1)
        const validPageNumber = Math.min(Math.max(1, raw.pageNumber || 1), totalPages)

        return {
            ...raw,
            pageNumber: validPageNumber,
            pageSize: raw.pageSize || 5,
            totalPages,
            hasPreviousPage: validPageNumber > 1,
            hasNextPage: validPageNumber < totalPages,
        }
    }, [data?.data?.pagination])

    const cars: CarVO_ViewACar[] = data?.data?.data || []
    const { pageNumber: safePageNumber, totalPages, totalRecords, hasPreviousPage, hasNextPage } = safePagination

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

    const handlePageChange = useCallback(
        (page: number) => {
            if (page < 1 || page > totalPages || page === safePageNumber) return
            setIsTransitioning(true)
            setCurrentPage(page)
            setGoToPageInput("")
            window.scrollTo({ top: 0, behavior: "smooth" })
            setTimeout(() => setIsTransitioning(false), 300)
        },
        [safePageNumber, totalPages],
    )

    const handleGoToPage = useCallback(() => {
        const pageNum = Number.parseInt(goToPageInput, 10)
        if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
            setGoToPageInput("")
            return
        }
        handlePageChange(pageNum)
    }, [goToPageInput, totalPages, handlePageChange])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle arrow keys when not typing in input
            if (e.target instanceof HTMLInputElement) return

            if (e.key === "ArrowLeft" && hasPreviousPage) {
                e.preventDefault()
                handlePageChange(safePageNumber - 1)
            } else if (e.key === "ArrowRight" && hasNextPage) {
                e.preventDefault()
                handlePageChange(safePageNumber + 1)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [safePageNumber, hasPreviousPage, hasNextPage, handlePageChange])

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

    const renderPageButtons = () => {
        const buttons = []

        let startPage = Math.max(1, safePageNumber - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        // First page button
        if (startPage > 1) {
            buttons.push(
                <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={isFetching}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                    1
                </Button>,
            )

            if (startPage > 2) {
                buttons.push(
                    <div key="ellipsis-start" className="h-10 flex items-center px-2 text-gray-400">
                        <MoreHorizontal className="h-4 w-4" />
                    </div>,
                )
            }
        }

        // Page numbers in range
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={i === safePageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    disabled={isFetching}
                    className={`h-10 w-10 p-0 transition-all duration-200 ${
                        i === safePageNumber
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm"
                            : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    aria-current={i === safePageNumber ? "page" : undefined}
                >
                    {i}
                </Button>,
            )
        }

        // Last page button
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <div key="ellipsis-end" className="h-10 flex items-center px-2 text-gray-400">
                        <MoreHorizontal className="h-4 w-4" />
                    </div>,
                )
            }

            buttons.push(
                <Button
                    key={totalPages}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={isFetching}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                    {totalPages}
                </Button>,
            )
        }

        return buttons
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
                    <h1 className="text-2xl font-bold transition-all duration-300">List of Cars</h1>
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
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="self-center transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                                            disabled={true}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

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
                                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                                <div className="w-2 h-2 bg-gray-800 rounded-full transition-all duration-200"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full transition-all duration-200 hover:bg-gray-600"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full transition-all duration-200 hover:bg-gray-600"></div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="self-center transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                                            disabled={true}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>

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

                {totalPages > 0 && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                        {/* Main Pagination Controls */}
                        <div className="flex flex-col gap-4">
                            {/* Pagination Buttons */}
                            <div className="flex justify-center">
                                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                                    {/* Previous Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(safePageNumber - 1)}
                                        disabled={!hasPreviousPage || isFetching}
                                        className="h-10 px-3 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        title="Previous page (← key)"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>

                                    {/* Separator */}
                                    <div className="h-6 w-px bg-gray-200 mx-1"></div>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">{renderPageButtons()}</div>

                                    {/* Separator */}
                                    <div className="h-6 w-px bg-gray-200 mx-1"></div>

                                    {/* Next Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(safePageNumber + 1)}
                                        disabled={!hasNextPage || isFetching}
                                        className="h-10 px-3 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        title="Next page (→ key)"
                                        aria-label="Next page"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
