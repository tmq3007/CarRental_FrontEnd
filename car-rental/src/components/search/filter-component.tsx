"use client"

import { useState, useEffect } from "react"
import FilterBar from "./filter-bar"
import FilterPanel from "./filter-panel"

interface FilterCriteria {
  priceRange: [number, number]
  dailyPriceMax: number
  carTypes: string[]
  fuelTypes: string[]
  transmissionTypes: string[]
  brands: string[]
  seats: string[]
  year: [number, number]
  features: string[]
  instantConfirmation: boolean
  freeCancellation: boolean
  airConditioning: boolean
  unlimitedMileage: boolean
  luxuryOnly: boolean
  searchQuery: string
}

interface FilterComponentProps {
  onFilterChange: (filters: FilterCriteria) => void
  rentalDays: number
}

export default function FilterComponent({ onFilterChange, rentalDays }: FilterComponentProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const [filters, setFilters] = useState<FilterCriteria>({
    priceRange: [0, 1000],
    dailyPriceMax: 200,
    carTypes: [],
    fuelTypes: [],
    transmissionTypes: [],
    brands: [],
    seats: [],
    year: [1950, 2024],
    features: [],
    instantConfirmation: true,
    freeCancellation: true,
    airConditioning: false,
    unlimitedMileage: false,
    luxuryOnly: false,
    searchQuery: "",
  })

  // Update selected filters when filters change
  useEffect(() => {
    const selected: string[] = []

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) selected.push("Price")
    if (filters.dailyPriceMax < 200) selected.push("Daily Price")
    if (filters.carTypes.length > 0) selected.push("Vehicle Type")
    if (filters.fuelTypes.length > 0) selected.push("Fuel Type")
    if (filters.transmissionTypes.length > 0) selected.push("Transmission")
    if (filters.brands.length > 0) selected.push("Brand")
    if (filters.features.length > 0) selected.push("Features")
    if (filters.instantConfirmation) selected.push("Instant Confirmation")
    if (filters.freeCancellation) selected.push("Free Cancellation")
    if (filters.airConditioning) selected.push("A/C")
    if (filters.unlimitedMileage) selected.push("Unlimited Miles")
    if (filters.luxuryOnly) selected.push("Luxury")
    if (searchQuery.trim()) selected.push("Search")

    setSelectedFilters(selected)
  }, [filters, searchQuery])

  // Emit filter changes to parent
  useEffect(() => {
    const updatedFilters = { ...filters, searchQuery }
    onFilterChange(updatedFilters)
  }, [filters, searchQuery, onFilterChange])

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const toggleArrayFilter = (filterType: string, value: string) => {
    setFilters((prev) => {
      const current = prev[filterType as keyof typeof prev]
      if (Array.isArray(current)) {
        // Explicitly type the array as string[]
        const arr = current as string[]
        return {
          ...prev,
          [filterType]: arr.includes(value)
            ? arr.filter((item) => item !== value)
            : [...arr, value],
        }
      }
      return prev
    })
  }


  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      dailyPriceMax: 200,
      carTypes: [],
      fuelTypes: [],
      transmissionTypes: [],
      brands: [],
      seats: [],
      year: [1950, 2024],
      features: [],
      instantConfirmation: true,
      freeCancellation: true,
      airConditioning: false,
      unlimitedMileage: false,
      luxuryOnly: false,
      searchQuery: "",
    })
    setSearchQuery("")
  }

  const getActiveFilterCount = () => {
    return selectedFilters.length
  }

  const handleRemoveFilter = (filter: string) => {
    if (filter === "Instant Confirmation") handleFilterChange("instantConfirmation", false)
    else if (filter === "Free Cancellation") handleFilterChange("freeCancellation", false)
    else if (filter === "A/C") handleFilterChange("airConditioning", false)
    else if (filter === "Unlimited Miles") handleFilterChange("unlimitedMileage", false)
    else if (filter === "Luxury") handleFilterChange("luxuryOnly", false)
    else if (filter === "Price") handleFilterChange("priceRange", [0, 1000])
    else if (filter === "Daily Price") handleFilterChange("dailyPriceMax", 200)
    else if (filter === "Vehicle Type") handleFilterChange("carTypes", [])
    else if (filter === "Fuel Type") handleFilterChange("fuelTypes", [])
    else if (filter === "Transmission") handleFilterChange("transmissionTypes", [])
    else if (filter === "Brand") handleFilterChange("brands", [])
    else if (filter === "Features") handleFilterChange("features", [])
    else if (filter === "Search") setSearchQuery("")
  }

  return (
    <div>
      <FilterBar
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedFilters={selectedFilters}
        clearAllFilters={clearAllFilters}
        getActiveFilterCount={getActiveFilterCount}
        onRemoveFilter={handleRemoveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <FilterPanel
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        toggleArrayFilter={toggleArrayFilter}
        clearAllFilters={clearAllFilters}
        getActiveFilterCount={getActiveFilterCount}
        rentalDays={rentalDays}
      />
    </div>
  )
}

export type { FilterCriteria }
