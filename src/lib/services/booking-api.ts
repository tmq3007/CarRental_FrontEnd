// src/lib/services/booking/booking-api.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery";
import { ApiResponse, PaginationResponse } from "@/lib/store";
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
    carImageFront?: string;
    carImageBack?: string;
    carImageLeft?: string;
    carImageRight?: string;
    isReviewed?: boolean;
}

export type BookingStatus =
    | "waiting_confirmed"
    | "pending_deposit"
    | "pending_payment"
    | "confirmed"
    | "in_progress"
    | "waiting_confirm_return"
    | "rejected_return"
    | "completed"
    | "cancelled";

export interface BookingStatusHistoryEntry {
    id?: string;
    oldStatus: BookingStatus | string;
    newStatus: BookingStatus | string;
    note?: string | null;
    pictureUrl?: string | null;
    changedAt: string;
}

export interface BookingSummaryTimelineEntry {
    oldStatus: BookingStatus | string;
    newStatus: BookingStatus | string;
    note?: string | null;
    pictureUrl?: string | null;
    changedAt: string;
}

export interface BookingSummaryVO {
    bookingNumber: string;
    status: BookingStatus | string;
    pickUpTime?: string | null;
    dropOffTime?: string | null;
    actualReturnTime?: string | null;
    basePricePerDayCents?: number | null;
    totalDays?: number | null;
    basePriceCents?: number | null;
    depositSnapshotCents?: number | null;
    extraKmFeeCents?: number | null;
    discountCents?: number | null;
    extraChargesCents?: number | null;
    totalCalculatedCents?: number | null;
    remainingChargedCents?: number | null;
    refundToRenterCents?: number | null;
    ownerShareFromDepositCents?: number | null;
    adminShareFromDepositCents?: number | null;
    ownerShareFromRemainingCents?: number | null;
    adminShareFromRemainingCents?: number | null;
    timeline?: BookingSummaryTimelineEntry[] | null;
}

export interface BookingDetailVO {
    bookingNumber: string;
    carName: string;
    carId: string;
    status: BookingStatus | string;
    pickUpTime?: string;
    dropOffTime?: string;
    accountEmail?: string;
    pickUpLocation?: string;
    dropOffLocation?: string;
    
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
    depositPaid?: boolean;
    depositStatus?: string;
    statusHistory?: BookingStatusHistoryEntry[];
    historyEntries?: BookingStatusHistoryEntry[];
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
    isDifferentDriver?: boolean;
}

export interface PaginatedBookingResponse {
    data: BookingVO[];
    totalCount: number;
}

export interface FeedbackResponseDTO {
    success: boolean;
    message: string;
}
export interface BookingQueryParams {
    searchTerm?: string;
    sortOrder?: "newest" | "oldest";
    statuses?: string[];
}

export interface CarOwnerBookingQueryParams {
    accountId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    carName?: string;
    sortBy?: "pickupDate" | "returnDate" | "totalAmount" | "status";
    sortDirection?: "asc" | "desc";
    statuses?: string[];
    fromDate?: string;
    toDate?: string;
}

