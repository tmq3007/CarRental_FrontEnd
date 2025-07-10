"use client"

import React, {useState} from "react"
import {toast} from "sonner"
import {CarUnverifiedFilters, CarVO_Full, useGetCarsQuery, useVerifyCarMutation} from "@/lib/services/dashboard-api";
import {Badge} from "@/components/ui/badge";
import {
    AlertTriangle,
    Calendar,
    Car,
    Check,
    CheckCircle,
    Eye,
    FileText,
    MapPin,
    Search,
    User, X,
    XCircle
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import LoadingPage from "@/components/common/loading";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

export default function CarVerification() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [filters, setFilters] = useState<CarUnverifiedFilters>({
        sortBy: "createdAt",
        sortDirection: "desc",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [isTransitioning, setIsTransitioning] = useState(false)

    const {
        data: cars,
        error,
        isLoading: loading,
    } = useGetCarsQuery({
        pageNumber: currentPage,
        pageSize,
        filters,
    })

    const pagination = cars?.data?.pagination;
    const handleSortChange = (value: string) => {
        setIsTransitioning(true)
        const [sortBy, sortDirection] = value.split("-")
        setFilters((prev) => ({
            ...prev,
            sortBy,
            sortDirection: sortDirection as "asc" | "desc",
        }))
        setCurrentPage(1)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handleFilterChange = (key: keyof CarUnverifiedFilters, value: string) => {
        setIsTransitioning(true)
        setFilters((prev) => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }))
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

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setFilters((prev) => ({...prev, search: value}))
        setCurrentPage(1)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString()} VND`
    }

    const [selectedCar, setSelectedCar] = useState<CarVO_Full | null>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isVerifying, setIsVerifying] = useState<string | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean
        title: string
        description: string
        action: () => void
        actionLabel: string
        variant: "default" | "destructive"
    } | null>(null)

    const [verifyCar, {isLoading: carVerifying}] = useVerifyCarMutation()

    // Handle car verification
    const handleVerifyCar = async (carId: string, approve: boolean) => {
        setIsVerifying(carId)
        const action = approve ? "approving" : "rejecting"
        const toastId = toast.loading(`${action} car...`)

        try {
            const response = await verifyCar({carId}).unwrap();

            window.location.reload();

            toast.success(`Car ${approve ? "approved" : "rejected"} successfully!`, {id: toastId})

            // Close dialog if it's open
            if (isViewDialogOpen && selectedCar?.id === carId) {
                setIsViewDialogOpen(false)
            }
        } catch (error) {
            console.error(`Error ${action} car:`, error)
            toast.error(`Failed to ${action} car. Please try again.`, {id: toastId})
        } finally {
            setIsVerifying(null)
            setConfirmDialog(null)
        }
    }

    // Handle car actions
    const handleCarAction = (action: string, carId: string) => {
        const car = cars?.data.data.find((c) => c.id === carId)
        if (!car) return

        switch (action) {
            case "view":
                setSelectedCar(car)
                setIsViewDialogOpen(true)
                break
            case "approve":
                setConfirmDialog({
                    isOpen: true,
                    title: "Approve Car",
                    description: `Are you sure you want to approve the ${car.brand} ${car.model} (${car.licensePlate})? This will make the car available for rental.`,
                    action: () => handleVerifyCar(carId, true),
                    actionLabel: "Approve Car",
                    variant: "default",
                })
                break
            default:
                console.log(`${action} car:`, carId)
        }
    }

    const getFullAddress = (car: CarVO_Full) => {
        const parts = [car.houseNumberStreet, car.ward, car.district, car.cityProvince].filter(Boolean)
        return parts.join(", ") || "Address not provided"
    }

    const getCarImages = (car: CarVO_Full) => {
        return [car.carImageFront, car.carImageBack, car.carImageLeft, car.carImageRight].filter(Boolean)
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

    if (loading || !cars?.data?.data) {
        return <LoadingPage/>
    }

    return (
        <>
            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold">Car Verification</h1>
                                <p className="text-gray-600 mt-1">
                                    Review and verify car listings awaiting approval
                                    {pagination?.totalRecords && ` (${pagination.totalRecords} pending)`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Pending Verification
                                </Badge>
                            </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="flex flex-wrap gap-4">
                            <div className="relative flex-1 min-w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by brand, model, license plate..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
                                />
                            </div>

                            <Select defaultValue="createdAt-desc" onValueChange={handleSortChange}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                    <SelectItem value="brand-asc">Brand A-Z</SelectItem>
                                    <SelectItem value="brand-desc">Brand Z-A</SelectItem>
                                    <SelectItem value="basePrice-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="basePrice-desc">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all" onValueChange={(value) => handleFilterChange("brand", value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Brands</SelectItem>
                                    <SelectItem value="toyota">Toyota</SelectItem>
                                    <SelectItem value="honda">Honda</SelectItem>
                                    <SelectItem value="ford">Ford</SelectItem>
                                    <SelectItem value="bmw">BMW</SelectItem>
                                    <SelectItem value="mercedes">Mercedes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <div className="text-red-600 text-center py-12">
                                <p>Error loading cars for verification</p>
                            </div>
                        )}

                        {/* Car Cards */}
                        <div className={`space-y-4 transition-all duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
                            {cars?.data.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No cars pending verification</p>
                                    <p className="text-sm text-gray-400">All cars have been reviewed</p>
                                </div>
                            ) : (
                                cars?.data.data.map((car, index) => (
                                    <Card
                                        key={car.id}
                                        className="bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                                    >
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                                {/* Car Image */}
                                                <div className="relative flex-shrink-0 self-center md:self-start">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                        {car.carImageFront ? (
                                                            <img
                                                                src={car.carImageFront || "/placeholder.svg"}
                                                                alt={`${car.brand} ${car.model}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Car className="h-8 w-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="absolute -top-2 -right-2">
                                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
                                                            Pending
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Car Details */}
                                                <div className="flex-1 space-y-3 md:space-y-4">
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                        <div className="text-center md:text-left">
                                                            <h3 className="text-lg md:text-xl font-semibold">
                                                                {car.brand} {car.model} {car.productionYear && `(${car.productionYear})`}
                                                            </h3>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center justify-center md:justify-start gap-1">
                                  <Car className="h-4 w-4" />
                                    {car.licensePlate || "No license plate"}
                                </span>
                                                                <span className="flex items-center justify-center md:justify-start gap-1">
                                  <MapPin className="h-4 w-4" />
                                                                    {car.cityProvince || "Location not specified"}
                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-center md:text-right">
                                                            <div className="text-xl md:text-2xl font-bold text-green-600">
                                                                {formatCurrency(car.basePrice)}/day
                                                            </div>
                                                            <div className="text-sm text-gray-500">Deposit: {formatCurrency(car.deposit)}</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                                                        <div className="text-center md:text-left">
                                                            <span className="text-gray-500">Color:</span>
                                                            <span className="ml-1 md:ml-2 font-medium block md:inline">
                                {car.color || "Not specified"}
                              </span>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <span className="text-gray-500">Seats:</span>
                                                            <span className="ml-1 md:ml-2 font-medium block md:inline">
                                {car.numberOfSeats || "N/A"}
                              </span>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <span className="text-gray-500">Transmission:</span>
                                                            <span className="ml-1 md:ml-2 font-medium block md:inline">
                                {car.isAutomatic === true ? "Automatic" : car.isAutomatic === false ? "Manual" : "N/A"}
                              </span>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <span className="text-gray-500">Fuel:</span>
                                                            <span className="ml-1 md:ml-2 font-medium block md:inline">
                                {car.isGasoline === true ? "Gasoline" : car.isGasoline === false ? "Diesel" : "N/A"}
                              </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-2 border-t gap-2">
                                                        <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                                                            <span>Submitted: {car.createdAt ? formatDate(car.createdAt) : "Unknown"}</span>
                                                            {car.updatedAt && (
                                                                <span className="block md:inline md:ml-4">Updated: {formatDate(car.updatedAt)}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-center md:justify-end gap-1 md:gap-2">
                                                            {/* Document verification status */}
                                                            <div className="flex items-center gap-1">
                                                                {car.insuranceUriIsVerified ? (
                                                                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                                                                )}
                                                                <span className="text-xs">Insurance</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {car.registrationPaperUriIsVerified ? (
                                                                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                                                                )}
                                                                <span className="text-xs">Registration</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {car.certificateOfInspectionUriIsVerified ? (
                                                                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                                                                )}
                                                                <span className="text-xs">Inspection</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-row md:flex-col gap-2 justify-center md:justify-start">
                                                    <Button
                                                        onClick={() => handleCarAction("view", car.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 md:flex-none text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        <span className="hidden sm:inline">View Details</span>
                                                        <span className="sm:hidden">View</span>
                                                    </Button>

                                                    <Button
                                                        onClick={() => handleCarAction("approve", car.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 md:flex-none text-green-600 border-green-600 hover:bg-green-50"
                                                        disabled={isVerifying === car.id}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        <span className="hidden sm:inline">
                              {isVerifying === car.id ? "Approving..." : "Approve"}
                            </span>
                                                        <span className="sm:hidden">{isVerifying === car.id ? "..." : "Approve"}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination?.totalPages && pagination.totalPages > 1 && (
                            <div className="flex justify-between items-center mt-8">
                                <div className="flex items-center gap-2">{renderPaginationButtons()}</div>
                                <div className="flex items-center gap-2">
                                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                        <SelectTrigger className="w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm text-gray-600">per page</span>
                                </div>
                            </div>
                        )}

                        {/* Pagination Info */}
                        {cars?.data && (
                            <div className="text-center mt-4 text-sm text-gray-600">
                                Showing {pagination?.pageNumber ? (pagination.pageNumber - 1) * pagination.pageSize + 1 : 0} to{" "}
                                {pagination?.pageNumber
                                    ? Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalRecords)
                                    : 0}{" "}
                                of {pagination?.totalRecords ?? 0} cars
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Car Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5"/>
                            Car Verification Details
                        </DialogTitle>
                        <DialogDescription>Review all car information before making a verification
                            decision</DialogDescription>
                    </DialogHeader>

                    {selectedCar && (
                        <div className="space-y-6">
                            {/* Car Header */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div
                                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {selectedCar.carImageFront ? (
                                        <img
                                            src={selectedCar.carImageFront || "/placeholder.svg"}
                                            alt={`${selectedCar.brand} ${selectedCar.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Car className="h-8 w-8 text-gray-400"/>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold">
                                        {selectedCar.brand} {selectedCar.model}{" "}
                                        {selectedCar.productionYear && `(${selectedCar.productionYear})`}
                                    </h3>
                                    <p className="text-gray-600">{selectedCar.licensePlate}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                            Pending Verification
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className="text-2xl font-bold text-green-600">{formatCurrency(selectedCar.basePrice)}/day
                                    </div>
                                    <div
                                        className="text-sm text-gray-500">Deposit: {formatCurrency(selectedCar.deposit)}</div>
                                </div>
                            </div>

                            {/* Car Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Car className="h-4 w-4"/>
                                            Vehicle Information
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Brand:</span>
                                                <span
                                                    className="font-medium">{selectedCar.brand || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Model:</span>
                                                <span
                                                    className="font-medium">{selectedCar.model || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Color:</span>
                                                <span
                                                    className="font-medium">{selectedCar.color || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Year:</span>
                                                <span
                                                    className="font-medium">{selectedCar.productionYear || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Seats:</span>
                                                <span
                                                    className="font-medium">{selectedCar.numberOfSeats || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Mileage:</span>
                                                <span className="font-medium">
                          {selectedCar.mileage ? `${selectedCar.mileage} km` : "Not specified"}
                        </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Transmission:</span>
                                                <span className="font-medium">
                          {selectedCar.isAutomatic === true
                              ? "Automatic"
                              : selectedCar.isAutomatic === false
                                  ? "Manual"
                                  : "Not specified"}
                        </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Fuel Type:</span>
                                                <span className="font-medium">
                          {selectedCar.isGasoline === true
                              ? "Gasoline"
                              : selectedCar.isGasoline === false
                                  ? "Diesel"
                                  : "Not specified"}
                        </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Location Information */}
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="h-4 w-4"/>
                                            Location Information
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">Full Address:</span>
                                                <p className="font-medium mt-1">{getFullAddress(selectedCar)}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Street:</span>
                                                <span
                                                    className="font-medium">{selectedCar.houseNumberStreet || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">Ward:</span>
                                                <span
                                                    className="font-medium">{selectedCar.ward || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">District:</span>
                                                <span
                                                    className="font-medium">{selectedCar.district || "Not specified"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">City/Province:</span>
                                                <span
                                                    className="font-medium">{selectedCar.cityProvince || "Not specified"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Documents Verification */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4"/>
                                        Document Verification Status
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Insurance</p>
                                                <p className="text-xs text-gray-500">Insurance document</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {selectedCar.insuranceUriIsVerified ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500"/>
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500"/>
                                                )}
                                                <span className="text-sm">
                          {selectedCar.insuranceUriIsVerified ? "Verified" : "Not Verified"}
                        </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Registration</p>
                                                <p className="text-xs text-gray-500">Registration paper</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {selectedCar.registrationPaperUriIsVerified ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500"/>
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500"/>
                                                )}
                                                <span className="text-sm">
                          {selectedCar.registrationPaperUriIsVerified ? "Verified" : "Not Verified"}
                        </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Inspection</p>
                                                <p className="text-xs text-gray-500">Certificate of inspection</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {selectedCar.certificateOfInspectionUriIsVerified ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500"/>
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500"/>
                                                )}
                                                <span className="text-sm">
                          {selectedCar.certificateOfInspectionUriIsVerified ? "Verified" : "Not Verified"}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Car Images */}
                            {getCarImages(selectedCar).length > 0 && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3">Car Images</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedCar.carImageFront && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Front</p>
                                                    <img
                                                        src={selectedCar.carImageFront || "/placeholder.svg"}
                                                        alt="Car front"
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            {selectedCar.carImageBack && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Back</p>
                                                    <img
                                                        src={selectedCar.carImageBack || "/placeholder.svg"}
                                                        alt="Car back"
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            {selectedCar.carImageLeft && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Left</p>
                                                    <img
                                                        src={selectedCar.carImageLeft || "/placeholder.svg"}
                                                        alt="Car left"
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            {selectedCar.carImageRight && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Right</p>
                                                    <img
                                                        src={selectedCar.carImageRight || "/placeholder.svg"}
                                                        alt="Car right"
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Description and Terms */}
                            {(selectedCar.description || selectedCar.termOfUse || selectedCar.additionalFunction) && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3">Additional Information</h4>
                                        <div className="space-y-3">
                                            {selectedCar.description && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Description:</p>
                                                    <p className="text-sm mt-1">{selectedCar.description}</p>
                                                </div>
                                            )}
                                            {selectedCar.termOfUse && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Terms of Use:</p>
                                                    <p className="text-sm mt-1">{selectedCar.termOfUse}</p>
                                                </div>
                                            )}
                                            {selectedCar.additionalFunction && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Additional
                                                        Functions:</p>
                                                    <p className="text-sm mt-1">{selectedCar.additionalFunction}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Timeline */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Calendar className="h-4 w-4"/>
                                        Timeline
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Submitted At</label>
                                            <p className="text-sm mt-1">
                                                {selectedCar.createdAt ? formatDate(selectedCar.createdAt) : "Unknown"}
                                            </p>
                                            {selectedCar.createdAt && (
                                                <p className="text-xs text-gray-400">{new Date(selectedCar.createdAt).toLocaleString()}</p>
                                            )}
                                        </div>
                                        {selectedCar.updatedAt && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Last
                                                    Updated</label>
                                                <p className="text-sm mt-1">{formatDate(selectedCar.updatedAt)}</p>
                                                <p className="text-xs text-gray-400">{new Date(selectedCar.updatedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div
                                className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleCarAction("approve", selectedCar.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isVerifying === selectedCar.id}
                                    >
                                        {isVerifying === selectedCar.id ? (
                                            "Approving..."
                                        ) : (
                                            <>
                                                <Check className="h-4 w-4 mr-1"/>
                                                Approve Car
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <Button onClick={() => setIsViewDialogOpen(false)} variant="outline">
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {confirmDialog && (
                <Dialog open={confirmDialog.isOpen} onOpenChange={() => setConfirmDialog(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{confirmDialog.title}</DialogTitle>
                            <DialogDescription>{confirmDialog.description}</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
                                Cancel
                            </Button>
                            <Button variant={confirmDialog.variant} onClick={confirmDialog.action} disabled={isVerifying !== null}>
                                {confirmDialog.actionLabel}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}