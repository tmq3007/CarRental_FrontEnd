import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuthCheck} from "@/lib/services/config/baseQuery";
import {ApiResponse} from "@/lib/store";
import {ChangePasswordDTO} from "@/lib/services/user-api";

export type LoginDTO = {
    Email: string,
    Password: string,
}

export type LoginVO = {
    Token: string,
}

export type ForgotPasswordDTO = {
    Email: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ['Auth'],
    endpoints: (build) => ({

        login: build.mutation<ApiResponse<LoginVO>, LoginDTO>({
            query: (loginDTO) => ({
                url: '/Auth/login',
                method: 'POST',
                body: loginDTO, // Gửi dữ liệu loginDTO trong body của request
            }),
        }),

        forgotPassword: build.mutation<ApiResponse<null>, ForgotPasswordDTO>({
            query: (forgotPasswordDTO) => ({
                url: '/Auth/send-email-forgot-password',
                method: 'POST',
                body: forgotPasswordDTO, // Gửi dữ liệu forgotPasswordDTO trong body của request
            }),
        }),

        resetPassword: build.mutation<ApiResponse<null>, ChangePasswordDTO>({
            query: (resetPasswordDTO) => ({
                url: '/Auth/reset-password',
                method: 'POST',
                body: resetPasswordDTO, // Gửi dữ liệu resetPasswordDTO trong body của request
            }),
        }),

        logout: build.mutation<ApiResponse<undefined>, undefined>({
            query: () => ({
                url: '/auth/logout',
                method: 'PUT',
            })
        })

    }),
})

export const {
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutMutation
} = authApi

