"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, TrendingUp } from "lucide-react"

export default function RatingsReviewsSection() {
  const overallRating = 4.7
  const totalReviews = 142
  const ratingDistribution = [
    { stars: 5, count: 95, percentage: 67 },
    { stars: 4, count: 35, percentage: 25 },
    { stars: 3, count: 10, percentage: 7 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 },
  ]

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-base sm:text-lg">Ratings & Reviews</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {/* Overall Rating */}
        <div className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Overall</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">+5.2%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{overallRating}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.floor(overallRating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-6">{dist.stars}★</span>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 dark:bg-amber-500" style={{ width: `${dist.percentage}%` }} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500 w-7 text-right">{dist.percentage}%</span>
            </div>
          ))}
        </div>

        {/* Recent Feedback */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Feedback</p>
          <div className="text-xs text-gray-600 dark:text-gray-400 italic">
            "Great car and excellent service! Will rent again." - Last review 2 days ago
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
