"use client"

import { useState } from "react"
import ResultsHeader from "./results-header"
import CarGrid from "./car-grid"

interface CarData {
  id: number
  brand: string
  model: string
  type: string
  rating: number
  reviews: number
  bookedTime: string
  originalPrice: number
  discountedPrice: number
  dailyPrice: number
  images: string[]
  specs: {
    engine: string
    fuel: string
    transmission: string
    efficiency: string
    capacity: string
  }
}

interface SearchResultComponentProps {
  cars: CarData[]
  location: string
  isLoading?: boolean
  onClearFilters?: () => void
}

export default function SearchResultComponent({
  cars,
  location,
  isLoading = false,
  onClearFilters,
}: SearchResultComponentProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortBy, setSortBy] = useState("newest")

  // Sort cars based on selected option
  const sortedCars = [...cars].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.discountedPrice - b.discountedPrice
      case "price-high":
        return b.discountedPrice - a.discountedPrice
      case "rating":
        return b.rating - a.rating
      case "newest":
      default:
        return b.id - a.id
    }
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
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
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <ResultsHeader
        filteredCarsCount={cars.length}
        location={location}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <CarGrid filteredCars={sortedCars} viewMode={viewMode} clearAllFilters={onClearFilters || (() => {})} />
    </div>
  )
}

export type { CarData }
