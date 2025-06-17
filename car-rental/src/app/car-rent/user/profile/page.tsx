"use client"

import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Information from "@/app/car-rent/user/profile/information"
import Security from "@/app/car-rent/user/profile/security"
import Breadcrumb from "@/components/common/breadcum"
import {
    useGetUserByIdQuery,
    useUpdateUserProfileMutation,
    UserProfile,
    useChangePasswordMutation
} from "@/lib/services/user-api"
import { toast as shadToast } from "@/hooks/use-toast" // Đổi tên import này
import { toast as sonnerToast } from "sonner"
import SecuritySkeleton from "@/components/skeleton/security-skeleton";

import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import LoadingPage from "@/components/common/loading";
import NoResult from "@/components/common/no-result";

export default function ProfilePage() {

    // @ts-ignore
    const userId = useSelector((state: RootState) => state.user?.id);
     console.log(userId);
     const {
        data: user,
        isLoading: userLoading,
        error: userError,
        refetch: refetchUser,
    } = useGetUserByIdQuery(userId)



    const [updateProfile] = useUpdateUserProfileMutation()
    const [changePassword] = useChangePasswordMutation()
    const [personalInfo, setPersonalInfo] = useState<UserProfile | null>(null)

    const [securityInfo, setSecurityInfo] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const extractUserProfileFromData = (userData: any): UserProfile | null => {
        if (!userData) return null;

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

    const handlePersonalInfoChange = (field: string, value: string) => {
        setPersonalInfo((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSecurityChange = (field: string, value: string) => {
        setSecurityInfo((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Tạo URL tạm thời để hiển thị preview
            const fileUrl = URL.createObjectURL(file);

            // Cập nhật cả tên file và URL preview
            setPersonalInfo((prev) =>
                prev ? { ...prev, drivingLicenseUri: file.name, drivingLicensePreview: fileUrl } : prev
            );
        }
    };

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
                email: personalInfo.email
            }

           const response = await updateProfile({ id: userId, dto: updateData }).unwrap()
            // Sử dụng cả 2 toast
            shadToast({
                title: "Success",
                description: response.message,
                variant: "default",
            })
            sonnerToast.success(response.message)
            refetchUser()
        } catch (error) {
            shadToast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
            sonnerToast.error("Failed to update profile")
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
                    confirmPassword: securityInfo.confirmPassword
                }
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
        } catch (error) {
            shadToast({
                title: "Error",
                description: "Failed to change password. Please check your current password.",
                variant: "destructive",
            })
            sonnerToast.error("Failed to change password. Please check your current password.")
        }
    }

    const handleDiscard = () => {
        if (user) {
            setPersonalInfo(extractUserProfileFromData(user.data))
            setSecurityInfo({currentPassword: "", newPassword: "", confirmPassword: "" })
        }
    }

    if (userError) {
        return <NoResult />
    }
    if(userLoading){
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
                                    <InformationSkeleton />
                                ) : (
                                    personalInfo && (
                                        <Information
                                            personalInfo={personalInfo || undefined}
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
                                    <SecuritySkeleton />
                                ) : (<Security
                                    securityInfo={securityInfo}
                                    onSecurityChange={handleSecurityChange}
                                    onSave={handleSecuritySave}
                                    onDiscard={handleDiscard}
                                />)}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}