"use client"

import { useState } from "react"
import { WalletBalance } from "@/components/wallet/wallet-balance"
import { TransactionTable } from "@/components/wallet/transaction-table"
import { Pagination } from "@/components/wallet/pagination"
import { WithdrawModal } from "@/components/wallet/withdraw-modal"
import { TopupModal } from "@/components/wallet/topup-modal"

import { toast } from "sonner"
import {
    TransactionFilterDTO,
    useCreateWalletMutation, useGetTransactionHistoryQuery,
    useGetWalletBalanceQuery,
    useTopupMoneyMutation,
    useWithdrawMoneyMutation
} from "@/lib/services/wallet-api";
import {TransactionFilters} from "@/components/wallet/transaction-filter";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import LoadingPage from "@/components/common/loading";

// You would get this from auth context or props

export default function WalletPage() {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showTopupModal, setShowTopupModal] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [topupAmount, setTopupAmount] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const ACCOUNT_ID = useSelector((state: RootState) => state.user?.id)

    // API queries and mutations
    const {
        data: walletData,
        isLoading: isLoadingBalance,
        error: balanceError,
        refetch: refetchBalance,
    } = useGetWalletBalanceQuery(ACCOUNT_ID)

    const [createWallet] = useCreateWalletMutation()
    const [withdrawMoney, { isLoading: isWithdrawing }] = useWithdrawMoneyMutation()
    const [topupMoney, { isLoading: isToppingUp }] = useTopupMoneyMutation()

    // Build filters for transaction history
    const filters: TransactionFilterDTO = {
        searchTerm: searchTerm || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    }

    const {
        data: transactionData,
        isLoading: isLoadingTransactions,
        refetch: refetchTransactions,
    } = useGetTransactionHistoryQuery({
        accountId: ACCOUNT_ID,
        filters,
    })

    const handleWithdraw = async () => {
        try {
            const amount = Number.parseInt(withdrawAmount)
            if (amount <= 0) {
                toast.error("Please enter a valid amount")
                return
            }

            const result = await withdrawMoney({
                accountId: ACCOUNT_ID,
                dto: { amount, message: "Withdrawal from wallet" },
            }).unwrap()

            toast.success("Money withdrawn successfully")
            setShowWithdrawModal(false)
            setWithdrawAmount("")

            // Force refetch both balance and transactions
            setTimeout(() => {
                refetchBalance()
                refetchTransactions()
            }, 100)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to withdraw money")
        }
    }

    const handleTopup = async () => {
        try {
            const amount = Number.parseInt(topupAmount)
            if (amount <= 0) {
                toast.error("Please enter a valid amount")
                return
            }

            const result = await topupMoney({
                accountId: ACCOUNT_ID,
                dto: { amount, message: "Top-up to wallet" },
            }).unwrap()

            toast.success("Money topped up successfully")
            setShowTopupModal(false)
            setTopupAmount("")

            // Force refetch both balance and transactions
            setTimeout(() => {
                refetchBalance()
                refetchTransactions()
            }, 100)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to top-up money")
        }
    }

    const handleSearch = () => {
        setCurrentPage(1)
        refetchTransactions()
    }

    const handleClearFilters = () => {
        setSearchTerm("")
        setFromDate("")
        setToDate("")
        setCurrentPage(1)
    }

    const canClear = !!(searchTerm || fromDate || toDate)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Create wallet if it doesn't exist
    const handleCreateWallet = async () => {
        try {
            await createWallet(ACCOUNT_ID).unwrap()
            toast.success("Wallet created successfully")
            // Refetch balance after creating wallet
            setTimeout(() => {
                refetchBalance()
            }, 100)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create wallet")
        }
    }

    const balance = walletData?.data?.formattedBalance || "0 VND"
    const currentBalance = walletData?.data?.balance || 0
    const transactions = transactionData?.data?.data || []
    const totalCount = transactionData?.data?.totalCount || 0
    const totalPages = Math.ceil(totalCount / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalCount)

    if (isLoadingBalance) {
        return <LoadingPage/>
    }

    // Show create wallet button if wallet doesn't exist
    if (balanceError || (!walletData?.data && !isLoadingBalance)) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold mb-4">Wallet Not Found</h2>
                        <p className="text-gray-600 mb-6">You don't have a wallet yet. Create one to get started.</p>
                        <button
                            onClick={handleCreateWallet}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Create Wallet
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <nav className="text-sm text-gray-600 mb-2">
                        <span>Home</span> {">"} <span>My Wallet</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                </div>

                {/* Balance Section */}
                <WalletBalance
                    balance={balance}
                    onWithdraw={() => setShowWithdrawModal(true)}
                    onTopup={() => setShowTopupModal(true)}
                />

                {/* Transactions Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Transactions</h2>

                    <TransactionFilters
                        searchTerm={searchTerm}
                        fromDate={fromDate}
                        toDate={toDate}
                        onSearchTermChange={setSearchTerm}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onSearch={handleSearch}
                        onClear={handleClearFilters}
                        canClear={canClear}
                    />

                    {isLoadingTransactions ? (
                        <div className="text-center py-8">Loading transactions...</div>
                    ) : (
                        <>
                            <TransactionTable transactions={transactions} startIndex={startIndex} />

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalCount}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>

            <WithdrawModal
                isOpen={showWithdrawModal}
                currentBalance={currentBalance}
                withdrawAmount={withdrawAmount}
                onClose={() => setShowWithdrawModal(false)}
                onAmountChange={setWithdrawAmount}
                onConfirm={handleWithdraw}
            />

            <TopupModal
                isOpen={showTopupModal}
                topupAmount={topupAmount}
                onClose={() => setShowTopupModal(false)}
                onAmountChange={setTopupAmount}
                onConfirm={handleTopup}
            />
        </div>
    )
}
