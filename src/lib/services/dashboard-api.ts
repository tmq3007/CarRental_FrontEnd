import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuthCheck} from "@/lib/services/config/baseQuery";
import {ApiResponse, PaginationMetadata, PaginationResponse} from "@/lib/store";
import {CarVO_Detail} from "@/lib/services/car-api";

export interface DashboardStatsVO {
    totalRevenue: number;
    activeBookings: number;
    totalCustomers: number;
    fleetUtilization: number;
    revenueChange: string;
    bookingsChange: string;
    customersChange: string;
    utilizationChange: string;
}

export interface MonthlyRevenueVO {
    month: string;
    total: number;
}

export interface TopBookedVehicleVO {
    carId: string,
    brand: string,
    model: string,
    year: number,
    totalBookings: number,
    revenue: number,
    utilizationRate: number,
    status: string,
    trend: string,
}

export interface TopPayingCustomerVO {
    accountId: string,
    customerName: string,
    email: string,
    phone: string,
    totalPayments: number,
    totalBookings: number,
    memberSince: string,
    lastBooking: string,
    avatar: "/placeholder.svg?height=40&width=40",
    preferredVehicle: string,
}

export interface AccountVO {
    id: string // Guid Id
    email: string // string Email
    isActive: boolean // bool IsActive
    isEmailVerified: boolean // bool IsEmailVerified
    createdAt: string // DateTime CreatedAt
    updatedAt?: string // DateTime? UpdatedAt
    roleId: number // int RoleId
}

export interface AccountFilters {
    sortBy: string
    sortDirection: "asc" | "desc"
    status?: string
    role?: string
    emailVerified?: string
    search?: string
}

export interface CarVO_Full {
    id: string;
    brand: string;
    model: string;
    color: string;
    basePrice: number;
    deposit: number;
    numberOfSeats: number;
    productionYear: number;
    mileage?: number;
    fuelConsumption?: number;
    fuelType: string;
    isAutomatic?: boolean;
    termOfUse?: string;
    additionalFunction?: string;
    description?: string;
    licensePlate?: string;
    houseNumberStreet?: string;
    ward?: string;
    district?: string;
    cityProvince?: string;
    carImageFront?: string | null;
    carImageBack?: string | null;
    carImageLeft?: string | null;
    carImageRight?: string | null;
    insuranceUri?: string | null;
    insuranceUriIsVerified?: boolean;
    registrationPaperUri?: string | null;
    registrationPaperUriIsVerified?: boolean;
    certificateOfInspectionUri?: string | null;
    certificateOfInspectionUriIsVerified?: boolean;
    status: string;
    accountId: string;
    updatedAt: string;
    createdAt: string;
}

export interface CarUnverifiedFilters {
    sortBy: string
    sortDirection: "asc" | "desc"
    brand?: string
    search?: string
}

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ['DashBoard'],
    endpoints: (build) => ({
        getDashboardStats: build.query<ApiResponse<DashboardStatsVO>, void>({
            query: () => ({
                url: "/Dashboard/stats",
                method: "GET",
            }),
        }),

        getMonthlyRevenue: build.query<ApiResponse<MonthlyRevenueVO[]>, number | void>({
            query: (year = new Date().getFullYear()) => ({
                url: `/Dashboard/revenue/monthly?year=${year}`,
                method: "GET",
            }),
        }),

        getTopBookedVehicles: build.query<ApiResponse<TopBookedVehicleVO[]>, void>({
            query: () => ({
                url: "/Dashboard/vehicles/top-booked?count=5",
                method: "GET",
            }),
        }),

        getTopPayingCustomers: build.query<ApiResponse<TopPayingCustomerVO[]>, void>({
            query: () => ({
                url: "/Dashboard/customers/top-paying?count=6",
                method: "GET",
            }),
        }),

        getAccounts: build.query<ApiResponse<{data: AccountVO[], pagination: PaginationMetadata}>, {pageNumber?: number; pageSize?: number; filters?: AccountFilters}>({
            query: ({pageNumber = 1, pageSize = 10, filters = {}}) => {
                const params = new URLSearchParams({
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                    ...(filters.sortBy && {sortBy: filters.sortBy}),
                    ...(filters.sortDirection && {sortDirection: filters.sortDirection}),
                    ...(filters.status && {status: filters.status}),
                    ...(filters.role && {role: filters.role}),
                    ...(filters.emailVerified !== undefined && {emailVerified: filters.emailVerified.toString()}),
                    ...(filters.search && {search: filters.search}),
                });
                return {
                    url: `/Dashboard/accounts/paginated?${params}`,
                    method: "GET",
                };
            },
            providesTags: ['DashBoard'],
        }),

        getCars: build.query<ApiResponse<{data: CarVO_Full[], pagination: PaginationMetadata}>, {pageNumber?: number; pageSize?: number; filters?: CarUnverifiedFilters }>({
            query: ({ pageNumber = 1, pageSize = 10, filters = {} }) => {
                const params = new URLSearchParams({
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                    ...(filters.sortBy && { sortBy: filters.sortBy }),
                    ...(filters.sortDirection && { sortDirection: filters.sortDirection }),
                    ...(filters.brand && { brand: filters.brand }),
                    ...(filters.search && { search: filters.search }),
                });
                return {
                    url: `/Dashboard/cars/unverified/paginated?${params}`,
                    method: "GET",
                };
            },
            providesTags: ['DashBoard'],
        }),

        toggleAccountStatus: build.mutation<ApiResponse<{ Id: string, IsActive: boolean }>, { accountId: string, isActive: boolean }>({
            query: ({ accountId, isActive }) => ({
                url: `/Admin/${accountId}/status`,
                method: "PATCH",
                body: { IsActive: isActive },
            }),
            invalidatesTags: ['DashBoard'],
        }),

        verifyCar: build.mutation<ApiResponse<string>, { carId: string }>({
            query: ({ carId }) => ({
                url: `/Dashboard/cars/toggle-verification/${carId}`,
                method: "PUT",
            }),
            invalidatesTags: ['DashBoard'],
        }),

        getCarsByAccountId: build.query<ApiResponse<{data: CarVO_Full[], pagination: PaginationMetadata}>, {
            accountId: string,
            pageNumber?: number,
            pageSize?: number,
            filters?: CarUnverifiedFilters
        }>({
            query: ({ accountId, pageNumber = 1, pageSize = 10, filters = {} }) => {
                const params = new URLSearchParams({
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                    ...(filters.sortBy && { sortBy: filters.sortBy }),
                    ...(filters.sortDirection && { sortDirection: filters.sortDirection }),
                    ...(filters.brand && { brand: filters.brand }),
                    ...(filters.search && { search: filters.search }),
                });
                return {
                    url: `/Dashboard/cars/account/${accountId}/paginated?${params}`,
                    method: "GET",
                };
            },
            providesTags: (result, error, { accountId }) =>
                result ? [{ type: 'DashBoard', id: `ACCOUNT_CARS_${accountId}` }] : ['DashBoard'],
        }),
    })
});

export const {
    useGetDashboardStatsQuery,
    useGetMonthlyRevenueQuery,
    useGetTopBookedVehiclesQuery,
    useGetTopPayingCustomersQuery,
    useGetAccountsQuery,
    useToggleAccountStatusMutation,
    useVerifyCarMutation,
    useGetCarsByAccountIdQuery,
    useGetCarsQuery
} = dashboardApi;