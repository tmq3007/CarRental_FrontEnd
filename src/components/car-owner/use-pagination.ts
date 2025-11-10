"use client"

import { useState, useCallback } from "react"

export interface PaginationState {
    pageNumber: number
    pageSize: number
    totalRecords: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

interface UsePaginationOptions {
    initialPageSize?: number
    maxVisiblePages?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
    const { initialPageSize = 10, maxVisiblePages = 5 } = options

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(initialPageSize)
    const [goToPageInput, setGoToPageInput] = useState("")

    const calculatePaginationState = useCallback(
        (rawPagination: any): PaginationState => {
            if (!rawPagination) {
                return {
                    pageNumber: 1,
                    pageSize: initialPageSize,
                    totalRecords: 0,
                    totalPages: 1,
                    hasPreviousPage: false,
                    hasNextPage: false,
                }
            }

            // Validate and sanitize pagination data
            const totalPages = Math.max(1, rawPagination.totalPages || 1)
            const validPageNumber = Math.min(Math.max(1, rawPagination.pageNumber || 1), totalPages)

            return {
                pageNumber: validPageNumber,
                pageSize: rawPagination.pageSize || initialPageSize,
                totalRecords: rawPagination.totalRecords || 0,
                totalPages,
                hasPreviousPage: validPageNumber > 1,
                hasNextPage: validPageNumber < totalPages,
            }
        },
        [initialPageSize],
    )

    const getPageRange = useCallback(
        (totalPages: number, currentPage: number) => {
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
        },
        [maxVisiblePages],
    )

    const handlePageChange = useCallback((page: number, totalPages: number) => {
        if (page < 1 || page > totalPages) {
            return false
        }
        setCurrentPage(page)
        setGoToPageInput("")
        return true
    }, [])

    const handlePageSizeChange = useCallback((newSize: number) => {
        if (newSize < 1) return false
        setPageSize(newSize)
        setCurrentPage(1)
        setGoToPageInput("")
        return true
    }, [])

    const handleGoToPageSubmit = useCallback(
        (totalPages: number) => {
            const page = Number.parseInt(goToPageInput, 10)
            if (isNaN(page) || page < 1 || page > totalPages) {
                setGoToPageInput("")
                return false
            }
            setCurrentPage(page)
            setGoToPageInput("")
            return true
        },
        [goToPageInput],
    )

    return {
        // State
        currentPage,
        pageSize,
        goToPageInput,
        setGoToPageInput,

        // Methods
        calculatePaginationState,
        getPageRange,
        handlePageChange,
        handlePageSizeChange,
        handleGoToPageSubmit,
    }
}
