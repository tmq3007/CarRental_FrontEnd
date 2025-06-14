"use client"

import { useState, useCallback } from "react"
import SearchResultComponent from "@/components/search/search-result-component"
import FilterPillComponent from "@/components/search/floating-filter-pill"
import { FilterCriteria, useSearchCarsQuery } from "@/lib/services/car-api"

export default function SearchPage() {
  // State for current filters
  const [currentFilters, setCurrentFilters] = useState<FilterCriteria>({
    priceRange: [0, 1000],
    dailyPriceMax: 200,
    carTypes: [],
    fuelTypes: [],
    transmissionTypes: [],
    brands: [],
    seats: [],
    searchQuery: "",
    location: undefined,
    pickupTime: null,
    dropoffTime: null,
    order: "asc",
    sortBy: "newest",
  })

  // RTK Query hook to fetch cars
  const { data, isLoading, error } = useSearchCarsQuery(currentFilters)
  const cars = data?.data.data || [];
  const pagination = data?.data.PaginationMetadata || {
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };
  // Calculate the rental duration in days
  const rentalDays =
    currentFilters.pickupTime && currentFilters.dropoffTime
      ? Math.max(
        1,
        Math.ceil(
          (currentFilters.dropoffTime.getTime() - currentFilters.pickupTime.getTime()) / (1000 * 60 * 60 * 24),
        ),
      )
      : 7 // Default to 7 days if no dates selected

  // Handle filter changes from FilterPillComponent
  const handleFilterChange = useCallback((filters: FilterCriteria) => {
    setCurrentFilters(filters)
  }, [])

  // Handle sort changes from ResultsHeader
  const handleSortChange = useCallback((sortBy: string, order: "asc" | "desc") => {
    setCurrentFilters((prev) => ({
      ...prev,
      sortBy,
      order,
    }))
  }, [])

  // Handle clearing all filters
  const handleClearFilters = useCallback(() => {
    setCurrentFilters({
      priceRange: [0, 1000],
      dailyPriceMax: 200,
      carTypes: [],
      fuelTypes: [],
      transmissionTypes: [],
      brands: [],
      seats: [],
      searchQuery: "",
      location: undefined,
      pickupTime: null,
      dropoffTime: null,
      order: "asc",
      sortBy: "newest",
    })
  }, [])

  // Get location string for display
  const getLocationString = () => {
    if (!currentFilters.location) return ""
    const { province, district, ward } = currentFilters.location
    return `${province}${district ? `, ${district}` : ""}${ward ? `, ${ward}` : ""}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-2">
        {/* Filter Pill Component */}
        <FilterPillComponent
          onFilterChange={handleFilterChange}
          rentalDays={rentalDays}
          initialSortBy={currentFilters.sortBy}
          initialOrder={currentFilters.order}
        />

        {/* Search Result Component */}
        <SearchResultComponent
          cars={cars}
          pagination={pagination}
          location={getLocationString()}
          isLoading={isLoading}
          onClearFilters={handleClearFilters}
          sortBy={currentFilters.sortBy}
          order={currentFilters.order}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  )
}