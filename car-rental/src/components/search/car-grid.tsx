"use client"

import { Filter } from "lucide-react"
import CarRentalListCard from "./list-view-card"
import CarRentalGridCard from "./grid-view-card"

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

interface CarGridProps {
  filteredCars: CarData[]
  viewMode: "list" | "grid"
  clearAllFilters: () => void
}

export default function CarGrid({ filteredCars, viewMode, clearAllFilters }: CarGridProps) {
  if (filteredCars.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Filter size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  return viewMode === "list" ? (
    <div className="space-y-4">
      {filteredCars.map((car, index) => (
        <div
          key={car.id}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CarRentalListCard car={car} />
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {filteredCars.map((car, index) => (
        <div
          key={car.id}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CarRentalGridCard car={car} />
        </div>
      ))}
    </div>
  )
}

export type { CarData }
