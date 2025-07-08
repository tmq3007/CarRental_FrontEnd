"use client"

import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {Input} from "@/components/ui/input"
import {
    User,
    Mail,
    Shield,
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Ban,
    CheckCircle,
    XCircle,
    UserCheck,
    UserX, Calendar,
} from "lucide-react"
import {
    AccountFilters,
    AccountVO,
    useGetAccountsQuery,
    useToggleAccountStatusMutation
} from "@/lib/services/dashboard-api";
import LoadingPage from "@/components/common/loading";
import NoResult from "@/components/common/no-result";
import {toast} from "sonner";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

export default function AccountManagement() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [filters, setFilters] = useState<AccountFilters>({
        sortBy: "createdAt",
        sortDirection: "desc",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [isTransitioning, setIsTransitioning] = useState(false)

    const {
        data: accounts,
        error,
        isLoading: loading,
    } = useGetAccountsQuery({
        pageNumber: currentPage,
        pageSize,
        filters,
    })

    const pagination = accounts?.data?.pagination;
    const handleSortChange = (value: string) => {
        setIsTransitioning(true)
        const [sortBy, sortDirection] = value.split("-")
        setFilters((prev) => ({
            ...prev,
            sortBy,
            sortDirection: sortDirection as "asc" | "desc",
        }))
        setCurrentPage(1)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handleFilterChange = (key: keyof AccountFilters, value: string) => {
        setIsTransitioning(true)
        setFilters((prev) => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }))
        setCurrentPage(1)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handlePageChange = (page: number) => {
        setIsTransitioning(true)
        setCurrentPage(page)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handlePageSizeChange = (size: string) => {
        setIsTransitioning(true)
        setPageSize(Number.parseInt(size))
        setCurrentPage(1)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setFilters((prev) => ({...prev, search: value}))
        setCurrentPage(1)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getStatusBadgeProps = (isActive: boolean, isEmailVerified: boolean) => {
        if (!isActive) {
            return {
                variant: "destructive" as const,
                className: "bg-red-100 text-red-800 hover:bg-red-200",
                icon: Ban,
                text: "Inactive",
            }
        }
        if (!isEmailVerified) {
            return {
                variant: "secondary" as const,
                className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                icon: XCircle,
                text: "Unverified",
            }
        }
        return {
            variant: "default" as const,
            className: "bg-green-100 text-green-800 hover:bg-green-200",
            icon: CheckCircle,
            text: "Active",
        }
    }

    const getRoleBadgeProps = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case "admin":
                return {
                    variant: "default" as const,
                    className: "bg-purple-100 text-purple-800",
                }
            case "car owner":
                return {
                    variant: "secondary" as const,
                    className: "bg-blue-100 text-blue-800",
                }
            default:
                return {
                    variant: "outline" as const,
                    className: "bg-gray-100 text-gray-800",
                }
        }
    }

    // Update the getRoleName function
    const getRoleName = (roleId: number): string => {
        switch (roleId) {
            case 1:
                return "admin"
            case 2:
                return "customer"
            case 3:
                return "car_owner"
            case 4:
                return "operator"
            default:
                return "Unknown"
        }
    }

    const [selectedCustomer, setSelectedCustomer] = useState<AccountVO | null>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean
        title: string
        description: string
        action: () => void
        actionLabel: string
        variant: "default" | "destructive"
    } | null>(null)

    const [toggleAccountStatus, {isLoading: statusLoading}] = useToggleAccountStatusMutation();

    const handleAccountAction = async (action: string, customerId: string) => {
        const customer = accounts?.data.data.find((c) => c.id === customerId)
        if (!customer) return

        switch (action) {
            case "view":
                setSelectedCustomer(customer)
                setIsViewDialogOpen(true)
                break

            case "changeUserStatus":
                await handleChangeUserStatus(customerId, !customer.isActive)
                break

            default:
                console.log(`${action} customer:`, customerId)
        }
    }

    const handleChangeUserStatus = async (customerId: string, newStatus: boolean) => {
        const customer = accounts?.data.data.find((c) => c.id === customerId)
        if (!customer) return

        setConfirmDialog({
            isOpen: true,
            title: `${newStatus ? "Activate" : "Deactivate"} Account`,
            description: `Are you sure you want to ${newStatus ? "activate" : "deactivate"} the account for ${customer.email}? This action will ${newStatus ? "enable" : "disable"} their access to the system.`,
            action: () => performStatusChange(customerId, newStatus),
            actionLabel: newStatus ? "Activate Account" : "Deactivate Account",
            variant: newStatus ? "default" : "destructive",
        })
    }

    const performStatusChange = async (customerId: string, newStatus: boolean) => {
        setIsUpdating(customerId)
        const toastId = toast.loading(`${newStatus ? "Activating" : "Deactivating"} account...`)

        try {
            // Replace with your actual API endpoint
            const response = await toggleAccountStatus({accountId: customerId}).unwrap();

            window.location.reload();

            toast.success(`Account ${newStatus ? "activated" : "deactivated"} successfully!`, { id: toastId })
        } catch (error) {
            console.error("Error changing user status:", error)
            toast.error(`Failed to ${newStatus ? "activate" : "deactivate"} account. Please try again.`, { id: toastId })
        } finally {
            setIsUpdating(null)
        }
    }

    const renderPaginationButtons = () => {
        if (!accounts) return null
        const {pageNumber, totalPages} = {
            pageNumber: pagination?.pageNumber ?? 1,
            totalPages: pagination?.totalPages ?? 1
        }

        const buttons = []

        buttons.push(
            <Button
                key="prev"
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={!pagination?.hasPreviousPage}
                className="transition-all duration-200 hover:bg-gray-100 disabled:opacity-50"
            >
                {"<<<"}
            </Button>,
        )

        const startPage = Math.max(1, pageNumber - 2)
        const endPage = Math.min(totalPages, pageNumber + 2)

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className={`transition-all duration-200 ${
                        i === pageNumber ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "hover:bg-gray-100"
                    }`}
                >
                    {i}
                </Button>,
            )
        }

        if (endPage < totalPages) {
            buttons.push(
                <span key="ellipsis" className="mx-2 text-gray-400">
          ...
        </span>,
            )
        }

        buttons.push(
            <Button
                key="next"
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={!pagination?.hasNextPage}
                className="transition-all duration-200 hover:bg-gray-100 disabled:opacity-50"
            >
                {">>>"}
            </Button>,
        )

        return buttons
    }

    if (loading || !accounts?.data?.data) {
        return <LoadingPage/>
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
                <div className="max-w mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 animate-in slide-in-from-top duration-500">
                        <div>
                            <h1 className="text-3xl font-bold transition-all duration-300">Account Management</h1>
                            <p className="text-gray-600 mt-1">
                                Manage Account accounts and monitor user activity
                                ({pagination?.totalRecords ? `(${pagination?.totalRecords} total)` : ""})
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                                <User className="h-4 w-4 mr-2"/>
                                Add Account
                            </Button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-wrap gap-4 mb-6 animate-in fade-in duration-500">
                        <div className="relative flex-1 min-w-64">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                            <Input
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
                            />
                        </div>

                        <Select defaultValue="createdAt-desc" onValueChange={handleSortChange}>
                            <SelectTrigger
                                className="w-48 transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                                <SelectValue/>
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
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all"
                                onValueChange={(value) => handleFilterChange("emailVerified", value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Verification"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all" onValueChange={(value) => handleFilterChange("role", value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Role"/>
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
                            <NoResult/>
                        </div>
                    )}

                    {/* Account Cards */}
                    <div
                        className={`space-y-4 transition-all duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
                        {accounts?.data.data.length === 0 ? (
                            <div className="text-center py-12 animate-in fade-in duration-500">
                                <User className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                                <p className="text-gray-500 mb-4">No Accounts found</p>
                                <Button className="bg-blue-600 hover:bg-blue-700">Add First Account</Button>
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

                                                    <Button
                                                        onClick={() => handleAccountAction("changeUserStatus", Account.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 md:flex-none transition-all duration-200 hover:shadow-md hover:scale-105 bg-transparent"
                                                        disabled={isUpdating === Account.id}
                                                    >
                                                        {Account.isActive ? (
                                                            <>
                                                                <UserX className="h-4 w-4 text-red-500" />
                                                                <span className="hidden sm:inline ml-1">
                                    {isUpdating === Account.id ? "Deactivating..." : "Deactivate"}
                                  </span>
                                                                <span className="sm:hidden ml-1">
                                    {isUpdating === Account.id ? "..." : "Deactivate"}
                                  </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="h-4 w-4 text-green-500" />
                                                                <span className="hidden sm:inline ml-1">
                                    {isUpdating === Account.id ? "Activating..." : "Activate"}
                                  </span>
                                                                <span className="sm:hidden ml-1">
                                    {isUpdating === Account.id ? "..." : "Activate"}
                                  </span>
                                                            </>
                                                        )}
                                                    </Button>
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
                        <div
                            className="flex justify-between items-center mt-8 animate-in fade-in slide-in-from-bottom duration-500">
                            <div className="flex items-center gap-2">{renderPaginationButtons()}</div>

                            <div className="flex items-center gap-2">
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger
                                        className="w-20 transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                                        <SelectValue/>
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
                            Showing {(pagination?.pageNumber ? (pagination.pageNumber - 1) * pagination.pageSize + 1 : 0)} to{" "}
                            {pagination?.pageNumber ? Math.min((pagination.pageNumber ?? 0) * (pagination.pageSize ?? 0), pagination.totalRecords ?? 0) : 0} of {pagination?.totalRecords ?? 0}{" "}
                            cars
                        </div>
                    )}
                </div>
                {/* Customer Details Dialog */}

            </div>

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
                                            className={selectedCustomer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
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
                                                <p className="text-xs text-gray-400">{new Date(selectedCustomer.updatedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleAccountAction("changeUserStatus", selectedCustomer.id)}
                                        variant={selectedCustomer.isActive ? "destructive" : "default"}
                                        size="sm"
                                        disabled={isUpdating === selectedCustomer.id}
                                    >
                                        {isUpdating === selectedCustomer.id ? (
                                            "Processing..."
                                        ) : selectedCustomer.isActive ? (
                                            <>
                                                <UserX className="h-4 w-4 mr-1" />
                                                Deactivate Account
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck className="h-4 w-4 mr-1" />
                                                Activate Account
                                            </>
                                        )}
                                    </Button>
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
                </Dialog>)}
            </>
    )
}
