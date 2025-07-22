"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Information from "@/components/user/profile/information"
import Security from "@/components/user/profile/security"
import Breadcrumb from "@/components/common/breadcum"
import {
    useGetUserByIdQuery,
    useUpdateUserProfileMutation,
    type UserProfile,
    useChangePasswordMutation,
} from "@/lib/services/user-api"
import { toast as shadToast } from "@/hooks/use-toast"
import { toast as sonnerToast } from "sonner"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import LoadingPage from "@/components/common/loading"
import NoResult from "@/components/common/no-result"

export default function ProfilePage() {
    const userId = useSelector((state: RootState) => state.user?.id)

    const { data: user, isLoading: userLoading, error: userError, refetch: refetchUser } = useGetUserByIdQuery(userId)

    const [updateProfile] = useUpdateUserProfileMutation()
    const [changePassword] = useChangePasswordMutation()
    const [personalInfo, setPersonalInfo] = useState<UserProfile | null>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const [securityInfo, setSecurityInfo] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const extractUserProfileFromData = (userData: any): UserProfile | null => {
        if (!userData) return null

        return {
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
        }
    }
    useEffect(() => {
        if (user) {
            setPersonalInfo(extractUserProfileFromData(user.data))
        }
    }, [user])

    const handlePersonalInfoChange = (field: string, value: string | File) => {
        if (field === "drivingLicenseUri" && value instanceof File) {
            setUploadedFile(value)
            // Create preview URL
            const previewUrl = URL.createObjectURL(value)
            setPersonalInfo((prev) =>
                prev
                    ? {
                        ...prev,
                        drivingLicenseUri: value.name,
                        drivingLicensePreview: previewUrl,
                    }
                    : prev,
            )
        } else if (field === "drivingLicensePreview") {
            setPersonalInfo((prev) => (prev ? { ...prev, [field]: value as string } : prev))
        } else {
            setPersonalInfo((prev) => (prev ? { ...prev, [field]: value as string } : prev))
        }
    }

    const handleSecurityChange = (field: string, value: string) => {
        setSecurityInfo((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handlePersonalInfoChange("drivingLicenseUri", file)
        }
    }

    const handlePersonalSave = async () => {
        if (!personalInfo) return

        try {
            const updateData = {
                fullName: personalInfo.fullName,
                phoneNumber: personalInfo.phoneNumber,
                nationalId: personalInfo.nationalId,
                drivingLicenseUri: uploadedFile || personalInfo.drivingLicenseUri,
                houseNumberStreet: personalInfo.houseNumberStreet,
                ward: personalInfo.ward,
                district: personalInfo.district,
                cityProvince: personalInfo.cityProvince,
                dob: personalInfo.dob,
                email: personalInfo.email,
            }
            const response = await updateProfile({ id: userId, dto: updateData }).unwrap()

            shadToast({
                title: "Success",
                description: response.message,
                variant: "default",
            })
            sonnerToast.success(response.message)

            // Reset uploaded file after successful save
            setUploadedFile(null)
            refetchUser()
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to update profile"
            shadToast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            sonnerToast.error(errorMessage)
        }
    }

    const handleSecuritySave = async () => {
        if (securityInfo.newPassword !== securityInfo.confirmPassword) {
            shadToast({
                title: "Error",
                description: "New password and confirmation don't match",
                variant: "destructive",
            })
            sonnerToast.error("New password and confirmation don't match")
            return
        }

        try {
            await changePassword({
                id: userId,
                dto: {
                    currentPassword: securityInfo.currentPassword,
                    newPassword: securityInfo.newPassword,
                    confirmPassword: securityInfo.confirmPassword,
                },
            }).unwrap()

            shadToast({
                title: "Success",
                description: "Password changed successfully",
                variant: "default",
            })
            sonnerToast.success("Password changed successfully")

            setSecurityInfo({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to change password. Please check your current password."
            shadToast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            sonnerToast.error(errorMessage)
        }
    }

    const handleDiscard = () => {
        if (user) {
            setPersonalInfo(extractUserProfileFromData(user.data))
            setSecurityInfo({ currentPassword: "", newPassword: "", confirmPassword: "" })
            setUploadedFile(null)
        }
    }

    if (userError) {
        return <NoResult />
    }
    if (userLoading) {
        return <LoadingPage />
    }

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
                                {userLoading ? (
                                    <LoadingPage />
                                ) : (
                                    personalInfo && (
                                        <Information
                                            personalInfo={personalInfo}
                                            onPersonalInfoChange={handlePersonalInfoChange}
                                            onFileUpload={handleFileUpload}
                                            onSave={handlePersonalSave}
                                            onDiscard={handleDiscard}
                                            userId={userId}
                                        />
                                    )
                                )}
                            </TabsContent>

                            <TabsContent value="security">
                                {userLoading ? (
                                    <LoadingPage />
                                ) : (
                                    <Security
                                        securityInfo={securityInfo}
                                        onSecurityChange={handleSecurityChange}
                                        onSave={handleSecuritySave}
                                        onDiscard={handleDiscard}
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
