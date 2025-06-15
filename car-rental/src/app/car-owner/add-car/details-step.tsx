"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, AlertCircle } from "lucide-react"
import type { CarData } from "@/app/car-owner/add-car/page"

interface DetailsStepProps {
    carData: CarData
    updateCarData: (updates: Partial<CarData>) => void
    onNext: () => void
    onPrev: () => void
}

export default function DetailsStep({ carData, updateCarData, onNext, onPrev }: DetailsStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleAddressChange = (field: keyof CarData["Address"], value: string) => {
        updateCarData({
            Address: {
                ...carData.Address,
                [field]: value,
            },
        })
    }

    const handleFunctionChange = (field: keyof CarData["AdditionalFunctions"], checked: boolean) => {
        updateCarData({
            AdditionalFunctions: {
                ...carData.AdditionalFunctions,
                [field]: checked,
            },
        })
    }

    const handleImageUpload = (field: keyof CarData["Images"], file: File | null) => {
        updateCarData({
            Images: {
                ...carData.Images,
                [field]: file,
            },
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!carData.Mileage.trim()) newErrors.Mileage = "Mileage is required"
        if (!carData.Address.Search.trim()) newErrors.Address = "Address is required"

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
        field: keyof CarData["Images"]
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
                    <Label htmlFor="Mileage">Mileage: *</Label>
                    <Input
                        id="Mileage"
                        type="number"
                        value={carData.Mileage}
                        onChange={(e) => updateCarData({ Mileage: e.target.value })}
                        className={errors.Mileage ? "border-red-500" : ""}
                    />
                    {errors.Mileage && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.Mileage}
                        </p>
                    )}
                </div>

                {/* Fuel Consumption */}
                <div className="space-y-2">
                    <Label htmlFor="FuelConsumption">Fuel consumption:</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="FuelConsumption"
                            type="number"
                            value={carData.FuelConsumption}
                            onChange={(e) => updateCarData({ FuelConsumption: e.target.value })}
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
                        value={carData.Address.Search}
                        onChange={(e) => handleAddressChange("Search", e.target.value)}
                        className={`pr-10 ${errors.Address ? "border-red-500" : ""}`}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {errors.Address && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.Address}
                        </p>
                    )}
                </div>

                {/* Address Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        value={carData.Address.CityProvince}
                        onValueChange={(value) => handleAddressChange("CityProvince", value)}
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

                    <Select value={carData.Address.District} onValueChange={(value) => handleAddressChange("District", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="District" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cau-giay">Cau Giay</SelectItem>
                            <SelectItem value="dong-da">Dong Da</SelectItem>
                            <SelectItem value="ba-dinh">Ba Dinh</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={carData.Address.Ward} onValueChange={(value) => handleAddressChange("Ward", value)}>
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
                    value={carData.Address.HouseNumber}
                    onChange={(e) => handleAddressChange("HouseNumber", e.target.value)}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="Description">Description:</Label>
                <Textarea
                    id="Description"
                    placeholder="Description of your vehicle"
                    value={carData.Description}
                    onChange={(e) => updateCarData({ Description: e.target.value })}
                    rows={4}
                />
            </div>

            {/* Additional Functions */}
            <div className="space-y-4">
                <Label>Additional functions:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { key: "Bluetooth", label: "Bluetooth" },
                        { key: "SunRoof", label: "Sun roof" },
                        { key: "DVD", label: "DVD" },
                        { key: "GPS", label: "GPS" },
                        { key: "ChildLock", label: "Child lock" },
                        { key: "USB", label: "USB" },
                        { key: "Camera", label: "Camera" },
                        { key: "ChildSeat", label: "Child seat" },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                            <Checkbox
                                id={item.key}
                                checked={carData.AdditionalFunctions[item.key as keyof CarData["AdditionalFunctions"]]}
                                onCheckedChange={(checked) =>
                                    handleFunctionChange(item.key as keyof CarData["AdditionalFunctions"], checked as boolean)
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
                    <ImageUploadArea title="Front" field="Front" file={carData.Images.Front} />
                    <ImageUploadArea title="Back" field="Back" file={carData.Images.Back} />
                    <ImageUploadArea title="Left" field="Left" file={carData.Images.Left} />
                    <ImageUploadArea title="Right" field="Right" file={carData.Images.Right} />
                </div>
                <p className="text-sm text-gray-600">Please include full 4 images of your vehicle</p>
                <p className="text-xs text-gray-500">File type: .jpg, .jpeg, .png, .gif</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrev} className="text-gray-600">
                    Previous
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Next
                </Button>
            </div>
        </div>
    )
}
