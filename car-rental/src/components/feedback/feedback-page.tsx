"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User, ChevronDown, Car } from "lucide-react";
import NoResult from "@/components/common/no-result";
import LoadingPage from "@/components/common/loading";
import { Pagination } from "@/components/wallet/pagination";
import { useGetFeedbackReportByAccountIdQuery } from "@/lib/services/feedback-api";

interface FeedbackItemDTO {
    carName: string;
    carImageUrl: string;
    comment?: string;
    rating: number;
    createdAt: string;
    pickUpTime: string;
    dropOffTime: string;
}

interface FeedbackSummaryDTO {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [key: number]: number };
}

interface PaginationMetadata {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface FeedbackReportDTO {
    summary: FeedbackSummaryDTO;
    details: {
        data: FeedbackItemDTO[];
        pagination: PaginationMetadata;
    };
}

export default function FeedbackPage() {
    const userId = useSelector((state: RootState) => state.user?.id);
    const role = useSelector((state: RootState) => state.user?.role);
    const userName = useSelector((state: RootState) => state.user?.full_name || "Guest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { data, isLoading, isError } = useGetFeedbackReportByAccountIdQuery(
        { accountId: userId || "", pageNumber: currentPage, pageSize: itemsPerPage },
        { skip: !userId || role !== "car_owner" }
    );

    const feedbackData = data?.data;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
        ));
    };

    if (role !== "car_owner") {
        return <NoResult />;
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isError || !feedbackData || !feedbackData.details || !feedbackData.details.data || feedbackData.details.data.length === 0) {
        return <NoResult />;
    }

    const paginationMetadata = feedbackData.details.pagination;
    if (!paginationMetadata) {
        console.error("Pagination metadata is undefined in feedbackData.details.pagination");
        return <NoResult />;
    }

    const { totalRecords, totalPages } = paginationMetadata;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gray-600 text-white p-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Car className="w-6 h-6" />
                        <span className="text-lg font-semibold">Rent a car today!</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white hover:text-gray-200">
                            ABOUT US
                        </Button>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Welcome, {userName}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-white border-b px-4 py-2">
                <div className="max-w-6xl mx-auto text-sm text-gray-600">
                    Home {">"} My Reports
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Summary Card */}
                <Card className="bg-white rounded-xl shadow-sm border border-green-100">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Feedback</h1>
                        <h2 className="text-lg text-gray-600 mb-6">Average Ratings</h2>
                        <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-gray-800 mb-2">
                                {feedbackData.summary.averageRating.toFixed(2)}
                            </div>
                            <div className="flex justify-center gap-1 mb-4">
                                {renderStars(Math.round(feedbackData.summary.averageRating))}
                            </div>
                            <div className="text-sm text-gray-600">
                                Based on {feedbackData.summary.totalRatings} ratings
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feedback List */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {feedbackData.details.data.map((feedback, index) => (
                        <Card
                            key={`${feedback.createdAt}-${index}`}
                            className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200 bg-white"
                        >
                            <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                {feedback.carImageUrl ? (
                                    <img
                                        src={feedback.carImageUrl}
                                        alt={feedback.carName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            if (e.currentTarget.nextElementSibling) {
                                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                                        <Car className="w-8 h-8 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-5 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                        {feedback.carName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex gap-1">{renderStars(feedback.rating)}</div>
                                        <span className="text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })}
                    </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {feedback.comment || "No comment provided"}
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <span className="font-medium">From:</span>{" "}
                                        {new Date(feedback.pickUpTime).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="font-medium">To:</span>{" "}
                                        {new Date(feedback.dropOffTime).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalRecords}
                            startIndex={(currentPage - 1) * itemsPerPage}
                            endIndex={Math.min(currentPage * itemsPerPage, totalRecords)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">RENT CARS</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Search Cars and Rates</li>
                            <li>My Wallet</li>
                            <li>My Car</li>
                            <li>Log In</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">CUSTOMER ACCESS</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Manage My Booking</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">JOIN US</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>New User Sign Up</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}