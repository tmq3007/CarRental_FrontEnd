import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery"
import type { ApiResponse } from "@/lib/store"

export interface CarOwnerDashboardStats {
	totalRevenue: number
	activeBookings: number
	totalCustomers: number
	fleetUtilization: number
	revenueChange: string
	bookingsChange: string
	customersChange: string
	utilizationChange: string
}

export interface CarOwnerMonthlyRevenue {
	month: string
	total: number
}

export interface CarOwnerRatingDistributionItem {
	stars: number
	count: number
	percentage: number
}

export interface CarOwnerRatingSummary {
	overallRating: number
	totalReviews: number
	trendChange: string
	distribution: CarOwnerRatingDistributionItem[]
}

export interface CarOwnerRecentReview {
	id: string
	reviewerName: string
	comment: string
	rating: number
	createdAt: string
}

export const carOwnerApi = createApi({
	reducerPath: "carOwnerApi",
	baseQuery: baseQueryWithAuthCheck,
	tagTypes: ["CarOwnerDashboard"],
	endpoints: (build) => ({
		getDashboardStats: build.query<ApiResponse<CarOwnerDashboardStats>, void>({
			query: () => ({
				url: "/car-owner/dashboard/stats",
				method: "GET",
			}),
			providesTags: ["CarOwnerDashboard"],
		}),
		getMonthlyRevenue: build.query<ApiResponse<CarOwnerMonthlyRevenue[]>, number | void>({
			query: (year = new Date().getFullYear()) => ({
				url: `/car-owner/dashboard/revenue/monthly?year=${year}`,
				method: "GET",
			}),
			providesTags: ["CarOwnerDashboard"],
		}),
		getRatingSummary: build.query<ApiResponse<CarOwnerRatingSummary>, { accountId: string }>({
			query: ({ accountId }) => ({
				url: `/car-owner/dashboard/${accountId}/ratings/summary`,
				method: "GET",
			}),
			providesTags: ["CarOwnerDashboard"],
		}),
		getRecentReviews: build.query<
			ApiResponse<CarOwnerRecentReview[]>,
			{ accountId: string; limit?: number }
		>({
			query: ({ accountId, limit = 3 }) => ({
				url: `/car-owner/dashboard/${accountId}/ratings/recent?limit=${limit}`,
				method: "GET",
			}),
			providesTags: ["CarOwnerDashboard"],
		}),
	}),
})

export const {
	useGetDashboardStatsQuery,
	useGetMonthlyRevenueQuery,
	useGetRatingSummaryQuery,
	useGetRecentReviewsQuery,
} = carOwnerApi
