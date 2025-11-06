"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function RatingsReviewsSection() {
  // Mock data - replace with real API calls
  const averageRating = 4.8
  const totalReviews = 45

  const ratingDistribution = [
    { stars: 5, count: 35, percentage: 78 },
    { stars: 4, count: 7, percentage: 15 },
    { stars: 3, count: 2, percentage: 4 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ]

  const recentReviews = [
    {
      id: 1,
      customerName: "Sarah Wilson",
      carName: "Toyota Corolla",
      rating: 5,
      text: "Smooth ride, great condition!",
      date: "Oct 28, 2025",
    },
    {
      id: 2,
      customerName: "Mike Chen",
      carName: "Honda Civic",
      rating: 4,
      text: "Very satisfied with the service",
      date: "Oct 25, 2025",
    },
    {
      id: 3,
      customerName: "Emma Davis",
      carName: "BMW 3 Series",
      rating: 5,
      text: "Excellent experience overall",
      date: "Oct 22, 2025",
    },
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          Ratings & Reviews
        </CardTitle>
        <CardDescription>Customer feedback summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating */}
        <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-8">{item.stars}★</span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${item.percentage}%` }} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Recent Reviews */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Recent Reviews</h4>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{review.customerName}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{review.text}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
