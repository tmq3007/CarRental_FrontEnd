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
import { ChevronLeft, ChevronRight, Star, ExternalLink, Search, Upload, X, Info } from "lucide-react"
import Link from "next/link"

export default function EditCarDetails({ carId }: { carId: string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [status, setStatus] = useState("Available")
    const [showOtherTermsInput, setShowOtherTermsInput] = useState(false)
    const [carData, setCarData] = useState<any>(null)
    const [formData, setFormData] = useState({
        mileage: "",
        fuelConsumption: "",
        houseNumberStreet: "",
        description: "",
        basePrice: "",
        requiredDeposit: "",
        otherTerms: "",
        cityProvince: "",
        district: "",
        ward: "",
    })

    const documents = [
        { id: 1, name: "Registration paper", status: "Verified", link: "File1.PDF" },
        { id: 2, name: "Certificate of inspection", status: "Verified", link: "File2.PDF" },
        { id: 3, name: "Insurance", status: "Not available", link: null },
    ]

    const images = [
        { id: 1, alt: "Car image 1" },
        { id: 2, alt: "Car image 2" },
        { id: 3, alt: "Car image 3" },
    ]

    // Fetch initial car data from server (mocked for now)
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`http://localhost:5227/api/Car/edit-car/${carId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCarData(data);
                    // Pre-fill form with server data where applicable
                    setFormData({
                        mileage: data.mileage?.toString() || "",
                        fuelConsumption: data.fuelConsumption?.toString() || "",
                        houseNumberStreet: data.houseNumberStreet || "",
                        description: data.description || "",
                        basePrice: data.basePrice?.toString() || "",
                        requiredDeposit: data.deposit?.toString() || "",
                        otherTerms: "",
                        cityProvince: data.cityProvince || "",
                        district: data.district || "",
                        ward: data.ward || "",
                    });
                    setStatus(data.status || "Available");
                }
            } catch (error) {
                console.error("Failed to fetch car data:", error);
            }
        };
        fetchCarData();
    }, [carId]);

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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSave = async () => {
        if (!carData) return;

        const payload = {
            ...carData, // Keep all original data
            mileage: formData.mileage || carData.mileage,
            fuelConsumption: formData.fuelConsumption || carData.fuelConsumption,
            houseNumberStreet: formData.houseNumberStreet || carData.houseNumberStreet,
            description: formData.description || carData.description,
            basePrice: formData.basePrice || carData.basePrice,
            deposit: formData.requiredDeposit || carData.deposit,
            cityProvince: formData.cityProvince || carData.cityProvince,
            district: formData.district || carData.district,
            ward: formData.ward || carData.ward,
            termOfUse: carData.termOfUse + (formData.otherTerms ? `, ${formData.otherTerms}` : ""), // Append other terms
            status: status, // Update status from select
            updatedAt: new Date().toISOString(), // Update timestamp
            // Keep other fields like images, documents, etc. from carData
        };

        try {
            const response = await fetch(`http://localhost:5227/api/Car/edit-car/${carId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Car details updated successfully!");
            } else {
                alert("Failed to update car details.");
            }
        } catch (error) {
            console.error("Error updating car details:", error);
            alert("An error occurred while saving.");
        }
    }

    if (!carData) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link href="/car-rental/public" className="text-blue-600 hover:underline transition-colors duration-200">
                        Home
                    </Link>
                    <span>{">"}</span>
                    <Link href="/my-car" className="text-blue-600 hover:underline transition-colors duration-200">
                        My car
                    </Link>
                    <span>{">"}</span>
                    <span>Edit details</span>
                </nav>

                {/* Page Title */}
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
                                                <div className="w-full h-full relative">
                                                    <div className="absolute inset-0 border border-gray-400"></div>
                                                    <div className="absolute top-0 left-0 w-full h-full">
                                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                            <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                        </svg>
                                                    </div>
                                                </div>
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{carData.brand} {carData.model}</h2>
                                <Button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 hover:scale-105">
                                    Confirm deposit
                                </Button>
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
                                <span className="text-gray-900">0</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Price:</span>
                                <span className="text-gray-900 font-semibold">{carData.basePrice}k/day</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Locations:</span>
                                <span className="text-gray-900">{carData.cityProvince}, {carData.district}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700">Status:</span>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32 transition-all duration-200 hover:border-blue-400">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Rented">Rented</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                                                value={carData.licensePlate}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="color">Color:</Label>
                                            <Input
                                                id="color"
                                                value={carData.color}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="brand">Brand name:</Label>
                                            <Input
                                                id="brand"
                                                value={carData.brand}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="model">Model:</Label>
                                            <Input
                                                id="model"
                                                value={carData.model}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="production-year">Production year:</Label>
                                            <Input
                                                id="production-year"
                                                value={carData.productionYear}
                                                className="transition-all duration-200 bg-gray-50"
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="seats">No. of seats:</Label>
                                            <Input
                                                id="seats"
                                                value={carData.numberOfSeats}
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
                                            <Select value={formData.cityProvince} onValueChange={(value) => handleSelectChange("cityProvince", value)}>
                                                <SelectTrigger className="transition-all duration-200 hover:border-blue-400">
                                                    <SelectValue placeholder="City/Province" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hanoi">Hanoi</SelectItem>
                                                    <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                                                    <SelectItem value="danang">Da Nang</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)}>
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
                                                { id: "childlock", label: "Child lock", defaultChecked: true },
                                                { id: "childseat", label: "Child seat", defaultChecked: true },
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
                                                        className="rounded transition-all duration-200 hover:scale-110"
                                                        defaultChecked={item.defaultChecked}
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
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Front</Label>
                                                <div className="relative aspect-[4/3] border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center hover:border-gray-400 transition-all duration-200 group">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                            <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                        </svg>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Back</Label>
                                                <div className="relative aspect-[4/3] border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center hover:border-gray-400 transition-all duration-200 group">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                            <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                        </svg>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Left</Label>
                                                <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center space-y-2 hover:border-gray-400 hover:bg-gray-100 transition-all duration-300 cursor-pointer group">
                                                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-600">Drag and drop</p>
                                                        <p className="text-sm text-gray-600">OR</p>
                                                        <Button
                                                            variant="link"
                                                            className="text-blue-600 p-0 h-auto hover:text-blue-800 transition-colors duration-200"
                                                        >
                                                            choose files
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Right</Label>
                                                <div className="relative aspect-[4/3] border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center hover:border-gray-400 transition-all duration-200 group">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                            <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                                                        </svg>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            Please include full 4 images of your vehicle
                                            <br />
                                            File type: .jpg, .jpeg, .png, .gif
                                        </p>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-6">
                                        <Button variant="outline" className="transition-all duration-200 hover:scale-105">
                                            Discard
                                        </Button>
                                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105">
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
                                                    name="requiredDeposit"
                                                    value={formData.requiredDeposit}
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
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                    defaultChecked
                                                />
                                                <Label htmlFor="no-smoking" className="text-sm cursor-pointer">
                                                    No smoking
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    id="no-food"
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                />
                                                <Label htmlFor="no-food" className="text-sm cursor-pointer">
                                                    No food in cars
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                                <input
                                                    type="checkbox"
                                                    id="no-pet"
                                                    className="rounded transition-all duration-200 hover:scale-110"
                                                    defaultChecked
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
                                        <Button variant="outline" className="transition-all duration-200 hover:scale-105">
                                            Discard
                                        </Button>
                                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105">
                                            Save
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}