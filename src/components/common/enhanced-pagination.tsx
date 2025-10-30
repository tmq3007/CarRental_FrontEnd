"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationMetadata {
  totalRecords: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface EnhancedPaginationProps {
  pagination: PaginationMetadata
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showResultsSummary?: boolean
  showPageSizeSelector?: boolean
  className?: string
}

export default function EnhancedPagination({
  pagination,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showResultsSummary = true,
  showPageSizeSelector = true,
  className = "",
}: EnhancedPaginationProps) {
  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      onPageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = []
    const totalPagesCount = pagination.totalPages
    const current = currentPage

    // Always show first page
    if (totalPagesCount > 0) {
      pages.push(1)
    }

    // Add ellipsis if there's a gap
    if (current > 4) {
      pages.push("ellipsis-start")
    }

    // Add pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPagesCount - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Add ellipsis if there's a gap
    if (current < totalPagesCount - 3) {
      pages.push("ellipsis-end")
    }

    // Always show last page if more than 1 page
    if (totalPagesCount > 1 && !pages.includes(totalPagesCount)) {
      pages.push(totalPagesCount)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, pagination.totalRecords)

  // Don't render if there's only one page and no results summary
  if (pagination.totalPages <= 1 && !showResultsSummary) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Results Summary and Page Size Selector */}
      {(showResultsSummary || showPageSizeSelector) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
          {showResultsSummary && (
            <div>
              Showing {startIndex + 1} to {endIndex} of {pagination.totalRecords} results
            </div>
          )}

          {showPageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm">per page</span>
            </div>
          )}
        </div>
      )}

      {/* Desktop Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="hidden sm:flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePreviousPage()
                  }}
                  className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis-start" || page === "ellipsis-end" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(page as number)
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNextPage()
                  }}
                  className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Mobile Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex sm:hidden justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-sm font-medium text-gray-700">
            {currentPage} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
