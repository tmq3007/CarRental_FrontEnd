import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery";
import { ApiResponse, PaginationMetadata, PaginationResponse } from "@/lib/store";
import { useCarFormData } from "@/lib/hook/useCarFormData";
import toQueryParams from "../hook/useToQueryParam";

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

export interface CarFilters {
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface AddCarDTO {
  LicensePlate: string;
  BrandName: string;
  Model: string;
  ProductionYear: string;
  Transmission: string;
  Color: string;
  NumberOfSeats: string;
  Fuel: string;
  Documents: {
    RegistrationPaper: File | null;
    CertificateOfInspection: File | null;
    Insurance: File | null;
  };
  Mileage: string;
  FuelConsumption: string;
  Address: {
    Search: string;
    ProvinceCode: number | null
    ProvinceName: string
    DistrictCode: number | null
    DistrictName: string
    WardCode: number | null
    WardName: string
    HouseNumber: string;
  };
  Description: string;
  AdditionalFunctions: {
    Bluetooth: boolean;
    GPS: boolean;
    Camera: boolean;
    SunRoof: boolean;
    ChildLock: boolean;
    ChildSeat: boolean;
    DVD: boolean;
    USB: boolean;
  };
  Images: {
    Front: File | null;
    Back: File | null;
    Left: File | null;
    Right: File | null;
  };
  BasePrice: string;
  RequiredDeposit: string;
  TermsOfUse: {
    NoSmoking: boolean;
    NoFoodInCar: boolean;
    NoPet: boolean;
    Other: boolean;
    OtherText: string;
  };
}
// Define the filter criteria interface
export interface FilterCriteria {
    priceRange: [number, number];
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





// Tạo carApi chung
export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: baseQueryWithAuthCheck, // có thể sửa về baseQuery nếu muốn cho public API
  endpoints: (build) => ({
    // ADMIN / OWNER API
    getCars: build.query<ApiResponse<{data:CarVO_ViewACar[], pagination: PaginationMetadata}>, { accountId: string; pageNumber?: number; pageSize?: number; filters?: CarFilters }>({
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

    addCar: build.mutation<ApiResponse<CarVO_Detail>, AddCarDTO>({
      query: (addCarDTO) => {
        const { toFormData } = useCarFormData();
        const formData = toFormData(addCarDTO);
        return {
          url: "/Car/add",
          method: "POST",
          body: formData,
        };
      },
    }),

    // USER SEARCH API
    searchCars: build.query<ApiResponse<{ data: CarSearchVO[]; pagination: PaginationMetadata }>, QueryCriteria>({
      query: (filters) => ({
        url: `/Car/search?${toQueryParams(filters)}`,
        method: "GET",
      }),
    }),
  }),
});

// Hook exports
export const {
  useGetCarsQuery,
  useGetCarDetailQuery,
  useAddCarMutation,
  useSearchCarsQuery,
} = carApi;
