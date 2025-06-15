"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle } from "lucide-react"
import type { CarData } from "@/app/car-owner/add-car/page"

interface BasicInfoStepProps {
    carData: CarData
    updateCarData: (updates: Partial<CarData>) => void
    onNext: () => void
}

export default function BasicInfoStep({ carData, updateCarData, onNext }: BasicInfoStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleFileUpload = (field: keyof CarData["Documents"], file: File | null) => {
        updateCarData({
            Documents: {
                ...carData.Documents,
                [field]: file,
            },
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!carData.LicensePlate.trim()) newErrors.LicensePlate = "License plate is required"
        if (!carData.BrandName.trim()) newErrors.BrandName = "Brand name is required"
        if (!carData.Model.trim()) newErrors.Model = "Model is required"
        if (!carData.ProductionYear.trim()) newErrors.ProductionYear = "Production year is required"
        if (!carData.Color.trim()) newErrors.Color = "Color is required"
        if (!carData.NumberOfSeats.trim()) newErrors.NumberOfSeats = "Number of seats is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateForm()) {
            onNext()
        }
    }

    const FileUploadArea = ({
                                title,
                                field,
                                file,
                            }: {
        title: string
        field: keyof CarData["Documents"]
        file: File | null
    }) => (
        <div className="text-center">
            <h4 className="font-medium text-gray-700 mb-2">{title}:</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">{file ? file.name : "Drag and drop"}</p>
                <p className="text-xs text-gray-500 mb-3">OR</p>
                <input
                    type="file"
                    accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
                    className="hidden"
                    id={`file-${field}`}
                />
                <label htmlFor={`file-${field}`} className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm underline">
                    Select file
                </label>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="bg-red-50 border-0 p-4 mb-4">
                <p className="text-sm text-red-700">
                    <strong>Note:</strong> Please check your information carefully, you'll not be able to change the basic details
                    of your car, which is based on the registration information
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License Plate */}
                <div className="space-y-2">
                    <Label htmlFor="LicensePlate">License plate: *</Label>
                    <Input
                        id="LicensePlate"
                        value={carData.LicensePlate}
                        onChange={(e) => updateCarData({ LicensePlate: e.target.value })}
                        className={errors.LicensePlate ? "border-red-500" : ""}
                    />
                    {errors.LicensePlate && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.LicensePlate}
                        </p>
                    )}
                </div>

                {/* Color */}
                <div className="space-y-2">
                    <Label htmlFor="Color">Color: *</Label>
                    <Select value={carData.Color} onValueChange={(value) => updateCarData({ Color: value })}>
                        <SelectTrigger className={errors.Color ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="gray">Gray</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.Color && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.Color}
                        </p>
                    )}
                </div>

                {/* Brand Name */}
                <div className="space-y-2">
                    <Label htmlFor="BrandName">Brand name: *</Label>
                    <Select value={carData.BrandName} onValueChange={(value) => updateCarData({ BrandName: value })}>
                        <SelectTrigger className={errors.BrandName ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="audi">Audi</SelectItem>
                            <SelectItem value="bmw">BMW</SelectItem>
                            <SelectItem value="honda">Honda</SelectItem>
                            <SelectItem value="toyota">Toyota</SelectItem>
                            <SelectItem value="nissan">Nissan</SelectItem>
                            <SelectItem value="ford">Ford</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.BrandName && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.BrandName}
                        </p>
                    )}
                </div>

                {/* Model */}
                <div className="space-y-2">
                    <Label htmlFor="Model">Model: *</Label>
                    <Select value={carData.Model} onValueChange={(value) => updateCarData({ Model: value })}>
                        <SelectTrigger className={errors.Model ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="audi-a1">Audi A1</SelectItem>
                            <SelectItem value="civic">Civic</SelectItem>
                            <SelectItem value="camry">Camry</SelectItem>
                            <SelectItem value="navara">Navara</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.Model && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.Model}
                        </p>
                    )}
                </div>

                {/* Production Year */}
                <div className="space-y-2">
                    <Label htmlFor="ProductionYear">Production year: *</Label>
                    <Select value={carData.ProductionYear} onValueChange={(value) => updateCarData({ ProductionYear: value })}>
                        <SelectTrigger className={errors.ProductionYear ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 25 }, (_, i) => 2024 - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.ProductionYear && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.ProductionYear}
                        </p>
                    )}
                </div>

                {/* Number of Seats */}
                <div className="space-y-2">
                    <Label htmlFor="NumberOfSeats">No. of seats: *</Label>
                    <Select value={carData.NumberOfSeats} onValueChange={(value) => updateCarData({ NumberOfSeats: value })}>
                        <SelectTrigger className={errors.NumberOfSeats ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select seats" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.NumberOfSeats && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.NumberOfSeats}
                        </p>
                    )}
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                    <Label>Transmission: *</Label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="automatic"
                                checked={carData.Transmission === "automatic"}
                                onChange={(e) => updateCarData({ Transmission: e.target.value })}
                                className="text-blue-600"
                            />
                            <span>Automatic</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="manual"
                                checked={carData.Transmission === "manual"}
                                onChange={(e) => updateCarData({ Transmission: e.target.value })}
                                className="text-blue-600"
                            />
                            <span>Manual</span>
                        </label>
                    </div>
                </div>

                {/* Fuel */}
                <div className="space-y-2">
                    <Label>Fuel: *</Label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="gasoline"
                                checked={carData.Fuel === "gasoline"}
                                onChange={(e) => updateCarData({ Fuel: e.target.value })}
                                className="text-blue-600"
                            />
                            <span>Gasoline</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="diesel"
                                checked={carData.Fuel === "diesel"}
                                onChange={(e) => updateCarData({ Fuel: e.target.value })}
                                className="text-blue-600"
                            />
                            <span>Diesel</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FileUploadArea
                        title="Registration paper"
                        field="RegistrationPaper"
                        file={carData.Documents.RegistrationPaper}
                    />
                    <FileUploadArea
                        title="Certificate of inspection"
                        field="CertificateOfInspection"
                        file={carData.Documents.CertificateOfInspection}
                    />
                    <FileUploadArea title="Insurance" field="Insurance" file={carData.Documents.Insurance} />
                </div>
                <p className="text-xs text-gray-500">File type: .doc, .docx, .pdf, .jpg, .jpeg, .png</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" className="text-gray-600">
                    Cancel
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Next
                </Button>
            </div>
        </div>
    )
}
