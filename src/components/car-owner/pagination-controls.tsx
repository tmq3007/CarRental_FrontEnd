"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationControlsProps {
    currentPage: number
    pageSize: number
    totalPages: number
    totalRecords: number
    isLoading?: boolean
    isFetching?: boolean
    goToPageInput: string
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    onGoToPageInputChange: (value: string) => void
    onGoToPageSubmit: () => void
    maxVisiblePages?: number
}

export default function PaginationControls({
                                               currentPage,
                                               pageSize,
                                               totalPages,
                                               totalRecords,
                                               isLoading = false,
                                               isFetching = false,
                                               goToPageInput,
                                               onPageChange,
                                               onPageSizeChange,
                                               onGoToPageInputChange,
                                               onGoToPageSubmit,
                                               maxVisiblePages = 5,
                                           }: PaginationControlsProps) {
    const isDisabled = isLoading || isFetching

    // Calculate visible page range
    const pageRange = useMemo(() => {
        if (totalPages <= maxVisiblePages) {
            return { start: 1, end: totalPages }
        }

        const halfVisible = Math.floor(maxVisiblePages / 2)

        if (currentPage <= halfVisible) {
            return { start: 1, end: maxVisiblePages }
        }

        if (currentPage + halfVisible >= totalPages) {
            return {
                start: totalPages - maxVisiblePages + 1,
                end: totalPages,
            }
        }

        return {
            start: currentPage - halfVisible,
            end: currentPage + halfVisible,
        }
    }, [currentPage, totalPages, maxVisiblePages])

    // Render pagination button numbers with ellipsis
    const renderPageButtons = () => {
        const buttons = []

        // First page button
        buttons.push(
            <Button
                key="first"
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1 || isDisabled}
                className="h-10 px-3 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all duration-200"
                aria-label="First page"
            >
                <span className="text-xs font-medium">First</span>
            </Button>,
        )

        // Previous button
        buttons.push(
            <Button
                key="prev"
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isDisabled}
                className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all duration-200"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>,
        )

        // First ellipsis and page 1 (if needed)
        if (pageRange.start > 1) {
            buttons.push(
                <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                    1
                </Button>,
            )

            if (pageRange.start > 2) {
                buttons.push(
                    <div key="ellipsis-start" className="flex items-center justify-center h-10 w-10" aria-hidden="true">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>,
                )
            }
        }

        // Page numbers
        for (let i = pageRange.start; i <= pageRange.end; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(i)}
                    disabled={isDisabled}
                    className={`h-10 w-10 p-0 transition-all duration-200 ${
                        i === currentPage
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                            : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    aria-current={i === currentPage ? "page" : undefined}
                >
                    {i}
                </Button>,
            )
        }

        // Last ellipsis and last page (if needed)
        if (pageRange.end < totalPages) {
            if (pageRange.end < totalPages - 1) {
                buttons.push(
                    <div key="ellipsis-end" className="flex items-center justify-center h-10 w-10" aria-hidden="true">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>,
                )
            }

            buttons.push(
                <Button
                    key={totalPages}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                    {totalPages}
                </Button>,
            )
        }

        // Next button
        buttons.push(
            <Button
                key="next"
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isDisabled}
                className="h-10 w-10 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all duration-200"
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>,
        )

        // Last page button
        buttons.push(
            <Button
                key="last"
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages || isDisabled}
                className="h-10 px-3 border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all duration-200"
                aria-label="Last page"
            >
                <span className="text-xs font-medium">Last</span>
            </Button>,
        )

        return buttons
    }

    if (totalPages <= 1) return null

    return (
        <div className="space-y-4 mt-8 animate-in fade-in slide-in-from-bottom duration-500">
            {/* Pagination Button Bar */}
            <div className="flex justify-center">
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1 shadow-sm flex-wrap">
                    {renderPageButtons()}
                </div>
            </div>

            {/* Page Size and Info */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(val) => onPageSizeChange(Number.parseInt(val))}
                        disabled={isDisabled}
                    >
                        <SelectTrigger className="w-20 h-8 text-sm border-gray-300 hover:border-blue-300 focus:border-blue-500 transition-all duration-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">items per page</span>
                </div>

                {/* Pagination Info and Go to Page */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                    <div className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-medium text-gray-900">
              {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
                        to <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, totalRecords)}</span> of{" "}
                        <span className="font-medium text-gray-900">{totalRecords}</span> items
                    </div>

                    {/* Go to Page Input */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="go-to-page" className="text-sm text-gray-600">
                            Go to:
                        </label>
                        <input
                            id="go-to-page"
                            type="number"
                            min="1"
                            max={totalPages}
                            value={goToPageInput}
                            onChange={(e) => onGoToPageInputChange(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    onGoToPageSubmit()
                                }
                            }}
                            placeholder={currentPage.toString()}
                            disabled={isDisabled}
                            className="w-16 h-8 px-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all duration-200"
                            aria-label="Go to page number"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
