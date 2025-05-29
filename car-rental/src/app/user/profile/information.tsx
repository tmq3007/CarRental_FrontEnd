"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle } from "lucide-react"
import type { UserProfile } from "@/lib/services/user-api"
import {
    validateFullName,
    validatePhoneNumber,
    validateNationalId,
    validateDrivingLicenseUri,
    validateHouseNumberStreet,
    validateWard,
    validateDistrict,
    validateCityProvince,
    validateDateOfBirth,
    validateUserProfile,
    hasValidationErrors,
} from "@/lib/validation/user-profile-validation"
import { useGetDistrictsQuery, useGetProvincesQuery, useGetWardsQuery } from "@/lib/services/local-api/address-api"

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
}

interface InformationProps {
    personalInfo: UserProfile | undefined
    onPersonalInfoChange: (field: string, value: string) => void
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSave: () => void
    onDiscard: () => void
}

export default function Information({
                                        personalInfo,
                                        onPersonalInfoChange,
                                        onFileUpload,
                                        onSave,
                                        onDiscard,
                                    }: InformationProps) {
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [isFormValid, setIsFormValid] = useState(false)
    const [initialCodes, setInitialCodes] = useState<{
        cityProvinceCode?: string
        districtCode?: string
        wardCode?: string
    }>({})

    // Fetch Provinces
    const { data: provinces = [] } = useGetProvincesQuery()

    // Map initial string values to codes when personalInfo and provinces are available
    useEffect(() => {
        if (!personalInfo || !provinces.length) return

        const province = provinces.find((p) => p.name === personalInfo.cityProvince)
        const cityProvinceCode = province ? String(province.code) : ""

        setInitialCodes((prev) => ({
            ...prev,
            cityProvinceCode,
        }))

        // Update personalInfo with the code
        if (cityProvinceCode && cityProvinceCode !== personalInfo.cityProvince) {
            onPersonalInfoChange("cityProvince", cityProvinceCode)
        }
    }, [personalInfo, provinces, onPersonalInfoChange])

    // Fetch Districts when cityProvince code is available
    const { data: districts = [] } = useGetDistrictsQuery(Number(initialCodes.cityProvinceCode), {
        skip: !initialCodes.cityProvinceCode,
    })

    // Map district name to code
    useEffect(() => {
        if (!personalInfo || !districts.length) return

        const district = districts.find((d) => d.name === personalInfo.district)
        const districtCode = district ? String(district.code) : ""

        setInitialCodes((prev) => ({
            ...prev,
            districtCode,
        }))

        if (districtCode && districtCode !== personalInfo.district) {
            onPersonalInfoChange("district", districtCode)
        }
    }, [personalInfo, districts, onPersonalInfoChange])

    // Fetch Wards when district code is available
    const { data: wards = [] } = useGetWardsQuery(Number(initialCodes.districtCode), {
        skip: !initialCodes.districtCode,
    })

    // Map ward name to code
    useEffect(() => {
        if (!personalInfo || !wards.length) return

        const ward = wards.find((w) => w.name === personalInfo.ward)
        const wardCode = ward ? String(ward.code) : ""

        setInitialCodes((prev) => ({
            ...prev,
            wardCode,
        }))

        if (wardCode && wardCode !== personalInfo.ward) {
            onPersonalInfoChange("ward", wardCode)
        }
    }, [personalInfo, wards, onPersonalInfoChange])

    // Real-time validation handler
    const handleFieldChange = (field: string, value: string) => {
        // Update the field value
        onPersonalInfoChange(field, value)

        // Validate the field
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
            // case "drivingLicenseUri":
            //     error = validateDrivingLicenseUri(value)
            //     break
            // case "houseNumberStreet":
            //     error = validateHouseNumberStreet(value)
            //     break
            // case "ward":
            //     error = validateWard(value)
            //     break
            // case "district":
            //     error = validateDistrict(value)
            //     break
            // case "cityProvince":
            //     error = validateCityProvince(value)
            //     break
            case "dateOfBirth":
                error = validateDateOfBirth(value)
                break
        }

        // Update errors state
        setErrors((prev) => ({
            ...prev,
            [field]: error,
        }))
    }

    // Check form validity
    useEffect(() => {
        if (!personalInfo) return

        const newErrors = validateUserProfile({
            fullName: personalInfo.fullName,
            phoneNumber: personalInfo.phoneNumber,
            nationalId: personalInfo.nationalId,
            drivingLicenseUri: personalInfo.drivingLicenseUri,
            houseNumberStreet: personalInfo.houseNumberStreet,
            ward: personalInfo.ward,
            district: personalInfo.district,
            cityProvince: personalInfo.cityProvince,
            dob: personalInfo.dob,
        })

        setErrors(newErrors)
        setIsFormValid(!hasValidationErrors(newErrors))
    }, [personalInfo])

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

                    <div>
                        <Label className="text-sm font-medium">Address:</Label>
                        <div className="space-y-2 mt-1">
                            <div>
                                <Input
                                    id="houseNumberStreet"
                                    value={personalInfo.houseNumberStreet || ""}
                                    onChange={(e) => handleFieldChange("houseNumberStreet", e.target.value)}
                                    className={errors.houseNumberStreet ? "border-red-500 focus:border-red-500" : ""}
                                    placeholder="Enter house number and street"
                                />
                                <ErrorMessage error={errors.houseNumberStreet} />
                            </div>

                            <div>
                                <Select
                                    onValueChange={(value) => handleFieldChange("ward", value)}
                                    value={initialCodes.wardCode || personalInfo.ward || ""}
                                >
                                    <SelectTrigger className={errors.ward ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select Ward" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map((ward) => (
                                            <SelectItem key={ward.code} value={String(ward.code)}>
                                                {ward.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ErrorMessage error={errors.ward} />
                            </div>

                            <div>
                                <Select
                                    onValueChange={(value) => {
                                        handleFieldChange("district", value)
                                        handleFieldChange("ward", "")
                                        setInitialCodes((prev) => ({ ...prev, wardCode: "" }))
                                    }}
                                    value={initialCodes.districtCode || personalInfo.district || ""}
                                >
                                    <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district.code} value={String(district.code)}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ErrorMessage error={errors.district} />
                            </div>

                            <div>
                                <Select
                                    value={initialCodes.cityProvinceCode || personalInfo.cityProvince || ""}
                                    onValueChange={(value) => {
                                        handleFieldChange("cityProvince", value)
                                        handleFieldChange("district", "")
                                        handleFieldChange("ward", "")
                                        setInitialCodes((prev) => ({
                                            ...prev,
                                            districtCode: "",
                                            wardCode: "",
                                        }))
                                    }}
                                >
                                    <SelectTrigger className={errors.cityProvince ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select Province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.code} value={String(province.code)}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ErrorMessage error={errors.cityProvince} />
                            </div>
                        </div>
                    </div>
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
                                value={personalInfo.dob || ""}
                                onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
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
                        <Label htmlFor="drivingLicense" className="text-sm font-medium">
                            Driving license:
                        </Label>
                        <div className="flex gap-2 mt-1">
                            <Input id="drivingLicense" type="file" onChange={onFileUpload} className="hidden" />
                            <div className="flex-1">
                                <Input
                                    value={personalInfo.drivingLicenseUri || ""}
                                    onChange={(e) => handleFieldChange("drivingLicenseUri", e.target.value)}
                                    placeholder="Enter URL or upload file"
                                    className={errors.drivingLicenseUri ? "border-red-500 focus:border-red-500" : ""}
                                />
                                <ErrorMessage error={errors.drivingLicenseUri} />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById("drivingLicense")?.click()}
                                className="px-3"
                            >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                            </Button>
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
                <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700" disabled={!isFormValid}>
                    Save
                </Button>
            </div>
        </div>
    )
}