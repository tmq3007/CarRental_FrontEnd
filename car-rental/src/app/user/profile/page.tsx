"use client"

import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Information from "@/app/user/profile/information"
import Security from "@/app/user/profile/security"
import Breadcrumb from "@/components/common/breadcum"
import { useGetUserByIdQuery, useUpdateUserProfileMutation, UserProfile } from "@/lib/services/user-api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {toast} from "@/hooks/use-toast";

export default function ProfilePage() {
    const userId = "3E90353C-1C5D-469E-A572-0579A1C0468D" // You might want to get this dynamically
    const {
        data: user,
        isLoading: userLoading,
        error: userError,
        refetch: refetchUser,
    } = useGetUserByIdQuery(userId)

    const [updateProfile] = useUpdateUserProfileMutation()
    const [personalInfo, setPersonalInfo] = useState<UserProfile | undefined>()

    const extractUserProfileFromData = (userData: any): UserProfile => ({
        id: userData.id,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        nationalId: userData.nationalId,
        drivingLicenseUri: userData.drivingLicenseUri,
        houseNumberStreet: userData.houseNumberStreet,
        ward: userData.ward,
        district: userData.district,
        cityProvince: userData.cityProvince,
        email: userData.email,
        dob: userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : "",
    })

    useEffect(() => {
        if (user) {
            setPersonalInfo(extractUserProfileFromData(user.data))
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

    const handlePersonalSave = async () => {
        if (!personalInfo) return

        try {
            const updateData = {
                fullName: personalInfo.fullName,
                phoneNumber: personalInfo.phoneNumber,
                nationalId: personalInfo.nationalId,
                drivingLicenseUri: personalInfo.drivingLicenseUri,
                houseNumberStreet: personalInfo.houseNumberStreet,
                ward: personalInfo.ward,
                district: personalInfo.district,
                cityProvince: personalInfo.cityProvince,
                dob: personalInfo.dob,
            }

            await updateProfile({ id: userId, dto: updateData }).unwrap()
            toast({
                title: "Success",
                description: "Profile updated successfully",
                variant: "default",
            })
            refetchUser() // Refresh user data
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
        }
    }

    const handleSecuritySave = () => {
        console.log("Saving security information:", securityInfo)
        // TODO: add save logic here
    }

    const handleDiscard = () => {
        if (user) {
            setPersonalInfo(extractUserProfileFromData(user.data))
            setSecurityInfo({ newPassword: "", confirmPassword: "" })
        }
    }

    if (userLoading) return <div>Loading user data...</div>
    if (userError) return <div>Error loading user data.</div>

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-5xl mx-auto">
                <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Profile" }]} />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="information" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="information">Personal Information</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>

                            <TabsContent value="information">
                                {personalInfo && (
                                    <Information
                                        personalInfo={personalInfo}
                                        onPersonalInfoChange={handlePersonalInfoChange}
                                        onFileUpload={handleFileUpload}
                                        onSave={handlePersonalSave}
                                        onDiscard={handleDiscard}
                                        userId={userId}
                                    />
                                )}
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