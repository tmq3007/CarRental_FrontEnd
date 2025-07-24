// src/lib/services/booking/booking-api.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery";
import { ApiResponse } from "@/lib/store";
import { CarVO_Detail } from "./car-api";
import { UserProfile } from "./user-api";
import { Location } from "./local-api/address-api";
import { OccupiedDateRange } from "@/components/rent-a-car/booking-panel";

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

export interface BookingDetailVO {
    bookingNumber: string;
    carName: string;
    carId: string;
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

    //check renter is driver
    isRenterSameAsDriver?: boolean;

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
}
export interface BookingCarAndUserResponse {
    car: CarVO_Detail;
    user: UserProfile;
    carCallendar: OccupiedDateRange[];
}
export interface BookingEditDTO {
    driverFullName?: string | null;
    driverDob?: string | null; // DateOnly in C# maps to string in TS (YYYY-MM-DD format)
    driverEmail?: string | null;
    driverPhoneNumber?: string | null;
    driverNationalId?: string | null;
    //driverDrivingLicenseUri?: string | null;
    driverHouseNumberStreet?: string | null;
    driverWard?: string | null;
    driverDistrict?: string | null;
    driverCityProvince?: string | null;
}

export interface CreateBookingDTO {
    carId: string;
    pickupDate: string; // DateOnly in C# maps to string in TS (YYYY-MM-DD format)
    dropoffDate: string; // DateOnly in C# maps to string in TS (YYYY-MM-DD format)
    pickupLocation: Location;
    dropoffLocation: Location;
    paymentType: string;
    deposit: number;
    driverFullName?: string | null;
    driverDob?: string | null; // DateOnly in C# maps to string in TS
    driverEmail?: string | null;
    driverPhoneNumber?: string | null;
    driverNationalId?: string | null;
    driverHouseNumberStreet?: string | null;
    driverLocation?: Location;
    isRenterSameAsDriver?: boolean;
}

export interface PaginatedBookingResponse {
    data: BookingVO[];
    totalCount: number;
}

export interface FeedbackResponseDTO {
    success: boolean;
    message: string;
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

        getBookingsByAccountId: build.query<ApiResponse<BookingDetailVO[]>, { accountId: string }>({
            query: ({ accountId }) => ({
                url: `/booking/${accountId}`,
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
        cancelBooking: build.mutation<ApiResponse<string>, { bookingId: string }>({
            query: ({ bookingId }) => ({
                url: `/booking/${bookingId}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: ["Booking"],
        }),
        confirmPickup: build.mutation<ApiResponse<string>, { bookingNumber: string }>({
            query: ({ bookingNumber }) => ({
                url: `/booking/${bookingNumber}/confirm-pickup`,
                method: "PUT",
            }),
            invalidatesTags: ["Booking"],
        }),
        returnCar: build.mutation<ApiResponse<string>, { bookingId: string }>({
            query: ({ bookingId }) => ({
                url: `/booking/${bookingId}/return`,
                method: "PUT",
            }),
            invalidatesTags: ["Booking"],
        }),

        getBookingDetail: build.query<ApiResponse<BookingDetailVO>, string>({
            query: (bookingNumber) => ({
                url: `/booking/detail/${bookingNumber}`,
                method: "GET",
            }),
            providesTags: (result, error, bookingNumber) => [{ type: "Booking", id: bookingNumber }],
        }),
        updateBooking: build.mutation<ApiResponse<BookingDetailVO>, { bookingNumber: string; bookingDto: BookingEditDTO }>({
            query: ({ bookingNumber, bookingDto }) => ({
                url: `/booking/edit/${bookingNumber}`,
                method: "PUT",
                body: bookingDto,
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [
                { type: "Booking", id: bookingNumber },
                "Booking",
            ],
        }),
        getBookingCarAndUser: build.query<ApiResponse<BookingCarAndUserResponse>, string>({
            query: (carId) => ({
                url: `/booking/booking-informations/${carId}`,
                method: "GET",
            }),
            providesTags: (result, error, carId) => [{ type: "Booking", id: carId }],
        }),
        createBooking: build.mutation<ApiResponse<BookingVO>, CreateBookingDTO>({
            query: (bookingCreateDto) => ({
                url: `/booking/create`,
                method: "POST",
                body: bookingCreateDto,
            }),
            invalidatesTags: ["Booking"],
        }),

        rateCar: build.mutation<
            ApiResponse<FeedbackResponseDTO>,
            { bookingNumber: string; rating: number; comment: string }
        >({
            query: ({ bookingNumber, rating, comment }) => ({
                url: '/feedback/submit',
                method: 'POST',
                body: {
                    BookingNumber: bookingNumber,
                    Rating: rating,
                    Comment: comment,
                },
            }),
            invalidatesTags: ['Booking'],
        }),

    }),
});

export const {
    useGetBookingsQuery,
    useGetBookingsByAccountIdQuery,
    useCancelBookingMutation,
    useConfirmPickupMutation,
    useReturnCarMutation,
    useGetBookingDetailQuery,
    useUpdateBookingMutation,
    useRateCarMutation,
    useUpdateBookingMutation,
    useGetBookingCarAndUserQuery,
    useCreateBookingMutation,
} = bookingApi;