import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuthCheck} from "@/lib/services/config/baseQuery";
import {ApiResponse} from "@/lib/store";

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
    })
});

export const {
    useGetDashboardStatsQuery,
    useGetMonthlyRevenueQuery,
    useGetTopBookedVehiclesQuery,
    useGetTopPayingCustomersQuery
} = dashboardApi;