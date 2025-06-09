"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle } from "lucide-react"
import { CarData } from "@/app/car-owner/add-car/page"

interface BasicInfoStepProps {
    carData: CarData
    updateCarData: (updates: Partial<CarData>) => void
    onNext: () => void
}

export default function BasicInfoStep({ carData, updateCarData, onNext }: BasicInfoStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleFileUpload = (field: keyof CarData["documents"], file: File | null) => {
        updateCarData({
            documents: {
                ...carData.documents,
                [field]: file,
            },
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!carData.licensePlate.trim()) newErrors.licensePlate = "License plate is required"
        if (!carData.brandName.trim()) newErrors.brandName = "Brand name is required"
        if (!carData.model.trim()) newErrors.model = "Model is required"
        if (!carData.productionYear.trim()) newErrors.productionYear = "Production year is required"
        if (!carData.color.trim()) newErrors.color = "Color is required"
        if (!carData.numberOfSeats.trim()) newErrors.numberOfSeats = "Number of seats is required"

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
        field: keyof CarData["documents"]
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
                    <Label htmlFor="licensePlate">License plate: *</Label>
                    <Input
                        id="licensePlate"
                        value={carData.licensePlate}
                        onChange={(e) => updateCarData({ licensePlate: e.target.value })}
                        className={errors.licensePlate ? "border-red-500" : ""}
                    />
                    {errors.licensePlate && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.licensePlate}
                        </p>
                    )}
                </div>

                {/* Color */}
                <div className="space-y-2">
                    <Label htmlFor="color">Color: *</Label>
                    <Select value={carData.color} onValueChange={(value) => updateCarData({ color: value })}>
                        <SelectTrigger className={errors.color ? "border-red-500" : ""}>
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
                    {errors.color && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.color}
                        </p>
                    )}
                </div>

                {/* Brand Name */}
                <div className="space-y-2">
                    <Label htmlFor="brandName">Brand name: *</Label>
                    <Select value={carData.brandName} onValueChange={(value) => updateCarData({ brandName: value })}>
                        <SelectTrigger className={errors.brandName ? "border-red-500" : ""}>
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
                    {errors.brandName && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.brandName}
                        </p>
                    )}
                </div>

                {/* Model */}
                <div className="space-y-2">
                    <Label htmlFor="model">Model: *</Label>
                    <Select value={carData.model} onValueChange={(value) => updateCarData({ model: value })}>
                        <SelectTrigger className={errors.model ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="audi-a1">Audi A1</SelectItem>
                            <SelectItem value="civic">Civic</SelectItem>
                            <SelectItem value="camry">Camry</SelectItem>
                            <SelectItem value="navara">Navara</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.model && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.model}
                        </p>
                    )}
                </div>

                {/* Production Year */}
                <div className="space-y-2">
                    <Label htmlFor="productionYear">Production year: *</Label>
                    <Select value={carData.productionYear} onValueChange={(value) => updateCarData({ productionYear: value })}>
                        <SelectTrigger className={errors.productionYear ? "border-red-500" : ""}>
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
                    {errors.productionYear && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.productionYear}
                        </p>
                    )}
                </div>

                {/* Number of Seats */}
                <div className="space-y-2">
                    <Label htmlFor="numberOfSeats">No. of seats: *</Label>
                    <Select value={carData.numberOfSeats} onValueChange={(value) => updateCarData({ numberOfSeats: value })}>
                        <SelectTrigger className={errors.numberOfSeats ? "border-red-500" : ""}>
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
                    {errors.numberOfSeats && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.numberOfSeats}
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
                                checked={carData.transmission === "automatic"}
                                onChange={(e) => updateCarData({ transmission: e.target.value })}
                                className="text-blue-600"
                            />
                            <span>Automatic</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="manual"
                                checked={carData.transmission === "manual"}
                                onChange={(e) => updateCarData({ transmission: e.target.value })}
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
                                checked={carData.fuel === "gasoline"}
                                onChange={(e) => updateCarData({ fuel: e.target.value })}
                                className="text-blue-600"
                            />
                            <span>Gasoline</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="diesel"
                                checked={carData.fuel === "diesel"}
                                onChange={(e) => updateCarData({ fuel: e.target.value })}
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
                        field="registrationPaper"
                        file={carData.documents.registrationPaper}
                    />
                    <FileUploadArea
                        title="Certificate of inspection"
                        field="certificateOfInspection"
                        file={carData.documents.certificateOfInspection}
                    />
                    <FileUploadArea title="Insurance" field="insurance" file={carData.documents.insurance} />
                </div>
                <p className="text-xs text-gray-500">File type: .doc, .docx, .pdf, .jpg, .jpeg, .png</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" className="text-gray-600">
                    Cancel
                </Button>
                <Button onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    )
}
