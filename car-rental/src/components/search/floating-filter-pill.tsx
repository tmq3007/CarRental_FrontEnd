
"use client"

import { useState, useEffect } from "react"
import MultiDirectionalFilterPill from "./multi-directional-filter-pill"
import FilterPanel from "./filter-panel"
import { FilterCriteria } from "@/lib/services/car-api"

interface FilterComponentProps {
  onFilterChange: (filters: FilterCriteria) => void
  rentalDays: number
  initialSortBy?: string
  initialOrder?: "asc" | "desc"
}

export default function FilterPillComponent({
  onFilterChange,
  rentalDays = 7,
  initialSortBy = "newest",
  initialOrder = "asc",
}: FilterComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullView, setIsFullView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("location-time")

  // Location state
  const [location, setLocation] = useState<{
    province: string
    district: string
    ward: string
  }>({
    province: "",
    district: "",
    ward: "",
  })

  // Date time state
  const [pickupTime, setPickupTime] = useState<Date | undefined>(undefined)
  const [dropoffTime, setDropoffTime] = useState<Date | undefined>(undefined)

  // Immediate filter state, including sorting
  const [immediateFilters, setImmediateFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    dailyPriceMax: 200,
    carTypes: [] as string[],
    fuelTypes: [] as string[],
    transmissionTypes: [] as string[],
    brands: [] as string[],
    seats: [] as string[],
    sortBy: initialSortBy,
    order: initialOrder,
  })

  // Sync sortBy and order with props
  useEffect(() => {
    setImmediateFilters((prev) => ({
      ...prev,
      sortBy: initialSortBy,
      order: initialOrder,
    }))
  }, [initialSortBy, initialOrder])

  const getFilterTags = () => {
    const tags: Array<{ id: string; label: string; type: string; value: any }> = []

    // Search query tag
    if (searchQuery.trim()) {
      tags.push({
        id: "search",
        label: `"${searchQuery}"`,
        type: "search",
        value: searchQuery,
      })
    }

    // Location tag
    if (location.province) {
      const locationLabel = `${location.province}${location.district ? `, ${location.district}` : ""}${
        location.ward ? `, ${location.ward}` : ""
      }`
      tags.push({
        id: "location",
        label: locationLabel,
        type: "location",
        value: location,
      })
    }

    // Pickup time tag
    if (pickupTime) {
      tags.push({
        id: "pickupTime",
        label: `Pickup: ${pickupTime.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}`,
        type: "pickupTime",
        value: pickupTime,
      })
    }

    // Dropoff time tag
    if (dropoffTime) {
      tags.push({
        id: "dropoffTime",
        label: `Dropoff: ${dropoffTime.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}`,
        type: "dropoffTime",
        value: dropoffTime,
      })
    }

    // Immediate filter tags
    immediateFilters.carTypes.forEach((type) => {
      tags.push({
        id: `car-type-${type}`,
        label: type,
        type: "carTypes",
        value: type,
      })
    })
    if (immediateFilters.priceRange[0] > 0 || immediateFilters.priceRange[1] < 1000) {
      tags.push({
        id: "price-range",
        label: `$${immediateFilters.priceRange[0]} - $${immediateFilters.priceRange[1]}`,
        type: "priceRange",
        value: immediateFilters.priceRange,
      })
    }
    if (immediateFilters.dailyPriceMax < 200) {
      tags.push({
        id: "daily-price",
        label: `Daily: $${immediateFilters.dailyPriceMax}`,
        type: "dailyPriceMax",
        value: immediateFilters.dailyPriceMax,
      })
    }
    immediateFilters.fuelTypes.forEach((fuel) => {
      tags.push({
        id: `fuel-${fuel}`,
        label: fuel.charAt(0) + fuel.slice(1).toLowerCase(),
        type: "fuelTypes",
        value: fuel,
      })
    })
    immediateFilters.transmissionTypes.forEach((trans) => {
      tags.push({
        id: `trans-${trans}`,
        label: trans.charAt(0) + trans.slice(1).toLowerCase(),
        type: "transmissionTypes",
        value: trans,
      })
    })
    immediateFilters.brands.forEach((brand) => {
      tags.push({
        id: `brand-${brand}`,
        label: brand,
        type: "brands",
        value: brand,
      })
    })
    immediateFilters.seats.forEach((seat) => {
      tags.push({
        id: `seat-${seat}`,
        label: `${seat} Seats`,
        type: "seats",
        value: seat,
      })
    })

    // Sort tag
    if (immediateFilters.sortBy !== "newest" || immediateFilters.order !== "asc") {
      tags.push({
        id: "sort",
        label: `Sort: ${immediateFilters.sortBy.charAt(0).toUpperCase() + immediateFilters.sortBy.slice(1)} (${
          immediateFilters.order === "asc" ? "Ascending" : "Descending"
        })`,
        type: "sort",
        value: { sortBy: immediateFilters.sortBy, order: immediateFilters.order },
      })
    }

    return tags
  }

  const removeFilterTag = (tagType: string, tagValue: any) => {
    switch (tagType) {
      case "search":
        setSearchQuery("")
        break
      case "location":
        setLocation({ province: "", district: "", ward: "" })
        break
      case "pickupTime":
        setPickupTime(undefined)
        break
      case "dropoffTime":
        setDropoffTime(undefined)
        break
      case "carTypes":
        setImmediateFilters((prev) => ({
          ...prev,
          carTypes: prev.carTypes.filter((c) => c !== tagValue),
        }))
        break
      case "fuelTypes":
        setImmediateFilters((prev) => ({
          ...prev,
          fuelTypes: prev.fuelTypes.filter((f) => f !== tagValue),
        }))
        break
      case "transmissionTypes":
        setImmediateFilters((prev) => ({
          ...prev,
          transmissionTypes: prev.transmissionTypes.filter((t) => t !== tagValue),
        }))
        break
      case "brands":
        setImmediateFilters((prev) => ({
          ...prev,
          brands: prev.brands.filter((b) => b !== tagValue),
        }))
        break
      case "seats":
        setImmediateFilters((prev) => ({
          ...prev,
          seats: prev.seats.filter((s) => s !== tagValue),
        }))
        break
      case "priceRange":
        setImmediateFilters((prev) => ({
          ...prev,
          priceRange: [0, 1000],
        }))
        break
      case "dailyPriceMax":
        setImmediateFilters((prev) => ({
          ...prev,
          dailyPriceMax: 200,
        }))
        break
      case "sort":
        setImmediateFilters((prev) => ({
          ...prev,
          sortBy: "newest",
          order: "asc",
        }))
        break
    }
  }

  const handleFilterChange = (filterType: string, value: any) => {
    setImmediateFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const toggleArrayFilter = (filterType: string, value: string) => {
    setImmediateFilters((prev) => {
      const current = prev[filterType as keyof typeof immediateFilters]
      if (Array.isArray(current)) {
        const arr = current as string[]
        return {
          ...prev,
          [filterType]: arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value],
        }
      }
      return prev
    })
  }

  const handleLocationChange = (field: string, value: string) => {
    setLocation((prev) => {
      if (field === "province" && value !== prev.province) {
        return { province: value, district: "", ward: "" }
      }
      if (field === "district" && value !== prev.district) {
        return { ...prev, district: value, ward: "" }
      }
      return { ...prev, [field]: value }
    })
  }

  const clearAllFilters = () => {
    setImmediateFilters({
      priceRange: [0, 1000],
      dailyPriceMax: 200,
      carTypes: [],
      fuelTypes: [],
      transmissionTypes: [],
      brands: [],
      seats: [],
      sortBy: initialSortBy,
      order: initialOrder,
    })
    setSearchQuery("")
    setPickupTime(undefined)
    setDropoffTime(undefined)
    // Location is not reset
  }

  // Calculate active filters count excluding location
  const activeFiltersCount =
    getFilterTags().filter((tag) => tag.type !== "location").length +
    (pickupTime ? 1 : 0) +
    (dropoffTime ? 1 : 0)

  // Apply filters when button is clicked
  const applyFilters = () => {
    const updatedFilters: FilterCriteria = {
      ...immediateFilters,
      searchQuery,
      location: location.province ? location : undefined,
      pickupTime,
      dropoffTime,
    }
    onFilterChange(updatedFilters)
    setIsExpanded(false) // Close the panel after applying
  }

  return (
    <>
      <MultiDirectionalFilterPill
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded(!isExpanded)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterTags={getFilterTags()}
        onRemoveTag={removeFilterTag}
        onClearAll={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        location={location}
        pickupTime={pickupTime}
        dropoffTime={dropoffTime}
      />

      <FilterPanel
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filters={immediateFilters}
        handleFilterChange={handleFilterChange}
        toggleArrayFilter={toggleArrayFilter}
        onClearAll={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        rentalDays={rentalDays}
        isFullView={isFullView}
        onToggleFullView={() => setIsFullView(!isFullView)}
        location={location}
        onLocationChange={handleLocationChange}
        pickupTime={pickupTime}
        dropoffTime={dropoffTime}
        onPickupTimeChange={setPickupTime}
        onDropoffTimeChange={setDropoffTime}
        onApplyFilters={applyFilters}
      />
    </>
  )
}