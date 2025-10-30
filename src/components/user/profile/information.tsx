"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, AlertCircle } from "lucide-react"
import type { UserProfile } from "@/lib/services/user-api"
import {
    validateFullName,
    validatePhoneNumber,
    validateNationalId,
    validateDateOfBirth,
    validateUserProfile,
    hasValidationErrors,
    validateEmail,
} from "@/lib/validation/user-profile-validation"
import { AddressComponent } from "@/components/common/address-input-information"

interface ValidationErrors {
    fullName?: string
    phoneNumber?: string
    nationalId?: string
    drivingLicenseUri?: string
    houseNumberStreet?: string
    ward?: string
    district?: string
    cityProvince?: string
    dob?: string
    email?: string
}

interface InformationProps {
    personalInfo: UserProfile | null
    onPersonalInfoChange: (field: string, value: string | File) => void
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSave: () => void
    onDiscard: () => void
    userId: string
}

export default function Information({
                                        personalInfo,
                                        onPersonalInfoChange,
                                        onFileUpload,
                                        onSave,
                                        onDiscard,
                                        userId,
                                    }: InformationProps) {
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [isFormValid, setIsFormValid] = useState(false)
    const [showSaving, setShowSaving] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleSave = () => {
        setShowSaving(true)
        onSave()

        setTimeout(() => {
            setShowSaving(false)
        }, 2000)
    }

    // General field change handler
    const handleFieldChange = (field: string, value: string) => {
        onPersonalInfoChange(field, value)

        let error: string | undefined
        switch (field) {
            case "fullName":
                error = validateFullName(value)
                break
            case "phoneNumber":
                error = validatePhoneNumber(value)
                break
            case "nationalId":
                error = validateNationalId(value)
                break
            case "dob":
                error = validateDateOfBirth(value)
                break
            case "email":
                error = validateEmail(value)
                break
        }

        setErrors((prev) => ({ ...prev, [field]: error }))
    }

    // Enhanced file upload handler
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)

            // Create URL for preview
            const fileUrl = URL.createObjectURL(file)

            // Update the personal info with the file and preview
            onPersonalInfoChange("drivingLicenseUri", file)
            onPersonalInfoChange("drivingLicensePreview", fileUrl)
        }
    }

    // Check form validity
    useEffect(() => {
        if (!personalInfo) return

        const newErrors = validateUserProfile({
            fullName: personalInfo.fullName,
            phoneNumber: personalInfo.phoneNumber,
            nationalId: personalInfo.nationalId,
            dob: personalInfo.dob,
            email: personalInfo.email,
        })

        setErrors(newErrors)
        setIsFormValid(!hasValidationErrors(newErrors))
    }, [personalInfo])

    // Format date for input
    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return ""

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString
        }

        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ""

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    const ErrorMessage = ({ error }: { error?: string }) => {
        if (!error) return null
        return (
            <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{error}</span>
            </div>
        )
    }

    if (!personalInfo) return null

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="fullName" className="text-sm font-medium">
                            Full Name: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            value={personalInfo.fullName || ""}
                            onChange={(e) => handleFieldChange("fullName", e.target.value)}
                            className={`mt-1 ${errors.fullName ? "border-red-500 focus:border-red-500" : ""}`}
                            placeholder="Enter your full name"
                        />
                        <ErrorMessage error={errors.fullName} />
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber" className="text-sm font-medium">
                            Phone number: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            value={personalInfo.phoneNumber || ""}
                            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                            className={`mt-1 ${errors.phoneNumber ? "border-red-500 focus:border-red-500" : ""}`}
                            placeholder="Enter your phone number"
                        />
                        <ErrorMessage error={errors.phoneNumber} />
                    </div>

                    <AddressComponent
                        mode="profile"
                        houseNumberStreet={personalInfo.houseNumberStreet}
                        cityProvince={personalInfo.cityProvince}
                        district={personalInfo.district}
                        ward={personalInfo.ward}
                        onHouseNumberStreetChange={(value) => onPersonalInfoChange("houseNumberStreet", value)}
                        onCityProvinceChange={(value) => onPersonalInfoChange("cityProvince", value)}
                        onDistrictChange={(value) => onPersonalInfoChange("district", value)}
                        onWardChange={(value) => onPersonalInfoChange("ward", value)}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                            Date of birth:
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formatDateForInput(personalInfo.dob)}
                                onChange={(e) => handleFieldChange("dob", e.target.value)}
                                className={`pr-10 ${errors.dob ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                        </div>
                        <ErrorMessage error={errors.dob} />
                    </div>

                    <div>
                        <Label htmlFor="nationalId" className="text-sm font-medium">
                            National ID No.: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="nationalId"
                            value={personalInfo.nationalId || ""}
                            onChange={(e) => handleFieldChange("nationalId", e.target.value)}
                            className={`mt-1 ${errors.nationalId ? "border-red-500 focus:border-red-500" : ""}`}
                            placeholder="Enter your national ID"
                        />
                        <ErrorMessage error={errors.nationalId} />
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            value={personalInfo.email || ""}
                            onChange={(e) => handleFieldChange("email", e.target.value)}
                            className={`mt-1 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                            placeholder="Enter your email"
                        />
                        <ErrorMessage error={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="drivingLicense" className="text-sm font-medium">
                            Driving license:
                        </Label>
                        <div className="space-y-3 mt-1">
                            {/* Hidden file input */}
                            <Input id="drivingLicense" type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />

                            {/* Upload button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("drivingLicense")?.click()}
                                className="w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {selectedFile || personalInfo.drivingLicenseUri ? "Change Image" : "Upload Image"}
                            </Button>

                            {/* Image preview */}
                            {(personalInfo.drivingLicensePreview || personalInfo.drivingLicenseUri) && (
                                <div className="border rounded-lg p-3 bg-gray-50">
                                    <img
                                        src={personalInfo.drivingLicensePreview || personalInfo.drivingLicenseUri || "/placeholder.svg"}
                                        alt="Driving license preview"
                                        className="w-full max-h-48 object-contain rounded-md"
                                        onError={(e) => {
                                            // Hide image if URL is invalid
                                            e.currentTarget.style.display = "none"
                                        }}
                                    />
                                    {personalInfo.drivingLicensePreview && (
                                        <p className="text-xs text-green-600 mt-2 text-center font-medium">✓ New image selected</p>
                                    )}
                                    {!personalInfo.drivingLicensePreview && personalInfo.drivingLicenseUri && (
                                        <p className="text-xs text-muted-foreground mt-2 text-center">Current driving license</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form validation summary */}
            {!isFormValid && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Please fix the validation errors above before saving.</span>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onDiscard}>
                    Discard
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={!isFormValid}>
                    {showSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    )
}
