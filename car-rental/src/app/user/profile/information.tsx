"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Upload } from "lucide-react"
import {UserProfile} from "@/lib/services/user-api";



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
    if (!personalInfo) return null;
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
                        <Label className="text-sm font-medium">Address:</Label>
                        <div className="space-y-2 mt-1">
                            <Select
                                onValueChange={(value) => onPersonalInfoChange("houseNumberStreet", value)}
                                value={personalInfo.houseNumberStreet}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select House/Street" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="123 Nguyen Trai">123 Nguyen Trai</SelectItem>
                                    <SelectItem value="456 Le Loi">456 Le Loi</SelectItem>
                                    <SelectItem value="789 Tran Hung Dao">789 Tran Hung Dao</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                onValueChange={(value) => onPersonalInfoChange("ward", value)}
                                value={personalInfo.ward}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ward 5">Ward 5</SelectItem>
                                    <SelectItem value="Ward 6">Ward 6</SelectItem>
                                    <SelectItem value="Ward 7">Ward 7</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                onValueChange={(value) => onPersonalInfoChange("district", value)}
                                value={personalInfo.district}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="District 1">District 1</SelectItem>
                                    <SelectItem value="District 2">District 2</SelectItem>
                                    <SelectItem value="District 3">District 3</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                onValueChange={(value) => onPersonalInfoChange("cityProvince", value)}
                                value={personalInfo.cityProvince}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select City/Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ho Chi Minh">Ho Chi Minh</SelectItem>
                                    <SelectItem value="Hanoi">Hanoi</SelectItem>
                                    <SelectItem value="Da Nang">Da Nang</SelectItem>
                                </SelectContent>
                            </Select>
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
                                value={personalInfo.dob}
                                onChange={(e) => onPersonalInfoChange("dateOfBirth", e.target.value)}
                                className="pr-10 "


                            />
                         </div>
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
                        <Label htmlFor="drivingLicense" className="text-sm font-medium">
                            Driving license:
                        </Label>
                        <div className="flex gap-2 mt-1">
                            <Input id="drivingLicense" type="file" onChange={onFileUpload} className="hidden" />
                            <Input
                                value={personalInfo.drivingLicenseUri}
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
