"use client"

import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Information from "@/app/user/profile/information"
import Security from "@/app/user/profile/security"
import Breadcrumb from "@/components/common/breadcum"
import { useGetUserByIdQuery, UserProfile } from "@/lib/services/user-api"

export default function ProfilePage() {
    const {
        data: user,
        isLoading: userLoading,
        error: userError,
    } = useGetUserByIdQuery("3E90353C-1C5D-469E-A572-0579A1C0468D")
    console.log("user", user?.data.dob)

    const [personalInfo, setPersonalInfo] = useState<UserProfile | undefined>()

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                id: user?.data.id,
                fullName: user?.data.fullName,
                phoneNumber: user?.data.phoneNumber,
                nationalId: user?.data.nationalId,
                drivingLicenseUri: user?.data.drivingLicenseUri,
                houseNumberStreet: user?.data.houseNumberStreet,
                ward: user?.data.ward,
                district: user?.data.district,
                cityProvince: user?.data.cityProvince,
                email: user?.data.email,
                dob: user?.data.dob ? new Date(user?.data.dob).toISOString().split("T")[0] : "",
            })
        }
    }, [user])

    const [securityInfo, setSecurityInfo] = useState({
        newPassword: "",
        confirmPassword: "",
    })

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSecurityChange = (field: string, value: string) => {
        setSecurityInfo((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setPersonalInfo((prev) => (prev ? { ...prev, drivingLicenseUri: file.name } : prev))
        }
    }

    const handlePersonalSave = () => {
        console.log("Saving personal information:", personalInfo)
        // TODO: add save logic here
    }

    const handleSecuritySave = () => {
        console.log("Saving security information:", securityInfo)
        // TODO: add save logic here
    }

    const handleDiscard = () => {
        console.log("Discarding changes")
        // TODO: reset logic here
        if (user) {
            setPersonalInfo({
                id: user?.data.id,
                fullName: user?.data.fullName,
                phoneNumber: user?.data.phoneNumber,
                nationalId: user?.data.nationalId,
                drivingLicenseUri: user?.data.drivingLicenseUri,
                houseNumberStreet: user?.data.houseNumberStreet,
                ward: user?.data.ward,
                district: user?.data.district,
                cityProvince: user?.data.cityProvince,
                email: user?.data.email,
                dob: user?.data.dob ? new Date(user?.data.dob).toISOString().split("T")[0] : "",
            })
            setSecurityInfo({ newPassword: "", confirmPassword: "" })
        }
    }

    if (userLoading) return <div>Loading user data...</div>
    if (userError) return <div>Error loading user data.</div>

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
                                    personalInfo={personalInfo!}
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
