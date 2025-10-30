"use client"

import { LayoutGrid, List } from "lucide-react"

interface ResultsHeaderProps {
  filteredCarsCount: number
  location: string
  viewMode: "list" | "grid"
  setViewMode: (mode: "list" | "grid") => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export default function SearchResultsHeader({
  filteredCarsCount,
  location,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{filteredCarsCount} CARS AVAILABLE</h1>
        <p className="text-gray-600 mt-1">These cars can be picked up in {location.split(",")[0]}</p>
      </div>

      {/* Sort and View Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === "grid" ? "bg-green-600 text-white scale-105" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === "list" ? "bg-green-600 text-white scale-105" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
