"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Information from "@/app/user/profile/information";
import Security from "@/app/user/profile/security";
import Breadcrumb from "@/components/common/breadcum";


export default function ProfilePage() {
    const [personalInfo, setPersonalInfo] = useState({
        fullName: "",
        phoneNumber: "",
        nationalId: "",
        address: "",
        state: "",
        city: "",
        postalCode: "",
        dateOfBirth: "",
        email: "",
        drivingLicense: null as File | null,
    })

    const [securityInfo, setSecurityInfo] = useState({
        newPassword: "",
        confirmPassword: "",
    })

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo((prev) => ({ ...prev, [field]: value }))
    }

    const handleSecurityChange = (field: string, value: string) => {
        setSecurityInfo((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setPersonalInfo((prev) => ({ ...prev, drivingLicense: file }))
        }
    }

    const handlePersonalSave = () => {
        console.log("Saving personal information:", personalInfo)
        // Add save logic here
    }

    const handleSecuritySave = () => {
        console.log("Saving security information:", securityInfo)
        // Add save logic here
    }

    const handleDiscard = () => {
        // Reset forms or navigate away
        console.log("Discarding changes")
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Profile" }]} />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="information" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="information" className="text-sm">
                                    Personal Information
                                </TabsTrigger>
                                <TabsTrigger value="security" className="text-sm">
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="information">
                                <Information
                                    personalInfo={personalInfo}
                                    onPersonalInfoChange={handlePersonalInfoChange}
                                    onFileUpload={handleFileUpload}
                                    onSave={handlePersonalSave}
                                    onDiscard={handleDiscard}
                                />
                            </TabsContent>

                            <TabsContent value="security">
                                <Security
                                    securityInfo={securityInfo}
                                    onSecurityChange={handleSecurityChange}
                                    onSave={handleSecuritySave}
                                    onDiscard={handleDiscard}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
