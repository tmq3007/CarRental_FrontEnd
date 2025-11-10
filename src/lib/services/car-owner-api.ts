import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery"
import type { ApiResponse } from "@/lib/store"

export interface CarOwnerMonthlyRevenue {
	month: string
	total: number
}

export interface CarOwnerEarningsMetrics {
	totalRevenue: number | null
	revenueChange: string
	netProfit: number | null
	netProfitChange: string
	pendingPayouts: number | null
	averageBookingValue: number | null
	averageBookingValueChange: string
	completedBookingsThisMonth: number | null
	monthlyRevenue: CarOwnerMonthlyRevenue[]
	totalBookings?: number | null
	bookingsChange?: string
	totalCustomers?: number | null
	customersChange?: string
}

export interface CarOwnerFleetMetrics {
	fleetUtilization: number | null
	utilizationChange: string
	totalBookings: number | null
	bookingsChange: string
	averageBookingDurationDays: number | null
	averageBookingDurationChange: string
	upcomingBookings: number | null
	cancellationRate: number | null
	cancellationRateChange: string
	activeFleet: number | null
	inactiveFleet: number | null
	fleetSize: number | null
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
		getEarningsMetrics: build.query<ApiResponse<CarOwnerEarningsMetrics>, void>({
			query: () => ({
				url: "/car-owner/dashboard/earnings",
				method: "GET",
			}),
			providesTags: ["CarOwnerDashboard"],
		}),
		getFleetMetrics: build.query<ApiResponse<CarOwnerFleetMetrics>, void>({
			query: () => ({
				url: "/car-owner/dashboard/fleet",
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
	useGetEarningsMetricsQuery,
	useGetFleetMetricsQuery,
	useGetRatingSummaryQuery,
	useGetRecentReviewsQuery,
} = carOwnerApi
