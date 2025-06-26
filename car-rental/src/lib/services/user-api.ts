import { createApi } from "@reduxjs/toolkit/query/react"
import type { ApiResponse } from "@/lib/store"
import { baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery"

export interface UserProfile {
    id: string
    fullName: string
    dob: string
    phoneNumber: string
    nationalId: string
    drivingLicenseUri: string
    houseNumberStreet: string
    ward: string
    district: string
    cityProvince: string
    email?: string
    drivingLicensePreview?: string
}

export interface UserUpdateDTO {
    fullName?: string
    dob?: string
    phoneNumber?: string
    nationalId?: string
    drivingLicenseUri?: File | string // Allow both File and string
    houseNumberStreet?: string
    ward?: string
    district?: string
    cityProvince?: string
    email?: string
}

export interface ChangePasswordDTO {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface RegisterDTO {
    email: string
    password: string
    confirmPassword: string
    fullName: string
    phoneNumber: string
    roleId: number
}

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithAuthCheck,
    endpoints: (builder) => ({
        getUserById: builder.query<ApiResponse<UserProfile>, string>({
            query: (id) => ({
                url: `User/profile/${id}`,
                method: "GET",
            }),
        }),
        updateUserProfile: builder.mutation<ApiResponse<UserProfile>, { id: string; dto: UserUpdateDTO }>({
            query: ({ id, dto }) => {
                // Check if we have a file upload
                const hasFile = dto.drivingLicenseUri instanceof File

                if (hasFile) {
                    // Create FormData for file upload
                    const formData = new FormData()

                    // Add all fields to FormData
                    if (dto.fullName) formData.append("FullName", dto.fullName)
                    if (dto.dob) formData.append("Dob", dto.dob)
                    if (dto.phoneNumber) formData.append("PhoneNumber", dto.phoneNumber)
                    if (dto.nationalId) formData.append("NationalId", dto.nationalId)
                    if (dto.houseNumberStreet) formData.append("HouseNumberStreet", dto.houseNumberStreet)
                    if (dto.ward) formData.append("Ward", dto.ward)
                    if (dto.district) formData.append("District", dto.district)
                    if (dto.cityProvince) formData.append("CityProvince", dto.cityProvince)
                    if (dto.email) formData.append("Email", dto.email)

                    // Add file
                    if (dto.drivingLicenseUri instanceof File) {
                        formData.append("DrivingLicenseUri", dto.drivingLicenseUri)
                    }

                    return {
                        url: `User/profile/${id}`,
                        method: "PUT",
                        body: formData,
                    }
                } else {
                    // Send as JSON when no file
                    return {
                        url: `User/profile/${id}`,
                        method: "PUT",
                        body: dto,
                    }
                }
            },
        }),
        changePassword: builder.mutation<ApiResponse<void>, { id: string; dto: ChangePasswordDTO }>({
            query: ({ id, dto }) => ({
                url: `User/change-password/${id}`,
                method: "POST",
                body: dto,
            }),
        }),
        register: builder.mutation<ApiResponse<void>, RegisterDTO>({
            query: (dto) => ({
                url: `User/register`,
                method: "POST",
                body: dto,
            }),
        }),
    }),
})

export const { useGetUserByIdQuery, useUpdateUserProfileMutation, useChangePasswordMutation, useRegisterMutation } =
    userApi
