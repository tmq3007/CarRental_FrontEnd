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

export interface TransactionVO {
    amount: number;
    message?: string;
    createdAt?: string;
    status?: string;
    type?: string;
}

export interface BookingDetailVO {
    bookingNumber: string;
    carName: string;
    status: string;
    pickUpTime?: string;
    dropOffTime?: string;
    accountEmail?: string;

    // Renter's information
    renterFullName?: string;
    renterDob?: string;
    renterPhoneNumber?: string;
    renterEmail?: string;
    renterNationalId?: string;
    renterDrivingLicenseUri?: string;
    renterHouseNumberStreet?: string;
    renterWard?: string;
    renterDistrict?: string;
    renterCityProvince?: string;

    // Driver's information
    driverFullName?: string;
    driverDob?: string;
    driverPhoneNumber?: string;
    driverEmail?: string;
    driverNationalId?: string;
    driverDrivingLicenseUri?: string;
    driverHouseNumberStreet?: string;
    driverWard?: string;
    driverDistrict?: string;
    driverCityProvince?: string;

    // Car information
    licensePlate?: string;
    brand: string;
    model: string;
    color: string;
    productionYear: number;
    isAutomatic: boolean;
    isGasoline: boolean;
    numberOfSeats: number;
    mileage: number;
    fuelConsumption: number;
    carAddress: string;
    description: string;
    additionalFunction: string;
    termOfUse: string;
    carImageFront: string;
    carImageBack: string;
    carImageLeft: string;
    carImageRight: string;

    // Documents
    insuranceUri?: string;
    insuranceUriIsVerified?: boolean;
    registrationPaperUri?: string;
    registrationPaperUriIsVerified?: boolean;
    certificateOfInspectionUri?: string;
    certificateOfInspectionUriIsVerified?: boolean;

    // Payment information
    basePrice?: number;
    deposit?: number;
    paymentType?: string;
    transactions?: TransactionVO[];
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

        getBookingDetail: build.query<ApiResponse<BookingDetailVO>, string>({
            query: (bookingNumber) => ({
                url: `/booking/detail/${bookingNumber}`,
                method: "GET",
            }),
            providesTags: (result, error, bookingNumber) => [{ type: "Booking", id: bookingNumber }],
        }),

    }),
});

export const {
    useGetBookingsQuery ,
    useGetBookingDetailQuery
    } = bookingApi;