export interface CarOwnerBookingVO extends BookingVO {
    bookingId?: string;
    carId?: string;
    renterFullName?: string;
    renterEmail?: string;
    renterPhoneNumber?: string;
    paymentStatus?: string;
    totalAmount?: number;
    updatedAt?: string;
}

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Booking"],
    endpoints: (build) => ({
        getCarOwnerUpcommingBookings: build.query<
            ApiResponse<CarOwnerBookingVO[]>,
            { accountId: string; limit: number }
        >({
            query: ({ accountId, limit }) => ({
                url: `/car-owner/dashboard/upcomming-bookings?accountId=${accountId}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
        getCarOwnerBookings: build.query<
            ApiResponse<PaginationResponse<CarOwnerBookingVO[]>>,
            CarOwnerBookingQueryParams
        >({
            query: ({ accountId, statuses, ...params }) => {
                const searchParams = new URLSearchParams();
                searchParams.set("accountId", accountId);

                if (typeof params.page === "number") {
                    searchParams.set("page", String(params.page));
                }
                if (typeof params.pageSize === "number") {
                    searchParams.set("pageSize", String(params.pageSize));
                }
                if (params.search) {
                    searchParams.set("search", params.search);
                }
                if (params.carName) {
                    searchParams.set("carName", params.carName);
                }
                if (params.sortBy) {
                    searchParams.set("sortBy", params.sortBy);
                }
                if (params.sortDirection) {
                    searchParams.set("sortDirection", params.sortDirection);
                }
                if (params.fromDate) {
                    searchParams.set("fromDate", params.fromDate);
                }
                if (params.toDate) {
                    searchParams.set("toDate", params.toDate);
                }
                statuses?.forEach((status) => {
                    if (status) {
                        searchParams.append("status", status);
                    }
                });

                const queryString = searchParams.toString();

                return {
                    url: `/car-owner/bookings${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Booking"],
            keepUnusedDataFor: 0,
        }),
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
        searchBookingsByAccountId: build.query<
            ApiResponse<BookingVO[]>,
            { accountId: string; queryParams: BookingQueryParams }
        >({
            query: ({ accountId, queryParams }) => {
                const params = new URLSearchParams();

                if (queryParams.searchTerm) {
                    params.append('searchTerm', queryParams.searchTerm);
                }
                if (queryParams.sortOrder) {
                    params.append('sortOrder', queryParams.sortOrder);
                }
                if (queryParams.statuses && queryParams.statuses.length > 0) {
                    queryParams.statuses.forEach(status => params.append('statuses', status));
                }

                return {
                    url: `/booking/${accountId}/search?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Booking"],
        }),

        cancelBooking: build.mutation<ApiResponse<string>, { bookingId: string }>({
            query: ({ bookingId }) => ({
                url: `/booking/${bookingId}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: ["Booking"],
        }),
        confirmPickup: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string; pictureUrl?: string | null }
        >({
            query: ({ bookingNumber, note, pictureUrl }) => ({
                url: `/booking/${bookingNumber}/confirm-pickup`,
                method: "POST",
                body: { note, pictureUrl: pictureUrl ?? null },
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        confirmDeposit: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string | null }
        >({
            query: ({ bookingNumber, note }) => ({
                url: `/booking/${bookingNumber}/confirm-deposit`,
                method: "POST",
                body: note ? { note } : undefined,
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        returnCar: build.mutation<ApiResponse<string>, { bookingId: string }>({
            query: ({ bookingId }) => ({
                url: `/booking/${bookingId}/return`,
                method: "PUT",
            }),
            invalidatesTags: ["Booking"],
        }),

        customerCancelBooking: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; reason?: string; pictureUrl?: string | null }
        >({
            query: ({ bookingNumber, reason, pictureUrl }) => ({
                url: `/booking/${bookingNumber}/customer-cancel`,
                method: "POST",
                body: { reason, pictureUrl: pictureUrl ?? null },
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        ownerCancelBooking: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string; pictureUrl?: string | null }
        >({
            query: ({ bookingNumber, note, pictureUrl }) => ({
                url: `/booking/${bookingNumber}/owner-cancel`,
                method: "POST",
                body: { note, pictureUrl: pictureUrl ?? null },
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        confirmBooking: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string | null }
        >({
            query: ({ bookingNumber, note }) => ({
                url: `/booking/${bookingNumber}/confirm`,
                method: "POST",
                body: note ? { note } : undefined,
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        requestReturn: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string; pictureUrl?: string | null }
        >({
            query: ({ bookingNumber, note, pictureUrl }) => ({
                url: `/booking/${bookingNumber}/request-return`,
                method: "POST",
                body: { note, pictureUrl: pictureUrl ?? null },
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        acceptReturn: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string; pictureUrl?: string | null; chargesCents?: number }
        >({
            query: ({ bookingNumber, note, pictureUrl, chargesCents }) => ({
                url: `/booking/${bookingNumber}/accept-return`,
                method: "POST",
                body: {
                    note,
                    pictureUrl: pictureUrl ?? null,
                    chargesCents: chargesCents ?? 0,
                },
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),
        rejectReturn: build.mutation<
            ApiResponse<string>,
            { bookingNumber: string; note?: string; pictureUrl?: string | null }
        >({
            query: ({ bookingNumber, note, pictureUrl }) => ({
                url: `/booking/${bookingNumber}/reject-return`,
                method: "POST",
                body: { note, pictureUrl: pictureUrl ?? null },
            }),
            invalidatesTags: (result, error, { bookingNumber }) => [{ type: "Booking", id: bookingNumber }, "Booking"],
        }),

        getBookingSummary: build.query<ApiResponse<BookingSummaryVO>, string>({
            query: (bookingNumber) => ({
                url: `/Booking/summary/${bookingNumber}`,
                method: "GET",
            }),
            providesTags: (result, error, bookingNumber) => [{ type: "Booking", id: bookingNumber }],
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
    useGetCarOwnerUpcommingBookingsQuery,
    useGetCarOwnerBookingsQuery,
    useGetBookingsQuery,
    useGetBookingsByAccountIdQuery,
    useSearchBookingsByAccountIdQuery,
    useCancelBookingMutation,
    useConfirmPickupMutation,
    useConfirmDepositMutation,
    useReturnCarMutation,
    useCustomerCancelBookingMutation,
    useOwnerCancelBookingMutation,
    useConfirmBookingMutation,
    useRequestReturnMutation,
    useAcceptReturnMutation,
    useRejectReturnMutation,
    useGetBookingDetailQuery,
    useGetBookingSummaryQuery,
    useUpdateBookingMutation,
    useRateCarMutation,
    useGetBookingCarAndUserQuery,
    useCreateBookingMutation,
} = bookingApi;