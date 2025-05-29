import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ApiResponse } from "@/lib/store";

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
}

export interface UserUpdateDTO {
    fullName?: string
    dob?: string
    phoneNumber?: string
    nationalId?: string
    drivingLicenseUri?: string
    houseNumberStreet?: string
    ward?: string
    district?: string
    cityProvince?: string
}

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5227/api/",
    }),
    endpoints: (builder) => ({
        getUserById: builder.query<ApiResponse<UserProfile>, string>({
            query: (id) => `User/profile/${id}`,
        }),
        updateUserProfile: builder.mutation<ApiResponse<UserProfile>, { id: string, dto: UserUpdateDTO }>({
            query: ({ id, dto }) => ({
                url: `User/profile/${id}`,
                method: 'PUT',
                body: dto,
            }),
        }),
    }),
})

export const {
    useGetUserByIdQuery,
    useUpdateUserProfileMutation
} = userApi