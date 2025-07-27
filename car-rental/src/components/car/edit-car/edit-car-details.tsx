"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, ExternalLink, Search, X, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    useEditCarMutation,
    useGetCarDetailQuery,
    useGetBookingDetailsByCarIdQuery,
    useConfirmDepositMutation,
    type CarVO_Detail,
} from "@/lib/services/car-api"
import { useDispatch } from "react-redux"
import { setCarId, resetCarId } from "@/lib/slice/carSlice"
import ConfirmationDialog from "@/components/ui/confirmation-dialog" // Import the custom dialog

interface Document {
    id: number
    name: string
    status: string
    link: string | null
}

interface Image {
    id: number
    alt: string
    src: string
}

export default function EditCarDetails({ carId, initialData }: { carId: string; initialData: CarVO_Detail }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [status, setStatus] = useState("")
    const [showOtherTermsInput, setShowOtherTermsInput] = useState(false)
    const [carData, setCarData] = useState<CarVO_Detail>(initialData)
    const [isConfirmDepositDialogOpen, setIsConfirmDepositDialogOpen] = useState(false) // State for custom dialog
    const dispatch = useDispatch()

    // Fetch car details if not provided
    const {
        data: fetchedCarData,
        isLoading,
        isError,
    } = useGetCarDetailQuery(carId, {
        skip: !!initialData,
    })

    // Fetch booking details for the car
    const { data: bookingData, isLoading: isLoadingBooking } = useGetBookingDetailsByCarIdQuery(carId)
    const [confirmDeposit, { isLoading: isConfirmingDeposit }] = useConfirmDepositMutation()

    const [formData, setFormData] = useState({
        mileage: "",
        fuelConsumption: "",
        houseNumberStreet: "",
        description: "",
        basePrice: "",
        deposit: "",
        otherTerms: "",
        cityProvince: "",
        district: "",
        ward: "",
    })

    const documents: Document[] = [
        {
            id: 1,
            name: "Registration paper",
            status: carData.registrationPaperUriIsVerified ? "Verified" : "Pending",
            link: carData.registrationPaperUri || null,
        },
        {
            id: 2,
            name: "Certificate of inspection",
            status: carData.certificateOfInspectionUriIsVerified ? "Verified" : "Pending",
            link: carData.certificateOfInspectionUri || null,
        },
        {
            id: 3,
            name: "Insurance",
            status: carData.insuranceUriIsVerified ? "Verified" : "Pending",
            link: carData.insuranceUri || null,
        },
    ]

    const images: Image[] = [
        { id: 1, alt: "Car image front", src: carData.carImageFront || "" },
        { id: 2, alt: "Car image back", src: carData.carImageBack || "" },
        { id: 3, alt: "Car image left", src: carData.carImageLeft || "" },
        { id: 4, alt: "Car image right", src: carData.carImageRight || "" },
    ]

    useEffect(() => {
        // Set car ID in Redux
        dispatch(setCarId(carId))
        return () => {
            dispatch(resetCarId())
        }
    }, [carId, dispatch])

    useEffect(() => {
        const data = initialData || fetchedCarData?.data
        if (data) {
            setCarData(data)
            setStatus(data.status || "verified")
            setFormData({
                mileage: data.mileage?.toString() || "",
                fuelConsumption: data.fuelConsumption?.toString() || "",
                houseNumberStreet: data.houseNumberStreet || "",
                description: data.description || "",
                basePrice: data.basePrice?.toString() || "",
                deposit: data.deposit?.toString() || "",
                otherTerms: data.additionalFunction || "",
                cityProvince: data.cityProvince || "",
                district: data.district || "",
                ward: data.ward || "",
            })
        }
    }, [initialData, fetchedCarData])

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const handleOtherTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowOtherTermsInput(e.target.checked)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const router = useRouter()
    const [editCar] = useEditCarMutation()

    const handleSave = async () => {
        const payload: Partial<CarVO_Detail> = {
            mileage: Number(formData.mileage) || carData.mileage,
            fuelConsumption: Number(formData.fuelConsumption) || carData.fuelConsumption,
            houseNumberStreet: formData.houseNumberStreet || carData.houseNumberStreet,
            description: formData.description || carData.description,
            basePrice: Number(formData.basePrice) || carData.basePrice,
            deposit: Number(formData.deposit) || carData.deposit,
            cityProvince: formData.cityProvince || carData.cityProvince,
            district: formData.district || carData.district,
            ward: formData.ward || carData.ward,
            additionalFunction: formData.otherTerms || carData.additionalFunction,
            status: status,
        }
        try {
            const response = await editCar({
                id: carId,
                payload,
            }).unwrap()
            if (response.data) {
                alert("Car updated successfully")
                router.push("/car-owner/my-car")
            }
        } catch (error: any) {
            console.error("Update failed", error)
            alert(error?.data?.message || "Failed to update the car")
        }
    }

    // Function to open the custom confirmation dialog
    const handleConfirmDepositClick = () => {
        setIsConfirmDepositDialogOpen(true)
    }

    // Function to handle the "Yes" action in the custom confirmation dialog
    const handleConfirmDepositAction = async () => {
        if (!bookingData?.data?.bookingNumber) return
        try {
            const response = await confirmDeposit(bookingData.data.bookingNumber).unwrap()
            if (response.data) {
                alert("Deposit confirmed successfully")
                router.refresh() // Reload the page to reflect updated data [^1]
            }
        } catch (error: any) {
            console.error("Confirm deposit failed", error)
            alert(error?.data?.message || "Failed to confirm deposit")
        } finally {
            setIsConfirmDepositDialogOpen(false)
        }
    }

    if (isLoading && !initialData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if (isError) return <div className="min-h-screen flex items-center justify-center">Error loading car details</div>
    if (!carData) return <div className="min-h-screen flex items-center justify-center">No car data found</div>

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link href="/car-rental/public" className="text-blue-600 hover:underline transition-colors duration-200">
                        Home
                    </Link>
                    <span>{">"}</span>
                    <Link href="/car-owner/my-car" className="text-blue-600 hover:underline transition-colors duration-200">
                        My car
                    </Link>
                    <span>{">"}</span>
                    <span>Edit details</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit car details</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image Gallery */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/3] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    <div
                                        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                    >
                                        {images.map((image, index) => (
                                            <div key={image.id} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                                                {image.src ? (
                                                    <img
                                                        src={image.src || "/placeholder.svg"}
                                                        alt={image.alt}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full relative">
                                                        <div className="absolute inset-0 border border-gray-400"></div>
                                                        <div className="absolute top-0 left-0 w-full h-full">
                                                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                                <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-center space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex ? "bg-gray-800 scale-125" : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Right Column - Car Details */}
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {carData.brand} {carData.model}
                                </h2>
                                {bookingData?.data?.status === "pending_deposit" && (
                                    <Button
                                        onClick={handleConfirmDepositClick} // Trigger custom dialog
                                        disabled={isConfirmingDeposit || isLoadingBooking}
                                        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 hover:scale-105 disabled:opacity-50"
                                    >
                                        {isConfirmingDeposit ? "Confirming..." : "Confirm deposit"}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Ratings:</span>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="h-4 w-4 text-gray-300 hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">(No ratings yet)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">No. of rides:</span>
                                <span className="text-gray-900">{carData.numberOfRides || 0}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Price:</span>
                                <span className="text-gray-900 font-semibold">
                  {carData.basePrice ? `${carData.basePrice}k/day` : "N/A"}
                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Locations:</span>
                                <span className="text-gray-900">
                  {[carData.ward, carData.district, carData.cityProvince].filter(Boolean).join(", ") || "N/A"}
                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Status:</span>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32 transition-all duration-200 hover:border-blue-400">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="verified">Verified</SelectItem>
                                        <SelectItem value="not_verified">Not Verified</SelectItem>
                                        <SelectItem value="stopped">Stopped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Display booking status if available */}
                            {bookingData?.data && (
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-700">Booking Status:</span>
                                    <Badge
                                        variant={bookingData.data.status === "pending_deposit" ? "outline" : "default"}
                                        className={`transition-all duration-200 ${
                                            bookingData.data.status === "pending_deposit"
                                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                : bookingData.data.status === "confirmed"
                                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                                    : bookingData.data.status === "in_progress"
                                                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                    >
                                        {bookingData.data.status}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-md bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger
                                value="basic"
                                className="transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:scale-105 hover:bg-gray-50"
                            >
                                Basic Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:scale-105 hover:bg-gray-50"
                            >
                                Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="pricing"
                                className="transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:scale-105 hover:bg-gray-50"
                            >
                                Pricing
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="basic" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                            <Card className="transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6">
                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start space-x-3">
                                        <Info className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-yellow-700">
                                            Note: Please contact us if you'd need to update your car's basic information
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="license-plate">License plate:</Label>
                                            <Input
                                                id="license-plate"
                                                value={carData.licensePlate || ""}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="color">Color:</Label>
                                            <Input
                                                id="color"
                                                value={carData.color || ""}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="brand">Brand name:</Label>
                                            <Input
                                                id="brand"
                                                value={carData.brand || ""}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="model">Model:</Label>
                                            <Input
                                                id="model"
                                                value={carData.model || ""}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="production-year">Production year:</Label>
                                            <Input
                                                id="production-year"
                                                value={carData.productionYear?.toString() || ""}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="seats">No. of seats:</Label>
                                            <Input
                                                id="seats"
                                                value={carData.numberOfSeats?.toString() || ""}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="transmission">Transmission:</Label>
                                            <Input
                                                id="transmission"
                                                value={carData.isAutomatic ? "Automatic" : "Manual"}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fuel">Fuel:</Label>
                                            <Input
                                                id="fuel"
                                                value={carData.isGasoline ? "Gasoline" : "Diesel"}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="mt-8 transition-all duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle>Documents:</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-4 py-2 text-left">No.</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Note</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Link</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {documents.map((doc) => (
                                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="border border-gray-300 px-4 py-2">{doc.id}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{doc.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <Badge
                                                            variant={doc.status === "Verified" ? "default" : "secondary"}
                                                            className={`transition-all duration-200 ${doc.status === "Verified" ? "bg-green-100 text-green-800 hover:bg-green-200" : "hover:bg-gray-200"}`}
                                                        >
                                                            {doc.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {doc.link ? (
                                                            <Link
                                                                href={`#${doc.link}`}
                                                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 transition-colors duration-200"
                                                            >
                                                                <span>{doc.link}</span>
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-gray-500">Not available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="details" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                            <Card className="transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="mileage">Mileage: *</Label>
                                            <Input
                                                id="mileage"
                                                name="mileage"
                                                value={formData.mileage}
                                                onChange={handleInputChange}
                                                placeholder="Enter mileage"
                                                className="transition-all duration-200 focus:scale-105"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fuel-consumption">Fuel consumption:</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    id="fuel-consumption"
                                                    name="fuelConsumption"
                                                    value={formData.fuelConsumption}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter consumption"
                                                    className="flex-1 transition-all duration-200 focus:scale-105"
                                                />
                                                <span className="text-sm text-gray-600">liter/100 km</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-base font-medium">Address: *</Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Search for an address"
                                                value={formData.houseNumberStreet}
                                                className="pr-10 transition-all duration-200 focus:scale-105"
                                                disabled
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Select
                                                value={formData.cityProvince}
                                                onValueChange={(value) => handleSelectChange("cityProvince", value)}
                                            >
                                                <SelectTrigger className="transition-all duration-200 hover:border-blue-400">
                                                    <SelectValue placeholder="City/Province" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hanoi">Hanoi</SelectItem>
                                                    <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                                                    <SelectItem value="danang">Da Nang</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select
                                                value={formData.district}
                                                onValueChange={(value) => handleSelectChange("district", value)}
                                            >
                                                <SelectTrigger className="transition-all duration-200 hover:border-blue-400">
                                                    <SelectValue placeholder="District" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cau-giay">Cau Giay</SelectItem>
                                                    <SelectItem value="dong-da">Dong Da</SelectItem>
                                                    <SelectItem value="ba-dinh">Ba Dinh</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={formData.ward} onValueChange={(value) => handleSelectChange("ward", value)}>
                                                <SelectTrigger className="transition-all duration-200 hover:border-blue-400">
                                                    <SelectValue placeholder="Ward" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ward1">Ward 1</SelectItem>
                                                    <SelectItem value="ward2">Ward 2</SelectItem>
                                                    <SelectItem value="ward3">Ward 3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Input
                                            name="houseNumberStreet"
                                            value={formData.houseNumberStreet}
                                            onChange={handleInputChange}
                                            placeholder="House number, Street"
                                            className="transition-all duration-200 focus:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description:</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Description of your vehicle"
                                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-base font-medium">Additional functions:</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {[
                                                { id: "bluetooth", label: "Bluetooth" },
                                                { id: "gps", label: "GPS" },
                                                { id: "camera", label: "Camera" },
                                                { id: "sunroof", label: "Sun roof" },
                                                { id: "dvd", label: "DVD" },
                                                { id: "usb", label: "USB" },
                                            ].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={item.id}
                                                        name={item.id}
                                                        className="rounded transition-all duration-200 hover:scale-110"
                                                        defaultChecked={carData.additionalFunction?.includes(item.label) || false}
                                                        onChange={handleInputChange}
                                                    />
                                                    <Label htmlFor={item.id} className="text-sm cursor-pointer">
                                                        {item.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-base font-medium">Images: *</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {["Front", "Back", "Left", "Right"].map((side, index) => (
                                                <div key={index} className="space-y-2">
                                                    <Label className="text-sm font-medium">{side}</Label>
                                                    <div className="relative aspect-[4/3] border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center hover:border-gray-400 transition-all duration-200 group">
                                                        {images[index].src ? (
                                                            <img
                                                                src={images[index].src || "/placeholder.svg"}
                                                                alt={images[index].alt}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                    <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                                    <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Please include full 4 images of your vehicle
                                            <br />
                                            File type: .jpg, .jpeg, .png, .gif
                                        </p>
                                    </div>
                                    <div className="flex justify-end space-x-4 pt-6">
                                        <Button variant="outline" className="transition-all duration-200 hover:scale-105 bg-transparent">
                                            Discard
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="pricing" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                            <Card className="transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="base-price">Base price per day: *</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    id="base-price"
                                                    name="basePrice"
                                                    value={formData.basePrice}
                                                    onChange={handleInputChange}
                                                    className="flex-1 transition-all duration-200 focus:scale-105"
                                                />
                                                <span className="text-sm text-gray-600 font-medium">VND/Day</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="required-deposit">Required deposit: *</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    id="required-deposit"
                                                    name="deposit"
                                                    value={formData.deposit}
                                                    onChange={handleInputChange}
                                                    className="flex-1 transition-all duration-200 focus:scale-105"
                                                />
                                                <span className="text-sm text-gray-600 font-medium">VND</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-base font-medium">Terms of use</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    id="no-smoking"
                                                    name="no-smoking"
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                    defaultChecked={carData?.termOfUse?.includes("No smoking") || false}
                                                    onChange={handleInputChange}
                                                />
                                                <Label htmlFor="no-smoking" className="text-sm cursor-pointer">
                                                    No smoking
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    id="no-food"
                                                    name="no-food"
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                    defaultChecked={carData?.termOfUse?.includes("No food") || false}
                                                    onChange={handleInputChange}
                                                />
                                                <Label htmlFor="no-food" className="text-sm cursor-pointer">
                                                    No food in cars
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    id="no-pet"
                                                    name="no-pet"
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                    defaultChecked={carData?.termOfUse?.includes("No pet") || false}
                                                    onChange={handleInputChange}
                                                />
                                                <Label htmlFor="no-pet" className="text-sm cursor-pointer">
                                                    No pet
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    id="other-terms"
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                    onChange={handleOtherTermsChange}
                                                />
                                                <Label htmlFor="other-terms" className="text-sm cursor-pointer">
                                                    Other
                                                </Label>
                                            </div>
                                        </div>
                                        {showOtherTermsInput && (
                                            <div className="mt-2">
                                                <Input
                                                    name="otherTerms"
                                                    value={formData.otherTerms}
                                                    onChange={handleInputChange}
                                                    placeholder="Please specify other terms"
                                                    className="transition-all duration-200 focus:scale-105"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-4 pt-6">
                                        <Button variant="outline" className="transition-all duration-200 hover:scale-105 bg-transparent">
                                            Discard
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            {/* Custom Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isConfirmDepositDialogOpen}
                onClose={() => setIsConfirmDepositDialogOpen(false)}
                onConfirm={handleConfirmDepositAction}
                title="Confirm deposit"
                description="Please confirm that you have received the deposit for this booking. This will allow the customer to pick-up the car at the agreed date and time."
            />
        </div>
    )
}
