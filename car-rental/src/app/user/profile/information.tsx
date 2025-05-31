"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle } from "lucide-react"
import {UserProfile, useUpdateUserProfileMutation} from "@/lib/services/user-api"
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
    userId: string,
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
    const [showSaving, setShowSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)


    const handleSave = () => {
        setShowSaving(true);
        onSave(); // Gọi hàm save từ props

        // Sau 2 giây sẽ tắt trạng thái "Saving..."
        setTimeout(() => {
            setShowSaving(false);
        }, 2000);
    };
    // Fetch Provinces
    const { data: provinces = [] } = useGetProvincesQuery()

    // Fetch Districts when cityProvince changes
    const { data: districts = [] } = useGetDistrictsQuery(
        provinces.find(p => p.name === personalInfo?.cityProvince)?.code || 0,
        { skip: !personalInfo?.cityProvince }
    )

    // Fetch Wards when district changes
    const { data: wards = [] } = useGetWardsQuery(
        districts.find(d => d.name === personalInfo?.district)?.code || 0,
        { skip: !personalInfo?.district }
    )

    // Find current selections by name
    const currentProvince = provinces.find(p => p.name === personalInfo?.cityProvince)
    const currentDistrict = districts.find(d => d.name === personalInfo?.district)
    const currentWard = wards.find(w => w.name === personalInfo?.ward)

    // Handlers for address changes
    const handleProvinceChange = (code: string) => {
        const selectedProvince = provinces.find(p => p.code.toString() === code)
        if (selectedProvince) {
            onPersonalInfoChange("cityProvince", selectedProvince.name)
            // Reset dependent fields
            onPersonalInfoChange("district", "")
            onPersonalInfoChange("ward", "")
        }
    }

    const handleDistrictChange = (code: string) => {
        const selectedDistrict = districts.find(d => d.code.toString() === code)
        if (selectedDistrict) {
            onPersonalInfoChange("district", selectedDistrict.name)
            // Reset dependent field
            onPersonalInfoChange("ward", "")
        }
    }

    const handleWardChange = (code: string) => {
        const selectedWard = wards.find(w => w.code.toString() === code)
        if (selectedWard) {
            onPersonalInfoChange("ward", selectedWard.name)
        }
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
            case "dateOfBirth":
                error = validateDateOfBirth(value)
                break
        }

        setErrors(prev => ({ ...prev, [field]: error }))
    }

    // Check form validity
    useEffect(() => {
        if (!personalInfo) return

        const newErrors = validateUserProfile({
            fullName: personalInfo.fullName,
            phoneNumber: personalInfo.phoneNumber,
            nationalId: personalInfo.nationalId,
            // drivingLicenseUri: personalInfo.drivingLicenseUri,
            // houseNumberStreet: personalInfo.houseNumberStreet,
            // ward: personalInfo.ward,
            // district: personalInfo.district,
            // cityProvince: personalInfo.cityProvince,
            dob: personalInfo.dob,
        })

        setErrors(newErrors)
        setIsFormValid(!hasValidationErrors(newErrors))
    }, [personalInfo])

    console.log("Errors:", errors)

    // Hàm này chuyển đổi date từ các định dạng khác nhau sang YYYY-MM-DD
    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return "";

        // Nếu date đã đúng định dạng YYYY-MM-DD thì trả về luôn
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        // Xử lý các định dạng date khác
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
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
                                    onChange={(e) => onPersonalInfoChange("houseNumberStreet", e.target.value)}
                                    placeholder="House number and street (optional)"
                                />
                                {/*<ErrorMessage error={errors.houseNumberStreet} />*/}
                            </div>

                            <div>
                                <Label className="text-sm font-medium">City/Province:</Label>
                                <Select
                                    onValueChange={handleProvinceChange}
                                    value={currentProvince?.code.toString() || ""}
                                >
                                    <SelectTrigger className={errors.cityProvince ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select City/Province">
                                            {personalInfo.cityProvince || "Select City/Province"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.code} value={province.code.toString()}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ErrorMessage error={errors.cityProvince} />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">District:</Label>
                                <Select
                                    onValueChange={handleDistrictChange}
                                    value={currentDistrict?.code.toString() || ""}
                                    disabled={!personalInfo.cityProvince}
                                >
                                    <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select District">
                                            {personalInfo.district || "Select District"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district.code} value={district.code.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ErrorMessage error={errors.district} />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Ward:</Label>
                                <Select
                                    onValueChange={handleWardChange}
                                    value={currentWard?.code.toString() || ""}
                                    disabled={!personalInfo.district}
                                >
                                    <SelectTrigger className={errors.ward ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select Ward">
                                            {personalInfo.ward || "Select Ward"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map((ward) => (
                                            <SelectItem key={ward.code} value={ward.code.toString()}>
                                                {ward.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ErrorMessage error={errors.ward} />
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
                        <Label htmlFor="drivingLicense" className="text-sm font-medium">
                            Driving license:
                        </Label>
                        <div>
                            <Label htmlFor="drivingLicense" className="text-sm font-medium">
                                Driving license:
                            </Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="drivingLicense"
                                    type="file"
                                    onChange={onFileUpload}
                                    className="hidden"
                                    accept="image/*" // Chỉ chấp nhận file ảnh
                                />
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

                            {/* Hiển thị preview hình ảnh */}
                            {personalInfo.drivingLicensePreview && (
                                <div className="mt-5">

                                    <img
                                        src={personalInfo.drivingLicensePreview}
                                        alt="Driving license preview"
                                        className="max-w-xs max-h-40 border rounded-md"
                                    />
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
                <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!isFormValid }
                >
                    {showSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    )
}