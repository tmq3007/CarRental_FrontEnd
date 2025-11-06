"use client"

import { LayoutGrid, List, ChevronDown, MapPin, Car } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultsHeaderProps {
  filteredCarsCount: number
  location: string
  viewMode: "list" | "grid"
  setViewMode: (mode: "list" | "grid") => void
  sortBy: string
  order: "asc" | "desc"
  onSortChange: (sortBy: string, order: "asc" | "desc") => void
}

export default function ResultsHeader({
  filteredCarsCount,
  location,
  viewMode,
  setViewMode,
  sortBy,
  order,
  onSortChange,
}: ResultsHeaderProps) {
  const handleSortChange = (newSortBy: string) => {
    onSortChange(newSortBy, order)
  }

  const handleOrderChange = (newOrder: "asc" | "desc") => {
    onSortChange(sortBy, newOrder)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              <span className="text-blue-600">{filteredCarsCount.toLocaleString()}</span>{" "}
              <span className="text-gray-700">Cars Available</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <p className="text-gray-600 text-sm sm:text-base">
                Ready for pickup in <span className="font-semibold text-gray-800">{location.split(",")[0]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort Results:</span>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 cursor-pointer min-w-[160px] w-full sm:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="price">Price</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Order Dropdown */}
            <div className="relative">
              <select
                value={order}
                onChange={(e) => handleOrderChange(e.target.value as "asc" | "desc")}
                className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 cursor-pointer min-w-[140px] w-full sm:w-auto"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">View:</span>
          <div className="bg-gray-100 rounded-xl p-1 flex w-full sm:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm flex-1 sm:flex-none min-w-[80px]",
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm flex-1 sm:flex-none min-w-[80px]",
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All vehicles verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Instant booking available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>24/7 customer support</span>
          </div>
        </div>
      </div>
    </div>
  )
}
