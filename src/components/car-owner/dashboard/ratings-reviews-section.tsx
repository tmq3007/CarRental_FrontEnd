"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, TrendingUp } from "lucide-react"
import {
  useGetRatingSummaryQuery,
  useGetRecentReviewsQuery,
  type CarOwnerRatingDistributionItem,
} from "@/lib/services/car-owner-api"

interface RatingsReviewsSectionProps {
  accountId: string
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const diff = Date.now() - date.getTime()

  const seconds = Math.round(diff / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  return "Just now"
}

const defaultDistribution: CarOwnerRatingDistributionItem[] = [
  { stars: 5, count: 0, percentage: 0 },
  { stars: 4, count: 0, percentage: 0 },
  { stars: 3, count: 0, percentage: 0 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
]

export default function RatingsReviewsSection({ accountId }: RatingsReviewsSectionProps) {
  const {
    data: summaryResponse,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetRatingSummaryQuery({ accountId })
  const {
    data: reviewsResponse,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useGetRecentReviewsQuery({ accountId, limit: 3 })

  const summary = summaryResponse?.data
  const distribution = summary?.distribution ?? defaultDistribution
  const reviews = reviewsResponse?.data ?? []

  const overallRating = summary?.overallRating ?? 0
  const totalReviews = summary?.totalReviews ?? 0
  const trendChange = summary?.trendChange ?? ""
  const trendPositive = trendChange.startsWith("+")

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-base sm:text-lg">Ratings & Reviews</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {summaryError ? (
          <div className="text-sm text-red-600">Failed to load rating summary.</div>
        ) : (
          <div className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Overall</span>
              {trendChange && (
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3.5 w-3.5 ${trendPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
                  <span
                    className={`text-xs font-semibold ${trendPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {trendChange}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaryLoading ? "…" : overallRating.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const filled = overallRating >= i + 1
                  return (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                    />
                  )
                })}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {summaryLoading ? "Loading reviews…" : `${totalReviews} review${totalReviews === 1 ? "" : "s"}`}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {(summaryLoading ? defaultDistribution : distribution).map((dist) => (
            <div key={dist.stars} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-6">{dist.stars}★</span>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 dark:bg-amber-500"
                  style={{ width: `${summaryLoading ? 0 : dist.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500 w-7 text-right">
                {summaryLoading ? "-" : `${dist.percentage}%`}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Feedback</p>
          {reviewsError ? (
            <div className="text-xs text-red-600">Unable to load recent feedback.</div>
          ) : reviewsLoading ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">Loading feedback…</div>
          ) : reviews.length === 0 ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">No feedback yet.</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{review.reviewerName}</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-500">{formatRelativeTime(review.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <p className="italic">“{review.comment || "No comment left."}”</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
