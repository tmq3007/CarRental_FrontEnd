import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery} from "@/lib/services/config/baseQuery";
import {ApiResponse} from "@/lib/store";


export interface CarVO_ViewACar {
    id: number
    brand: string
    model: string
    color: string
    basePrice: number
    numberOfSeats: number
    productionYear: number
    carImageFront?: string
    carImageBack?: string
    carImageLeft?: string
    carImageRight?: string
    status: string
    ward?: string
    district?: string
    cityProvince?: string
}

export interface PaginationResponse {
    data: CarVO_ViewACar[]
    pageNumber: number
    pageSize: number
    totalRecords: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface CarFilters {
    sortBy?: string
    sortDirection?: "asc" | "desc"
}

export interface CarVO_Detail {
    id: string;
    brand?: string;
    model?: string;
    color?: string;
    basePrice: number;
    deposit: number;
    numberOfSeats?: number;
    productionYear?: number;
    mileage?: number;
    fuelConsumption?: number;
    isGasoline?: boolean;
    isAutomatic?: boolean;
    termOfUse?: string;
    additionalFunction?: string;
    description?: string;
    licensePlate?: string;
    houseNumberStreet?: string;
    ward?: string;
    district?: string;
    cityProvince?: string;
    carImageFront?: string;
    carImageBack?: string;
    carImageLeft?: string;
    carImageRight?: string;
    insuranceUri?: string;
    insuranceUriIsVerified?: boolean;
    registrationPaperUri?: string;
    registrationPaperUriIsVerified?: boolean;
    certificateOfInspectionUri?: string;
    certificateOfInspectionUriIsVerified?: boolean;
    status: string;
    accountId: string;
    numberOfRides: number;
    rating?: number;
    totalRating?: number
}


export const carApi = createApi({
    reducerPath: "carApi",
    baseQuery: baseQuery,
    endpoints: (build) => ({

        getCars: build.query<ApiResponse<PaginationResponse>, { accountId: string, pageNumber?: number, pageSize?: number, filters?: CarFilters }>({
            query: ({ accountId, pageNumber = 1, pageSize = 10, filters = {} }) => {
                const params = new URLSearchParams({
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                    ...(filters.sortBy && { sortBy: filters.sortBy }),
                    ...(filters.sortDirection && { sortDirection: filters.sortDirection }),
                });
                return {
                    url: `/car/${accountId}/paginated?${params}`,
                    method: 'GET',
                };
            },
        }),

        getCarDetail: build.query<ApiResponse<CarVO_Detail>, string>({
            query: (carId) => ({
                url: `/Car/${carId}/detail`,
                method: 'GET',
            }),
        }),

    }),
})

export const {
    useGetCarsQuery,
    useGetCarDetailQuery
} = carApi

