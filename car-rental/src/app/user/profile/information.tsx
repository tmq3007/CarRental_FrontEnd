"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Upload } from "lucide-react"

interface PersonalInfo {
    fullName: string
    phoneNumber: string
    nationalId: string
    address: string
    state: string
    city: string
    postalCode: string
    dateOfBirth: string
    email: string
    drivingLicense: File | null
}

interface InformationProps {
    personalInfo: PersonalInfo
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
                            value={personalInfo.fullName}
                            onChange={(e) => onPersonalInfoChange("fullName", e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber" className="text-sm font-medium">
                            Phone number: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            value={personalInfo.phoneNumber}
                            onChange={(e) => onPersonalInfoChange("phoneNumber", e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="nationalId" className="text-sm font-medium">
                            National ID No.: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="nationalId"
                            value={personalInfo.nationalId}
                            onChange={(e) => onPersonalInfoChange("nationalId", e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium">Address:</Label>
                        <div className="space-y-2 mt-1">
                            <Select onValueChange={(value) => onPersonalInfoChange("address", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Address" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="address1">Address 1</SelectItem>
                                    <SelectItem value="address2">Address 2</SelectItem>
                                    <SelectItem value="address3">Address 3</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => onPersonalInfoChange("state", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="state1">State 1</SelectItem>
                                    <SelectItem value="state2">State 2</SelectItem>
                                    <SelectItem value="state3">State 3</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => onPersonalInfoChange("city", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="city1">City 1</SelectItem>
                                    <SelectItem value="city2">City 2</SelectItem>
                                    <SelectItem value="city3">City 3</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Postal/Zip Code"
                                value={personalInfo.postalCode}
                                onChange={(e) => onPersonalInfoChange("postalCode", e.target.value)}
                            />
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
                                value={personalInfo.dateOfBirth}
                                onChange={(e) => onPersonalInfoChange("dateOfBirth", e.target.value)}
                                className="pr-10 "


                            />
                         </div>
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email address: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={personalInfo.email}
                            onChange={(e) => onPersonalInfoChange("email", e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="drivingLicense" className="text-sm font-medium">
                            Driving license:
                        </Label>
                        <div className="flex gap-2 mt-1">
                            <Input id="drivingLicense" type="file" onChange={onFileUpload} className="hidden" />
                            <Input
                                value={personalInfo.drivingLicense?.name || ""}
                                placeholder="No file selected"
                                readOnly
                                className="flex-1"
                            />
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

            <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onDiscard}>
                    Discard
                </Button>
                <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
                    Save
                </Button>
            </div>
        </div>
    )
}
