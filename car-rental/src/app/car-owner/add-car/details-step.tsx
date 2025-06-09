"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, AlertCircle } from "lucide-react"
import { CarData } from "@/app/car-owner/add-car/page"

interface DetailsStepProps {
    carData: CarData
    updateCarData: (updates: Partial<CarData>) => void
    onNext: () => void
    onPrev: () => void
}

export default function DetailsStep({ carData, updateCarData, onNext, onPrev }: DetailsStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleAddressChange = (field: keyof CarData["address"], value: string) => {
        updateCarData({
            address: {
                ...carData.address,
                [field]: value,
            },
        })
    }

    const handleFunctionChange = (field: keyof CarData["additionalFunctions"], checked: boolean) => {
        updateCarData({
            additionalFunctions: {
                ...carData.additionalFunctions,
                [field]: checked,
            },
        })
    }

    const handleImageUpload = (field: keyof CarData["images"], file: File | null) => {
        updateCarData({
            images: {
                ...carData.images,
                [field]: file,
            },
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!carData.mileage.trim()) newErrors.mileage = "Mileage is required"
        if (!carData.address.search.trim()) newErrors.address = "Address is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateForm()) {
            onNext()
        }
    }

    const ImageUploadArea = ({
                                 title,
                                 field,
                                 file,
                             }: {
        title: string
        field: keyof CarData["images"]
        file: File | null
    }) => (
        <div className="text-center">
            <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">{file ? file.name : "Drag and drop"}</p>
                <p className="text-xs text-gray-500 mb-3">OR</p>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(e) => handleImageUpload(field, e.target.files?.[0] || null)}
                    className="hidden"
                    id={`image-${field}`}
                />
                <label
                    htmlFor={`image-${field}`}
                    className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm underline"
                >
                    Select file
                </label>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mileage */}
                <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage: *</Label>
                    <Input
                        id="mileage"
                        type="number"
                        value={carData.mileage}
                        onChange={(e) => updateCarData({ mileage: e.target.value })}
                        className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.mileage}
                        </p>
                    )}
                </div>

                {/* Fuel Consumption */}
                <div className="space-y-2">
                    <Label htmlFor="fuelConsumption">Fuel consumption:</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="fuelConsumption"
                            type="number"
                            value={carData.fuelConsumption}
                            onChange={(e) => updateCarData({ fuelConsumption: e.target.value })}
                            className="flex-1"
                        />
                        <span className="text-gray-600">liter/100 km</span>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
                <Label>Address: *</Label>

                {/* Address Search */}
                <div className="relative">
                    <Input
                        placeholder="Search for an address"
                        value={carData.address.search}
                        onChange={(e) => handleAddressChange("search", e.target.value)}
                        className={`pr-10 ${errors.address ? "border-red-500" : ""}`}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {errors.address && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.address}
                        </p>
                    )}
                </div>

                {/* Address Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        value={carData.address.cityProvince}
                        onValueChange={(value) => handleAddressChange("cityProvince", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="City/Province" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hanoi">Hanoi</SelectItem>
                            <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                            <SelectItem value="danang">Da Nang</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={carData.address.district} onValueChange={(value) => handleAddressChange("district", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="District" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cau-giay">Cau Giay</SelectItem>
                            <SelectItem value="dong-da">Dong Da</SelectItem>
                            <SelectItem value="ba-dinh">Ba Dinh</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={carData.address.ward} onValueChange={(value) => handleAddressChange("ward", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Ward" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dich-vong">Dich Vong</SelectItem>
                            <SelectItem value="nghia-do">Nghia Do</SelectItem>
                            <SelectItem value="mai-dich">Mai Dich</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* House Number */}
                <Input
                    placeholder="House number, Street"
                    value={carData.address.houseNumber}
                    onChange={(e) => handleAddressChange("houseNumber", e.target.value)}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description:</Label>
                <Textarea
                    id="description"
                    placeholder="Description of your vehicle"
                    value={carData.description}
                    onChange={(e) => updateCarData({ description: e.target.value })}
                    rows={4}
                />
            </div>

            {/* Additional Functions */}
            <div className="space-y-4">
                <Label>Additional functions:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { key: "bluetooth", label: "Bluetooth" },
                        { key: "sunRoof", label: "Sun roof" },
                        { key: "dvd", label: "DVD" },
                        { key: "gps", label: "GPS" },
                        { key: "childLock", label: "Child lock" },
                        { key: "usb", label: "USB" },
                        { key: "camera", label: "Camera" },
                        { key: "childSeat", label: "Child seat" },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                            <Checkbox
                                id={item.key}
                                checked={carData.additionalFunctions[item.key as keyof CarData["additionalFunctions"]]}
                                onCheckedChange={(checked) =>
                                    handleFunctionChange(item.key as keyof CarData["additionalFunctions"], checked as boolean)
                                }
                            />
                            <Label htmlFor={item.key} className="text-sm">
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
                <Label>Images: *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadArea title="Front" field="front" file={carData.images.front} />
                    <ImageUploadArea title="Back" field="back" file={carData.images.back} />
                    <ImageUploadArea title="Left" field="left" file={carData.images.left} />
                    <ImageUploadArea title="Right" field="right" file={carData.images.right} />
                </div>
                <p className="text-sm text-gray-600">Please include full 4 images of your vehicle</p>
                <p className="text-xs text-gray-500">File type: .jpg, .jpeg, .png, .gif</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" onClick={onPrev} className="text-gray-600">
                    Previous
                </Button>
                <Button onClick={handleNext} >
                    Next
                </Button>
            </div>
        </div>
    )
}
