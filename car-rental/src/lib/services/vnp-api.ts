// lib/services/vnpayApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface VnpayPaymentRequest {
    vnp_Amount: number;
    vnp_OrderInfo: string;
    vnp_TxnRef: string;
    vnp_IpAddr: string;
    vnp_Locale?: string;
    vnp_ReturnUrl: string;
    vnp_Version?: string;
    vnp_Command?: string;
    vnp_OrderType?: string;
    vnp_CurrCode?: string;
}

export interface VnpayPaymentResponse {
    url?: string;
    code: string;
    message?: string;
}

export const vnpayApi = createApi({
    reducerPath: 'vnpayApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5227/api' }),
    endpoints: (builder) => ({
        createPayment: builder.mutation<VnpayPaymentResponse, VnpayPaymentRequest>({
            query: (params) => ({
                url: '/vnpay/createpayment',
                method: 'GET', // Giữ GET vì backend sử dụng GET
                params,
            }),
        }),
    }),
});

export const { useCreatePaymentMutation } = vnpayApi;