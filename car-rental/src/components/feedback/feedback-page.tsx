"use client"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, User, ChevronDown, Car, Calendar, Clock } from "lucide-react"
import NoResult from "@/components/common/no-result"
import LoadingPage from "@/components/common/loading"
import { Pagination } from "@/components/wallet/pagination"
import { useGetFeedbackReportByAccountIdQuery } from "@/lib/services/feedback-api"

interface FeedbackItemDTO {
    carName: string
    carImageUrl: string
    comment?: string
    rating: number
    createdAt: string
    pickUpTime: string
    dropOffTime: string
}

interface FeedbackSummaryDTO {
    averageRating: number
    totalRatings: number
    ratingDistribution: { [key: number]: number }
}

interface PaginationMetadata {
    pageNumber: number
    pageSize: number
    totalRecords: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

interface FeedbackReportDTO {
    summary: FeedbackSummaryDTO
    details: {
        data: FeedbackItemDTO[]
        pagination: PaginationMetadata
    }
}

export default function FeedbackPage() {
    const userId = useSelector((state: RootState) => state.user?.id)
    const role = useSelector((state: RootState) => state.user?.role)
    const userName = useSelector((state: RootState) => state.user?.full_name || "Guest")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const { data, isLoading, isError } = useGetFeedbackReportByAccountIdQuery(
        { accountId: userId || "", pageNumber: currentPage, pageSize: itemsPerPage },
        { skip: !userId || role !== "car_owner" },
    )

    const feedbackData = data?.data

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
        ))
    }

    if (role !== "car_owner") {
        return <NoResult />
    }

    if (isLoading) {
        return <LoadingPage />
    }

    if (
        isError ||
        !feedbackData ||
        !feedbackData.details ||
        !feedbackData.details.data ||
        feedbackData.details.data.length === 0
    ) {
        return <NoResult />
    }

    const paginationMetadata = feedbackData.details.pagination
    if (!paginationMetadata) {
        console.error("Pagination metadata is undefined in feedbackData.details.pagination")
        return <NoResult />
    }

    const { totalRecords, totalPages } = paginationMetadata

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-xl">
                <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Rent a car today!
            </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            className="text-white hover:text-blue-300 hover:bg-slate-700/50 transition-all duration-200"
                        >
                            ABOUT US
                        </Button>
                        <div className="flex items-center gap-3 bg-slate-700/50 rounded-full px-4 py-2">
                            <div className="p-1 bg-blue-600 rounded-full">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Welcome, {userName}</span>
                            <ChevronDown className="w-4 h-4 text-slate-300" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-6 py-3">
                <div className="max-w-7xl mx-auto text-sm text-slate-600">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
                    <span className="mx-2 text-slate-400">{">"}</span>
                    <span className="text-blue-600 font-medium">My Reports</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Summary Card */}
                <Card className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5"></div>
                    <CardContent className="relative p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">My Feedback</h1>
                                <p className="text-slate-600">Average Ratings Overview</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center">
                                <div className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                                    {feedbackData.summary.averageRating.toFixed(1)}
                                </div>
                                <div className="flex justify-center gap-1 mb-4">
                                    {renderStars(Math.round(feedbackData.summary.averageRating))}
                                </div>
                                <div className="text-slate-600 font-medium">Based on {feedbackData.summary.totalRatings} ratings</div>
                            </div>

                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = feedbackData.summary.ratingDistribution[star] || 0
                                    const percentage =
                                        feedbackData.summary.totalRatings > 0 ? (count / feedbackData.summary.totalRatings) * 100 : 0

                                    return (
                                        <div key={star} className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-slate-600 w-8">{star}</span>
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-slate-500 w-12">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feedback List */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {feedbackData.details.data.map((feedback, index) => (
                        <Card
                            key={`${feedback.createdAt}-${index}`}
                            className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-2xl overflow-hidden hover:-translate-y-1"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                {feedback.carImageUrl ? (
                                    <img
                                        src={feedback.carImageUrl || "/placeholder.svg"}
                                        alt={feedback.carName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none"
                                            if (e.currentTarget.nextElementSibling) {
                                                ;(e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-200 flex items-center justify-center">
                                        <Car className="w-12 h-12 text-slate-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                                        {feedback.carName}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">{renderStars(feedback.rating)}</div>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {new Date(feedback.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                      })}
                    </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm text-slate-700 italic">"{feedback.comment || "No comment provided"}"</p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span className="font-medium">From:</span>
                                        </div>
                                        <span className="text-slate-700">
                      {new Date(feedback.pickUpTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })}
                    </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-red-500" />
                                            <span className="font-medium">To:</span>
                                        </div>
                                        <span className="text-slate-700">
                      {new Date(feedback.dropOffTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })}
                    </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
                        <CardContent className="p-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalRecords}
                                startIndex={(currentPage - 1) * itemsPerPage}
                                endIndex={Math.min(currentPage * itemsPerPage, totalRecords)}
                                onPageChange={setCurrentPage}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-12 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-400">RENT CARS</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="hover:text-blue-400 cursor-pointer transition-colors">Search Cars and Rates</li>
                                <li className="hover:text-blue-400 cursor-pointer transition-colors">My Wallet</li>
                                <li className="hover:text-blue-400 cursor-pointer transition-colors">My Car</li>
                                <li className="hover:text-blue-400 cursor-pointer transition-colors">Log In</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-400">CUSTOMER ACCESS</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="hover:text-blue-400 cursor-pointer transition-colors">Manage My Booking</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-blue-400">JOIN US</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="hover:text-blue-400 cursor-pointer transition-colors">New User Sign Up</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-600 mt-8 pt-8 text-center text-slate-400">
                        <p>&copy; 2024 Rent a car today! All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
