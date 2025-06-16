import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/services/config/baseQuery";
import { ApiResponse, PaginationMetadata, PaginationResponse } from "@/lib/store";

// Interface for car data
export interface CarSearchVO {
    id: string;
    brand: string;
    model: string;
    type: string;
    rating: number;
    bookedTime: string;
    basePrice: number;
    images: string[];
    specs: {
        engine: string;
        fuel: string;
        transmission: string;
        numberOfSeat: string;
        productionYear: string;
        mileage: string;
        fuelConsumption: string;
        color: string;
    };
    ward: string;
    district: string;
    cityProvince: string;
    status: string;
}

// Define the filter criteria interface
export interface FilterCriteria {
    priceRange: [number, number];
    dailyPriceMax: number;
    carTypes: string[];
    fuelTypes: string[];
    transmissionTypes: string[];
    brands: string[];
    seats: string[];
    searchQuery: string;
    location?: {
        province?: string;
        district?: string;
        ward?: string;
    };
    pickupTime?: Date | null;
    dropoffTime?: Date | null;
    sortBy: string;
    order: "asc" | "desc";
}

export interface QueryCriteria {
    priceRange: [number, number];
    dailyPriceMax: number;
    carTypes: string[];
    fuelTypes: string[];
    transmissionTypes: string[];
    brands: string[];
    seats: string[];
    searchQuery: string;
    location?: {
        province?: string;
        district?: string;
        ward?: string;
    };
    pickupTime?: string | null;
    dropoffTime?: string | null;
    sortBy: string;
    order: "asc" | "desc";
    page: number;
    pageSize: number;
}

export interface CarVO_ViewACar {
    id: number;
    brand: string;
    model: string;
    color: string;
    basePrice: number;
    numberOfSeats: number;
    productionYear: number;
    carImageFront?: string;
    carImageBack?: string;
    carImageLeft?: string;
    carImageRight?: string;
    status: string;
    ward?: string;
    district?: string;
    cityProvince?: string;
}

export interface CarFilters {
    sortBy?: string;
    sortDirection?: "asc" | "desc";
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
    totalRating?: number;
}

// Utility to convert QueryCriteria to query parameters
const toQueryParams = (filters: QueryCriteria): string => {
    const params = new URLSearchParams();

    // Add priceRange as min and max
    params.append("priceRangeMin", filters.priceRange[0].toString());
    params.append("priceRangeMax", filters.priceRange[1].toString());

    // Add dailyPriceMax
    params.append("dailyPriceMax", filters.dailyPriceMax.toString());

    // Add arrays (carTypes, fuelTypes, etc.) as comma-separated values
    if (filters.carTypes.length > 0) params.append("carTypes", filters.carTypes.join(","));
    if (filters.fuelTypes.length > 0) params.append("fuelTypes", filters.fuelTypes.join(","));
    if (filters.transmissionTypes.length > 0) params.append("transmissionTypes", filters.transmissionTypes.join(","));
    if (filters.brands.length > 0) params.append("brands", filters.brands.join(","));
    if (filters.seats.length > 0) params.append("seats", filters.seats.join(","));

    // Add searchQuery
    if (filters.searchQuery.trim()) params.append("searchQuery", filters.searchQuery);

    // Add location fields if they exist
    if (filters.location) {
        if (filters.location.province) params.append("locationProvince", filters.location.province);
        if (filters.location.district) params.append("locationDistrict", filters.location.district);
        if (filters.location.ward) params.append("locationWard", filters.location.ward);
    }

    // Add pickupTime and dropoffTime if they exist
    if (filters.pickupTime) params.append("pickupTime", filters.pickupTime);
    if (filters.dropoffTime) params.append("dropoffTime", filters.dropoffTime);

    // Add pagination parameters
    params.append("page", filters.page.toString());
    params.append("pageSize", filters.pageSize.toString());

    // Add sort parameters
    params.append("sortBy", filters.sortBy);
    params.append("order", filters.order);

    return params.toString();
};

export const carApi = createApi({
    reducerPath: "carApi",
    baseQuery: baseQuery,
    endpoints: (build) => ({
        getCars: build.query<ApiResponse<PaginationResponse<CarVO_ViewACar[]>>, { accountId: string; pageNumber?: number; pageSize?: number; filters?: CarFilters }>({
            query: ({ accountId, pageNumber = 1, pageSize = 10, filters = {} }) => {
                const params = new URLSearchParams({
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                    ...(filters.sortBy && { sortBy: filters.sortBy }),
                    ...(filters.sortDirection && { sortDirection: filters.sortDirection }),
                });
                return {
                    url: `/car/${accountId}/paginated?${params}`,
                    method: "GET",
                };
            },
        }),

        getCarDetail: build.query<ApiResponse<CarVO_Detail>, string>({
            query: (carId) => ({
                url: `/Car/${carId}/detail`,
                method: "GET",
            }),
        }),

        searchCars: build.query<ApiResponse<{data: CarSearchVO[], pagination: PaginationMetadata}>, QueryCriteria>({
            query: (filters) => ({
                url: `/Car/search?${toQueryParams(filters)}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetCarsQuery,
    useGetCarDetailQuery,
    useSearchCarsQuery,
} = carApi;