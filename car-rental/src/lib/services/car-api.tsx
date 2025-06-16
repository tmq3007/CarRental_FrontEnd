import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuthCheck} from "@/lib/services/config/baseQuery";
import {ApiResponse} from "@/lib/store";
import {useCarFormData} from "@/lib/hook/useCarFormData";


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

export interface AddCarDTO {
    // Basic Info
    LicensePlate: string
    BrandName: string
    Model: string
    ProductionYear: string
    Transmission: string
    Color: string
    NumberOfSeats: string
    Fuel: string
    Documents: {
        RegistrationPaper: File | null
        CertificateOfInspection: File | null
        Insurance: File | null
    }

    // Details
    Mileage: string
    FuelConsumption: string
    Address: {
        Search: string
        CityProvince: string
        District: string
        Ward: string
        HouseNumber: string
    }
    Description: string
    AdditionalFunctions: {
        Bluetooth: boolean
        GPS: boolean
        Camera: boolean
        SunRoof: boolean
        ChildLock: boolean
        ChildSeat: boolean
        DVD: boolean
        USB: boolean
    }
    Images: {
        Front: File | null
        Back: File | null
        Left: File | null
        Right: File | null
    }

    // Pricing
    BasePrice: string
    RequiredDeposit: string
    TermsOfUse: {
        NoSmoking: boolean
        NoFoodInCar: boolean
        NoPet: boolean
        Other: boolean
        OtherText: string
    }
}


export const carApi = createApi({
    reducerPath: "carApi",
    baseQuery: baseQueryWithAuthCheck,
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

        addCar: build.mutation<ApiResponse<CarVO_Detail>, AddCarDTO>({
            query: (addCarDTO) => {
                const { toFormData } = useCarFormData();
                const formData = toFormData(addCarDTO);

                return {
                    url: '/Car/add',
                    method: 'POST',
                    body: formData,
                };
            },
        }),

    }),
})

export const {
    useGetCarsQuery,
    useGetCarDetailQuery,
    useAddCarMutation
} = carApi

