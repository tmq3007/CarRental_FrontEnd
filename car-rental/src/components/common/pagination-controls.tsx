// components/pagination-controls.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isFetching: boolean
}

export function PaginationControls({
                                       currentPage,
                                       totalPages,
                                       onPageChange,
                                       isFetching,
                                   }: PaginationControlsProps) {
    if (totalPages <= 1) return null

    const getPageButtons = () => {
        const buttons = []
        const maxVisible = 5 // Số nút trang hiển thị tối đa
        let startPage = 1
        let endPage = totalPages

        if (totalPages > maxVisible) {
            const half = Math.floor(maxVisible / 2)
            if (currentPage <= half) {
                endPage = maxVisible
            } else if (currentPage + half >= totalPages) {
                startPage = totalPages - maxVisible + 1
            } else {
                startPage = currentPage - half
                endPage = currentPage + half
            }
        }

        // Nút First
        if (startPage > 1) {
            buttons.push(
                <Button
                    key="first"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={isFetching}
                    className="h-8 w-8 p-0"
                >
                    1
                </Button>
            )
            if (startPage > 2) {
                buttons.push(
                    <span key="start-ellipsis" className="flex items-center px-2">
            <MoreHorizontal className="h-4 w-4" />
          </span>
                )
            }
        }

        // Các nút trang
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(i)}
                    disabled={isFetching}
                    className="h-8 w-8 p-0"
                >
                    {i}
                </Button>
            )
        }

        // Nút Last
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="end-ellipsis" className="flex items-center px-2">
            <MoreHorizontal className="h-4 w-4" />
          </span>
                )
            }
            buttons.push(
                <Button
                    key="last"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={isFetching}
                    className="h-8 w-8 p-0"
                >
                    {totalPages}
                </Button>
            )
        }

        return buttons
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
                className="h-8 w-8 p-0"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageButtons()}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
                className="h-8 w-8 p-0"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}