import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const feedbackApi = createApi({
    reducerPath: "feedbackApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5227/api/" }),
    endpoints: (builder) => ({
        getFeedbackReportByAccountId: builder.query<
            { status: number; message: string; data: FeedbackReportDTO },
            { accountId: string; pageNumber: number; pageSize: number }
        >({
            query: ({ accountId, pageNumber, pageSize }) => ({
                url: `FeedbackReport/${accountId}/paginated`,
                params: { pageNumber, pageSize },
            }),
        }),
    }),
});

export const { useGetFeedbackReportByAccountIdQuery } = feedbackApi;