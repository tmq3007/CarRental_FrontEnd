// src/lib/services/booking/booking-api.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuthCheck} from "@/lib/services/config/baseQuery";
import { ApiResponse } from "@/lib/store";

export interface BookingVO {
    carName: string;
    bookingNumber: string;
    pickUpLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    returnDate: string;
    basePrice: number;
    deposit: number;
    paymentType: string;
    createdAt: string;
    status: string;
}

export interface PaginatedBookingResponse {
    data: BookingVO[];
    totalCount: number;
}

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Booking"],
    endpoints: (build) => ({
        getBookings: build.query<ApiResponse<PaginatedBookingResponse>, { page: number; pageSize: number }>({
            query: ({ page, pageSize }) => ({
                url: `/booking?page=${page}&pageSize=${pageSize}`,
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),

        getBookingsByAccountId: build.query<ApiResponse<BookingVO[]>, { accountId: string }>({
            query: ({ accountId }) => ({
                url: `/booking/${accountId}`,
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
    }),
});

export const { useGetBookingsQuery, useGetBookingsByAccountIdQuery } = bookingApi;
