    import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

    interface VnpayPaymentRequest {
        OrderType: string;
        Amount: number;
        OrderDescription: string;
        Name: string;
    }

    interface VnpayPaymentResponse {
        paymentUrl: string;
    }

    export const vnpayApi = createApi({
        reducerPath: 'vnpayApi',
        baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5227/api' }),
        endpoints: (builder) => ({
            createPayment: builder.mutation<VnpayPaymentResponse, VnpayPaymentRequest>({
                query: (body) => ({
                    url: '/Payment/CreatePaymentUrlVnpay',
                    method: 'POST',
                    body,
                }),
            }),
        }),
    });

    export const { useCreatePaymentMutation } = vnpayApi;