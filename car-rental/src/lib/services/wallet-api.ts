import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuthCheck } from "@/lib/services/config/baseQuery"

export interface ApiResponse<T> {
    status: number
    message: string
    data: T | null
}

export interface PaginationResponse<T> {
    data: T[]
    totalCount: number
    pageSize: number
    pageNumber: number
    totalPages?: number
}

export interface Transaction {
    id: string
    bookingNumber?: string
    amount: number
    formattedAmount: string
    carName?: string
    message?: string
    createdAt?: string
    formattedDateTime: string
    status?: string
    type?: string
}

export interface TransactionDetail {
    id: string
    walletId: string
    bookingNumber?: string
    amount: number
    formattedAmount: string
    carName?: string
    message?: string
    createdAt?: string
    formattedDateTime: string
    status?: string
    type?: string
    bookingDetails?: string
}

export interface WalletBalance {
    id: string
    balance: number
    formattedBalance: string
}

export interface WithdrawDTO {
    amount: number
    message?: string
}

export interface TopupDTO {
    amount: number
    message?: string
}

export interface TransactionFilterDTO {
    searchTerm?: string
    fromDate?: string
    toDate?: string
    type?: string
    status?: string
    pageNumber?: number
    pageSize?: number
}

export const walletApi = createApi({
    reducerPath: "walletApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["WalletBalance", "Transactions", "TransactionDetail"],
    endpoints: (builder) => ({
        // Get wallet balance
        getWalletBalance: builder.query<ApiResponse<WalletBalance>, string>({
            query: (accountId) => ({
                url: `Wallet/balance/${accountId}`,
                method: "GET",
            }),
            providesTags: (result, error, accountId) => [
                { type: "WalletBalance", id: accountId },
                { type: "WalletBalance", id: "LIST" },
            ],
        }),

        // Create wallet if not exists
        createWallet: builder.mutation<ApiResponse<WalletBalance>, string>({
            query: (accountId) => ({
                url: `Wallet/create/${accountId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, accountId) => [
                { type: "WalletBalance", id: accountId },
                { type: "WalletBalance", id: "LIST" },
            ],
        }),

        // Get transaction history with filters and pagination
        getTransactionHistory: builder.query<
            ApiResponse<PaginationResponse<Transaction>>,
            { accountId: string; filters?: TransactionFilterDTO }
        >({
            query: ({ accountId, filters = {} }) => {
                const params = new URLSearchParams()

                if (filters.searchTerm) params.append("searchTerm", filters.searchTerm)
                if (filters.fromDate) params.append("fromDate", filters.fromDate)
                if (filters.toDate) params.append("toDate", filters.toDate)
                if (filters.type) params.append("type", filters.type)
                if (filters.status) params.append("status", filters.status)
                if (filters.pageNumber) params.append("pageNumber", filters.pageNumber.toString())
                if (filters.pageSize) params.append("pageSize", filters.pageSize.toString())

                return {
                    url: `Wallet/transactions/${accountId}${params.toString() ? `?${params.toString()}` : ""}`,
                    method: "GET",
                }
            },
            providesTags: (result, error, { accountId }) => [
                { type: "Transactions", id: accountId },
                { type: "Transactions", id: "LIST" },
            ],
        }),

        // Get transaction detail
        getTransactionDetail: builder.query<ApiResponse<TransactionDetail>, { accountId: string; transactionId: string }>({
            query: ({ accountId, transactionId }) => ({
                url: `Wallet/transactions/${accountId}/${transactionId}`,
                method: "GET",
            }),
            providesTags: (result, error, { transactionId, accountId }) => [
                { type: "TransactionDetail", id: transactionId },
                { type: "Transactions", id: accountId },
            ],
        }),

        // Withdraw money
        withdrawMoney: builder.mutation<ApiResponse<Transaction>, { accountId: string; dto: WithdrawDTO }>({
            query: ({ accountId, dto }) => ({
                url: `Wallet/withdraw/${accountId}`,
                method: "POST",
                body: dto,
            }),
            invalidatesTags: (result, error, { accountId }) => [
                { type: "WalletBalance", id: accountId },
                { type: "WalletBalance", id: "LIST" },
                { type: "Transactions", id: accountId },
                { type: "Transactions", id: "LIST" },
            ],
            // Optimistic update for better UX
            async onQueryStarted({ accountId, dto }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    // Force refetch of balance and transactions
                    dispatch(
                        walletApi.util.invalidateTags([
                            { type: "WalletBalance", id: accountId },
                            { type: "Transactions", id: accountId },
                        ]),
                    )
                } catch {
                    // Handle error if needed
                }
            },
        }),

        // Top-up money
        topupMoney: builder.mutation<ApiResponse<Transaction>, { accountId: string; dto: TopupDTO }>({
            query: ({ accountId, dto }) => ({
                url: `Wallet/topup/${accountId}`,
                method: "POST",
                body: dto,
            }),
            invalidatesTags: (result, error, { accountId }) => [
                { type: "WalletBalance", id: accountId },
                { type: "WalletBalance", id: "LIST" },
                { type: "Transactions", id: accountId },
                { type: "Transactions", id: "LIST" },
            ],
            // Optimistic update for better UX
            async onQueryStarted({ accountId, dto }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    // Force refetch of balance and transactions
                    dispatch(
                        walletApi.util.invalidateTags([
                            { type: "WalletBalance", id: accountId },
                            { type: "Transactions", id: accountId },
                        ]),
                    )
                } catch {
                    // Handle error if needed
                }
            },
        }),
    }),
})

export const {
    useGetWalletBalanceQuery,
    useCreateWalletMutation,
    useGetTransactionHistoryQuery,
    useGetTransactionDetailQuery,
    useWithdrawMoneyMutation,
    useTopupMoneyMutation,
} = walletApi
