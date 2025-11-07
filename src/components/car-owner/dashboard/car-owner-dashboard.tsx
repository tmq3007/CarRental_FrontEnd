"use client"
import EarningsSummaryCards from "./earnings-summary-cards"
import UpcomingBookingsList from "./upcoming-bookings-list"
import RatingsReviewsSection from "./ratings-reviews-section"
import AnalyticsInsights from "./analytics-insights"

interface CarOwnerDashboardProps {
  userId: string
}

export default function CarOwnerDashboard({ userId }: CarOwnerDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <section className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back! Here's your car rental business overview.
          </p>
        </section>

        {/* Earnings Summary Cards */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Key Metrics</h2>
          <EarningsSummaryCards />
        </section>

        {/* Business Activity Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Business Activity
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Upcoming Bookings - Takes 2 columns */}
            <div className="lg:col-span-2">
              <UpcomingBookingsList accountId={userId} />
            </div>

            {/* Ratings & Reviews - Takes 1 column */}
            <div>
              <RatingsReviewsSection accountId={userId} />
            </div>
          </div>
        </section>

        {/* Analytics & Insights */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Analytics & Insights
          </h2>
          <AnalyticsInsights />
        </section>
      </div>
    </div>
  )
}
