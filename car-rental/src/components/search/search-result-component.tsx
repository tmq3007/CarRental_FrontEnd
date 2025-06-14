"use client"

import { useState } from "react"
import ResultsHeader from "./results-header"
import CarGrid from "./car-grid"
import { CarSearchVO } from "@/lib/services/car-api"
import { PaginationMetadata } from "@/lib/store"

interface SearchResultComponentProps {
  cars: CarSearchVO[]
  pagination: PaginationMetadata
  location: string
  isLoading?: boolean
  onClearFilters?: () => void
  sortBy: string
  order: "asc" | "desc"
  onSortChange: (sortBy: string, order: "asc" | "desc") => void
}

export default function SearchResultComponent({
  cars,
  pagination,
  location,
  isLoading = false,
  onClearFilters,
  sortBy,
  order,
  onSortChange,
}: SearchResultComponentProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  if (isLoading) {
    return (
      <div className="mx-10 p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-10 p-4 md:p-6 z-0">
      <ResultsHeader
        filteredCarsCount={cars.length}
        location={location}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        order={order}
        onSortChange={onSortChange}
      />

      <CarGrid filteredCars={cars} viewMode={viewMode} clearAllFilters={onClearFilters || (() => {})} />
    </div>
  )
}