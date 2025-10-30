"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, AlertCircle, Loader2, Check } from "lucide-react"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/lib/services/local-api/address-api"
import {AddCarDTO} from "@/lib/services/car-api";

interface DetailsStepProps {
    carData: AddCarDTO
    updateCarData: (updates: Partial<AddCarDTO>) => void
    onNext: () => void
    onPrev: () => void
}

export default function DetailsStep({ carData, updateCarData, onNext, onPrev }: DetailsStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    // API queries
    const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery()
    const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(
        carData.Address.ProvinceCode || 0,
        {
            skip: !carData.Address.ProvinceCode,
        },
    )
    const { data: wards = [], isLoading: wardsLoading } = useGetWardsQuery(carData.Address.DistrictCode || 0, {
        skip: !carData.Address.DistrictCode,
    })

    const handleAddressChange = (field: keyof AddCarDTO["Address"], value: string | number | null) => {
        updateCarData({
            Address: {
                ...carData.Address,
                [field]: value,
            },
        })
    }

    const handleProvinceChange = (provinceCode: string) => {
        const selectedProvince = provinces.find((p) => p.code === Number.parseInt(provinceCode))
        if (selectedProvince) {
            updateCarData({
                Address: {
                    ...carData.Address,
                    ProvinceCode: selectedProvince.code,
                    ProvinceName: selectedProvince.name,
                    // Reset district and ward when province changes
                    DistrictCode: null,
                    DistrictName: "",
                    WardCode: null,
                    WardName: "",
                },
            })
        }
    }

    const handleDistrictChange = (districtCode: string) => {
        const selectedDistrict = districts.find((d) => d.code === Number.parseInt(districtCode))
        if (selectedDistrict) {
            updateCarData({
                Address: {
                    ...carData.Address,
                    DistrictCode: selectedDistrict.code,
                    DistrictName: selectedDistrict.name,
                    // Reset ward when district changes
                    WardCode: null,
                    WardName: "",
                },
            })
        }
    }

    const handleWardChange = (wardCode: string) => {
        const selectedWard = wards.find((w) => w.code === Number.parseInt(wardCode))
        if (selectedWard) {
            updateCarData({
                Address: {
                    ...carData.Address,
                    WardCode: selectedWard.code,
                    WardName: selectedWard.name,
                },
            })
        }
    }

    const handleFunctionChange = (field: keyof AddCarDTO["AdditionalFunctions"], checked: boolean) => {
        updateCarData({
            AdditionalFunctions: {
                ...carData.AdditionalFunctions,
                [field]: checked,
            },
        })
    }

    const handleImageUpload = (field: keyof AddCarDTO["Images"], file: File | null) => {
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
        if (!carData.Address.Search.trim() && !carData.Address.ProvinceCode) {
            newErrors.Address = "Address is required"
        }

        // Validate required images
        if (!carData.Images.Front) {
            newErrors.FrontImage = "Front image is required"
        }
        if (!carData.Images.Back) {
            newErrors.BackImage = "Back image is required"
        }
        if (!carData.Images.Left) {
            newErrors.LeftImage = "Left image is required"
        }
        if (!carData.Images.Right) {
            newErrors.RightImage = "Right image is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateForm()) {
            onNext()
        }
    }

    const getFieldClassName = (value: string, errorKey: string) => {
        if (value.trim()) {
            return "border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-200"
        }
        if (errors[errorKey]) {
            return "border-red-500 focus:border-red-500 focus:ring-red-200"
        }
        return "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
    }

    const isAddressComplete = () => {
        return carData.Address.Search.trim() || carData.Address.ProvinceCode
    }

    const ImageUploadArea = ({
                                 title,
                                 field,
                                 file,
                             }: {
        title: string
        field: keyof AddCarDTO["Images"]
        file: File | null
    }) => (
        <div className="text-center">
            <h4 className="font-medium text-gray-700 mb-2">{title} *</h4>
            <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    file
                        ? "border-green-300 bg-green-50"
                        : errors[`${field}Image`]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400"
                }`}
            >
                <Upload
                    className={`h-8 w-8 mx-auto mb-2 ${
                        file ? "text-green-500" : errors[`${field}Image`] ? "text-red-400" : "text-gray-400"
                    }`}
                />
                <p className={`text-sm mb-2 ${file ? "text-green-700" : "text-gray-600"}`}>
                    {file ? `✓ ${file.name}` : "Drag and drop"}
                </p>
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
                    {file ? "Change image" : "Select file"}
                </label>
            </div>
            {errors[`${field}Image`] && !file && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors[`${field}Image`]}
                </p>
            )}
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mileage */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="Mileage">Mileage: *</Label>
                        {carData.Mileage.trim() && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                    <Input
                        id="Mileage"
                        type="number"
                        value={carData.Mileage}
                        onChange={(e) => updateCarData({ Mileage: e.target.value })}
                        className={getFieldClassName(carData.Mileage, "Mileage")}
                    />
                    {errors.Mileage && !carData.Mileage.trim() && (
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
                <div className="flex items-center gap-2">
                    <Label>Address: *</Label>
                    {isAddressComplete() && <Check className="h-4 w-4 text-green-500" />}
                </div>

                {/* Address Search */}
                <div className="relative">
                    <Input
                        placeholder="Search for an address (optional if using dropdowns below)"
                        value={carData.Address.Search}
                        onChange={(e) => handleAddressChange("Search", e.target.value)}
                        className={`pr-10 ${getFieldClassName(carData.Address.Search, "Address")}`}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {errors.Address && !isAddressComplete() && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.Address}
                        </p>
                    )}
                </div>

                {/* Address Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Province/City */}
                    <div className="space-y-2">
                        <Label>Province/City</Label>
                        <Select
                            value={carData.Address.ProvinceCode?.toString() || ""}
                            onValueChange={handleProvinceChange}
                            disabled={provincesLoading}
                        >
                            <SelectTrigger
                                className={
                                    carData.Address.ProvinceCode
                                        ? "border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-200"
                                        : ""
                                }
                            >
                                <SelectValue placeholder={provincesLoading ? "Loading..." : "Select Province/City"} />
                            </SelectTrigger>
                            <SelectContent>
                                {provincesLoading ? (
                                    <SelectItem value="loading" disabled>
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading provinces...
                                        </div>
                                    </SelectItem>
                                ) : (
                                    provinces.map((province) => (
                                        <SelectItem key={province.code} value={province.code.toString()}>
                                            {province.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                        <Label>District</Label>
                        <Select
                            value={carData.Address.DistrictCode?.toString() || ""}
                            onValueChange={handleDistrictChange}
                            disabled={!carData.Address.ProvinceCode || districtsLoading}
                        >
                            <SelectTrigger
                                className={
                                    carData.Address.DistrictCode
                                        ? "border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-200"
                                        : ""
                                }
                            >
                                <SelectValue
                                    placeholder={
                                        !carData.Address.ProvinceCode
                                            ? "Select Province first"
                                            : districtsLoading
                                                ? "Loading..."
                                                : "Select District"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {districtsLoading ? (
                                    <SelectItem value="loading" disabled>
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading districts...
                                        </div>
                                    </SelectItem>
                                ) : (
                                    districts.map((district) => (
                                        <SelectItem key={district.code} value={district.code.toString()}>
                                            {district.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ward */}
                    <div className="space-y-2">
                        <Label>Ward</Label>
                        <Select
                            value={carData.Address.WardCode?.toString() || ""}
                            onValueChange={handleWardChange}
                            disabled={!carData.Address.DistrictCode || wardsLoading}
                        >
                            <SelectTrigger
                                className={
                                    carData.Address.WardCode
                                        ? "border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-200"
                                        : ""
                                }
                            >
                                <SelectValue
                                    placeholder={
                                        !carData.Address.DistrictCode
                                            ? "Select District first"
                                            : wardsLoading
                                                ? "Loading..."
                                                : "Select Ward"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {wardsLoading ? (
                                    <SelectItem value="loading" disabled>
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading wards...
                                        </div>
                                    </SelectItem>
                                ) : (
                                    wards.map((ward) => (
                                        <SelectItem key={ward.code} value={ward.code.toString()}>
                                            {ward.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* House Number */}
                <Input
                    placeholder="House number, Street"
                    value={carData.Address.HouseNumber}
                    onChange={(e) => handleAddressChange("HouseNumber", e.target.value)}
                />

                {/* Display selected address */}
                {(carData.Address.ProvinceName || carData.Address.DistrictName || carData.Address.WardName) && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium text-gray-700">Selected Address:</Label>
                        <p className="text-sm text-gray-600 mt-1">
                            {[
                                carData.Address.HouseNumber,
                                carData.Address.WardName,
                                carData.Address.DistrictName,
                                carData.Address.ProvinceName,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    </div>
                )}
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
                                checked={carData.AdditionalFunctions[item.key as keyof AddCarDTO["AdditionalFunctions"]]}
                                onCheckedChange={(checked) =>
                                    handleFunctionChange(item.key as keyof AddCarDTO["AdditionalFunctions"], checked as boolean)
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
                <div className="flex items-center gap-2">
                    <Label>Images: *</Label>
                    <span className="text-sm text-gray-500">(All 4 images are required)</span>
                    {carData.Images.Front && carData.Images.Back && carData.Images.Left && carData.Images.Right && (
                        <Check className="h-4 w-4 text-green-500" />
                    )}
                </div>
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
