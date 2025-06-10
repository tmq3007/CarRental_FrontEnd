"use client"

import { Search, SlidersHorizontal, X, RotateCw } from "lucide-react"

interface FilterBarProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  selectedFilters: string[]
  clearAllFilters: () => void
  getActiveFilterCount: () => number
  onRemoveFilter: (filter: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function FilterBar({
  showFilters,
  setShowFilters,
  selectedFilters,
  clearAllFilters,
  getActiveFilterCount,
  onRemoveFilter,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-green-600 text-white rounded-full px-4 py-2 text-sm font-medium relative hover:bg-green-700 transition-colors"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Selected Filters - Hidden on small screens, shown on medium+ */}
            <div className="hidden md:flex gap-2 overflow-x-auto flex-grow max-w-xl">
              {selectedFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs flex items-center animate-in fade-in duration-200 whitespace-nowrap"
                >
                  <span>{filter}</span>
                  <X
                    size={14}
                    className="ml-1 cursor-pointer hover:text-green-900 transition-colors"
                    onClick={() => onRemoveFilter(filter)}
                  />
                </div>
              ))}
              {selectedFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-green-600 hover:text-green-800 text-xs flex items-center underline transition-colors whitespace-nowrap"
                >
                  <RotateCw size={12} className="mr-1" />
                  Reset all
                </button>
              )}
            </div>
          </div>

          {/* Search Box - Full width on mobile, fixed width on desktop */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Mobile Selected Filters - Only shown on small screens */}
        {selectedFilters.length > 0 && (
          <div className="flex md:hidden gap-2 overflow-x-auto mt-3 pb-1">
            {selectedFilters.map((filter) => (
              <div
                key={filter}
                className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs flex items-center animate-in fade-in duration-200 whitespace-nowrap"
              >
                <span>{filter}</span>
                <X
                  size={14}
                  className="ml-1 cursor-pointer hover:text-green-900 transition-colors"
                  onClick={() => onRemoveFilter(filter)}
                />
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-green-600 hover:text-green-800 text-xs flex items-center underline transition-colors whitespace-nowrap"
            >
              <RotateCw size={12} className="mr-1" />
              Reset all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
