"use client"

import { LayoutGrid, List } from "lucide-react"

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
    <div className="flex flex-col gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{filteredCarsCount} CARS AVAILABLE</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          These cars can be picked up in {location.split(",")[0]}
        </p>
      </div>

      {/* Sort and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-gray-600 whitespace-nowrap">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors flex-1 sm:flex-none min-w-[140px]"
          >
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Highest Rated</option>
          </select>
          <select
            value={order}
            onChange={(e) => handleOrderChange(e.target.value as "asc" | "desc")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors flex-1 sm:flex-none min-w-[100px]"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all duration-200 flex-1 sm:flex-none flex items-center justify-center ${
              viewMode === "grid" ? "bg-green-600 text-white scale-105" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LayoutGrid size={18} />
            <span className="ml-2 sm:hidden">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-200 flex-1 sm:flex-none flex items-center justify-center ${
              viewMode === "list" ? "bg-green-600 text-white scale-105" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List size={18} />
            <span className="ml-2 sm:hidden">List</span>
          </button>
        </div>
      </div>
    </div>
  )
}