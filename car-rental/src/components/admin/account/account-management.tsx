"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Search,
    User,
    Mail,
    CheckCircle,
    Eye,
    UserX,
    UserCheck,
    Ban,
    Shield,
    Calendar,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useToggleAccountStatusMutation } from "@/lib/services/dashboard-api"

// Mock data and types
interface Account {
    id: string
    email: string
    roleId: number
    isActive: boolean
    isEmailVerified: boolean
    createdAt: string
    updatedAt?: string
}

interface Pagination {
    pageNumber: number
    pageSize: number
    totalPages: number
    totalRecords: number
}

interface ConfirmDialog {
    isOpen: boolean
    title: string
    description: string
    actionLabel: string
    variant: "default" | "destructive"
    action: () => void
}

// Mock data
const mockAccounts: Account[] = Array.from({ length: 50 }, (_, i) => ({
    id: `acc-${i + 1}`,
    email: `user${i + 1}@example.com`,
    roleId: Math.floor(Math.random() * 4) + 1,
    isActive: Math.random() > 0.3,
    isEmailVerified: Math.random() > 0.2,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt:
        Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
}))

const NoResult = () => (
    <div className="text-center py-8">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No results found</p>
    </div>
)

export default function AccountManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("createdAt-desc")
    const [filters, setFilters] = useState({
        status: "all",
        emailVerified: "all",
        role: "all",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [toggleAccountStatus] = useToggleAccountStatusMutation()

    // Filter and sort accounts
    const filteredAccounts = mockAccounts.filter((account) => {
        const matchesSearch =
            account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            filters.status === "all" ||
            (filters.status === "active" && account.isActive) ||
            (filters.status === "inactive" && !account.isActive)

        const matchesVerification =
            filters.emailVerified === "all" ||
            (filters.emailVerified === "verified" && account.isEmailVerified) ||
            (filters.emailVerified === "unverified" && !account.isEmailVerified)

        const matchesRole = filters.role === "all" || account.roleId.toString() === filters.role

        return matchesSearch && matchesStatus && matchesVerification && matchesRole
    })

    // Sort accounts
    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        const [field, direction] = sortBy.split("-")
        const multiplier = direction === "desc" ? -1 : 1

        switch (field) {
            case "createdAt":
                return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier
            case "email":
                return a.email.localeCompare(b.email) * multiplier
            case "roleId":
                return (a.roleId - b.roleId) * multiplier
            default:
                return 0
        }
    })

    // Pagination
    const totalRecords = sortedAccounts.length
    const totalPages = Math.ceil(totalRecords / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedAccounts = sortedAccounts.slice(startIndex, startIndex + pageSize)

    const pagination: Pagination = {
        pageNumber: currentPage,
        pageSize,
        totalPages,
        totalRecords,
    }

    const accounts = {
        data: {
            data: paginatedAccounts,
        },
    }

    // Handlers
    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }))
        setCurrentPage(1)
    }

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number.parseInt(value))
        setCurrentPage(1)
    }

    const performStatusChange = async (accountId: string, isActive: boolean) => {
        setIsUpdating(accountId)
        const toastId = toast.loading(`${isActive ? "Activating" : "Deactivating"} account...`)

        try {
            const response = await toggleAccountStatus({ accountId, isActive }).unwrap()

            const accountIndex = mockAccounts.findIndex((acc) => acc.id === accountId)
            if (accountIndex !== -1) {
                mockAccounts[accountIndex].isActive = response.data.isActive
                mockAccounts[accountIndex].updatedAt = new Date().toISOString()
            }

            if (selectedCustomer?.id === accountId) {
                setSelectedCustomer({
                    ...selectedCustomer,
                    isActive: response.data.isActive,
                    updatedAt: new Date().toISOString(),
                })
            }

            toast.success(`Account ${isActive ? "activated" : "deactivated"} successfully!`, { id: toastId })
        } catch (error) {
            console.error("Error changing account status:", error)
            toast.error(`Failed to ${isActive ? "activate" : "deactivate"} account. Please try again.`, { id: toastId })
        } finally {
            setIsUpdating(null)
            setConfirmDialog(null)
        }
    }

    const handleAccountAction = async (action: string, accountId: string) => {
        const account = mockAccounts.find((acc) => acc.id === accountId)
        if (!account) return

        if (action === "view") {
            setSelectedCustomer(account)
            setIsViewDialogOpen(true)
        } else if (action === "changeUserStatus") {
            const isActivating = !account.isActive
            setConfirmDialog({
                isOpen: true,
                title: `${isActivating ? "Activate" : "Deactivate"} Account`,
                description: `Are you sure you want to ${isActivating ? "activate" : "deactivate"} this account?`,
                actionLabel: isActivating ? "Activate" : "Deactivate",
                variant: isActivating ? "default" : "destructive",
                action: () => performStatusChange(accountId, isActivating),
            })
        }
    }

    const renderPaginationButtons = () => {
        const buttons = []
        const maxVisible = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        const endPage = Math.min(totalPages, startPage + maxVisible - 1)

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        // Previous button
        buttons.push(
            <Button
                key="prev"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>,
        )

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i)}>
                    {i}
                </Button>,
            )
        }

        // Next button
        buttons.push(
            <Button
                key="next"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>,
        )

        return buttons
    }

    // Helper functions
    const getRoleName = (roleId: number) => {
        const roles = { 1: "Admin", 2: "Customer", 3: "Car Owner", 4: "Operator" }
        return roles[roleId as keyof typeof roles] || "Unknown"
    }

    const getStatusBadgeProps = (isActive: boolean, isEmailVerified: boolean) => {
        if (isActive && isEmailVerified) {
            return {
                variant: "default" as const,
                className: "bg-green-100 text-green-800",
                text: "Active",
                icon: CheckCircle,
            }
        } else if (isActive && !isEmailVerified) {
            return {
                variant: "secondary" as const,
                className: "bg-yellow-100 text-yellow-800",
                text: "Unverified",
                icon: Mail,
            }
        } else {
            return { variant: "destructive" as const, className: "bg-red-100 text-red-800", text: "Inactive", icon: Ban }
        }
    }

    const getRoleBadgeProps = (roleName: string) => {
        const colors = {
            Admin: "bg-purple-100 text-purple-800",
            Customer: "bg-blue-100 text-blue-800",
            "Car Owner": "bg-green-100 text-green-800",
            Operator: "bg-orange-100 text-orange-800",
        }
        return {
            variant: "outline" as const,
            className: colors[roleName as keyof typeof colors] || "bg-gray-100 text-gray-800",
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 animate-in slide-in-from-top duration-500">
                        <div>
                            <h1 className="text-3xl font-bold transition-all duration-300">Account Management</h1>
                            <p className="text-gray-600 mt-1">
                                Manage Account accounts and monitor user activity
                                {pagination?.totalRecords ? ` (${pagination?.totalRecords} total)` : ""}
                            </p>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-wrap gap-4 mb-6 animate-in fade-in duration-500">
                        <div className="relative flex-1 min-w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
                            />
                        </div>
                        <Select defaultValue="createdAt-desc" onValueChange={handleSortChange}>
                            <SelectTrigger className="w-48 transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                <SelectItem value="email-asc">Email A-Z</SelectItem>
                                <SelectItem value="email-desc">Email Z-A</SelectItem>
                                <SelectItem value="roleId-asc">Role: Low to High</SelectItem>
                                <SelectItem value="roleId-desc">Role: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all" onValueChange={(value) => handleFilterChange("status", value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all" onValueChange={(value) => handleFilterChange("emailVerified", value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all" onValueChange={(value) => handleFilterChange("role", value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="1">Admin (1)</SelectItem>
                                <SelectItem value="2">Customer (2)</SelectItem>
                                <SelectItem value="3">Car Owner (3)</SelectItem>
                                <SelectItem value="4">Operator (4)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <div className="text-red-600 text-center py-12 animate-in fade-in duration-500">
                            <NoResult />
                        </div>
                    )}

                    {/* Account Cards */}
                    <div className={`space-y-4 transition-all duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
                        {accounts?.data.data.length === 0 ? (
                            <div className="text-center py-12 animate-in fade-in duration-500">
                                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">No Accounts found</p>
                            </div>
                        ) : (
                            accounts?.data.data.map((Account, index) => {
                                const statusBadge = getStatusBadgeProps(Account.isActive, Account.isEmailVerified)
                                const roleBadge = getRoleBadgeProps(getRoleName(Account.roleId))
                                const StatusIcon = statusBadge.icon
                                return (
                                    <Card
                                        key={Account.id}
                                        className="bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                                    >
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                                {/* Avatar */}
                                                <div className="relative flex-shrink-0 self-center md:self-start">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden group">
                                                        <User className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1">
                                                        <StatusIcon className="h-5 w-5 text-white bg-current rounded-full p-1" />
                                                    </div>
                                                </div>

                                                {/* Account Details */}
                                                <div className="flex-1 space-y-3 md:space-y-4">
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                        <div className="text-center md:text-left">
                                                            <h3 className="text-lg md:text-xl font-semibold transition-colors duration-200 hover:text-blue-600">
                                                                {Account.email.split("@")[0]}
                                                            </h3>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
                                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                                    <span className="text-gray-600 text-sm md:text-base">{Account.email}</span>
                                                                    {Account.isEmailVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs md:text-sm text-gray-500 mt-1">ID: {Account.id}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center md:justify-end gap-2">
                                                            <Badge {...statusBadge}>{statusBadge.text}</Badge>
                                                            <Badge {...roleBadge}>{getRoleName(Account.roleId)}</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-2 border-t gap-2">
                                                        <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                                                            <span>Created: {formatDate(Account.createdAt)}</span>
                                                            {Account.updatedAt && (
                                                                <span className="block md:inline md:ml-4">
                                  Updated: {formatDate(Account.updatedAt)}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-row md:flex-col gap-2 justify-center md:justify-start">
                                                    <Button
                                                        onClick={() => handleAccountAction("view", Account.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 md:flex-none text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        <span className="hidden sm:inline">View Details</span>
                                                        <span className="sm:hidden">View</span>
                                                    </Button>
                                                    {Account.roleId === 3 ? (
                                                        <Link href={`/admin/cars?accountId=${Account.id}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 md:flex-none text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-200 hover:shadow-md hover:scale-105 bg-transparent"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                <span className="hidden sm:inline">View Cars List</span>
                                                                <span className="sm:hidden">View Cars List</span>
                                                            </Button>
                                                        </Link>
                                                    ) : null}
                                                    {Account.isActive ? (
                                                        <Button
                                                            onClick={() => handleAccountAction("changeUserStatus", Account.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 md:flex-none text-red-600 border-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                            disabled={isUpdating === Account.id || Account.roleId === 1}
                                                        >
                                                            <UserX className="h-4 w-4 mr-1 text-red-500" />
                                                            <span className="hidden sm:inline">
                                {isUpdating === Account.id ? "Deactivating..." : "Deactivate"}
                              </span>
                                                            <span className="sm:hidden">{isUpdating === Account.id ? "..." : "Deactivate"}</span>
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => handleAccountAction("changeUserStatus", Account.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 md:flex-none text-green-600 border-green-600 hover:bg-green-50 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                            disabled={isUpdating === Account.id || Account.roleId === 1}
                                                        >
                                                            <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                                                            <span className="hidden sm:inline">
                                {isUpdating === Account.id ? "Activating..." : "Activate"}
                              </span>
                                                            <span className="sm:hidden">{isUpdating === Account.id ? "..." : "Activate"}</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination?.totalPages && pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-8 animate-in fade-in slide-in-from-bottom duration-500">
                            <div className="flex items-center gap-2">{renderPaginationButtons()}</div>
                            <div className="flex items-center gap-2">
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="w-20 transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="animate-in fade-in slide-in-from-top-2 duration-200">
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-sm text-gray-600">per page</span>
                            </div>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {accounts?.data && (
                        <div className="text-center mt-4 text-sm text-gray-600 animate-in fade-in duration-500">
                            Showing {pagination?.pageNumber ? (pagination.pageNumber - 1) * pagination.pageSize + 1 : 0} to{" "}
                            {pagination?.pageNumber
                                ? Math.min((pagination.pageNumber ?? 0) * (pagination.pageSize ?? 0), pagination.totalRecords ?? 0)
                                : 0}{" "}
                            of {pagination?.totalRecords ?? 0} accounts
                        </div>
                    )}
                </div>

                {/* Customer Details Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Details
                            </DialogTitle>
                            <DialogDescription>View detailed information about this customer account</DialogDescription>
                        </DialogHeader>
                        {selectedCustomer && (
                            <div className="space-y-6">
                                {/* Customer Header with Avatar */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                            <User className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1">
                                            {selectedCustomer.isActive ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                                            ) : (
                                                <Ban className="h-5 w-5 text-red-500 bg-white rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">{selectedCustomer.email.split("@")[0]}</h3>
                                        <p className="text-gray-600">{selectedCustomer.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge
                                                variant={selectedCustomer.isActive ? "default" : "destructive"}
                                                className={
                                                    selectedCustomer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {selectedCustomer.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <Badge variant="outline">{getRoleName(selectedCustomer.roleId)}</Badge>
                                            {selectedCustomer.isEmailVerified && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                    Email Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <Card>
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Account Information
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Account ID</label>
                                                    <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{selectedCustomer.id}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                                                    <p className="text-sm mt-1">{selectedCustomer.email}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Role ID</label>
                                                    <p className="text-sm mt-1">
                                                        {selectedCustomer.roleId} ({getRoleName(selectedCustomer.roleId)})
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Status Information */}
                                    <Card>
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                Status Information
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                                                    <div className="mt-1">
                                                        <Badge
                                                            variant={selectedCustomer.isActive ? "default" : "destructive"}
                                                            className={
                                                                selectedCustomer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            }
                                                        >
                                                            {selectedCustomer.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Email Verification</label>
                                                    <div className="mt-1">
                                                        <Badge
                                                            variant={selectedCustomer.isEmailVerified ? "default" : "secondary"}
                                                            className={
                                                                selectedCustomer.isEmailVerified
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }
                                                        >
                                                            {selectedCustomer.isEmailVerified ? "Verified" : "Unverified"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Role</label>
                                                    <div className="mt-1">
                                                        <Badge variant="outline">{getRoleName(selectedCustomer.roleId)}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Timestamps */}
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Timeline
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Created At</label>
                                                <p className="text-sm mt-1">{formatDate(selectedCustomer.createdAt)}</p>
                                                <p className="text-xs text-gray-400">{new Date(selectedCustomer.createdAt).toLocaleString()}</p>
                                            </div>
                                            {selectedCustomer.updatedAt && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                                    <p className="text-sm mt-1">{formatDate(selectedCustomer.updatedAt)}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(selectedCustomer.updatedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                                    <div className="flex gap-2">
                                        {selectedCustomer.isActive ? (
                                            <Button
                                                onClick={() => handleAccountAction("changeUserStatus", selectedCustomer.id)}
                                                variant="destructive"
                                                size="sm"
                                                disabled={isUpdating === selectedCustomer.id || selectedCustomer.roleId === 1}
                                            >
                                                <UserX className="h-4 w-4 mr-1" />
                                                {isUpdating === selectedCustomer.id ? "Deactivating..." : "Deactivate Account"}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleAccountAction("changeUserStatus", selectedCustomer.id)}
                                                variant="default"
                                                size="sm"
                                                disabled={isUpdating === selectedCustomer.id || selectedCustomer.roleId === 1}
                                            >
                                                <UserCheck className="h-4 w-4 mr-1" />
                                                {isUpdating === selectedCustomer.id ? "Activating..." : "Activate Account"}
                                            </Button>
                                        )}
                                    </div>
                                    <Button onClick={() => setIsViewDialogOpen(false)} variant="outline" size="sm">
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {confirmDialog && (
                    <Dialog open={confirmDialog.isOpen} onOpenChange={() => setConfirmDialog(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{confirmDialog.title}</DialogTitle>
                                <DialogDescription>{confirmDialog.description}</DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setConfirmDialog(null)}>
                                    Cancel
                                </Button>
                                <Button variant={confirmDialog.variant} onClick={confirmDialog.action} disabled={isUpdating !== null}>
                                    {confirmDialog.actionLabel}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    )
}