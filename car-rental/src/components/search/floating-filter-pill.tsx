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
  initialFilters: FilterCriteria
}

export default function FilterPillComponent({
  onFilterChange,
  rentalDays = 7,
  initialSortBy = "newest",
  initialOrder = "asc",
  initialFilters,
}: FilterComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullView, setIsFullView] = useState(false)
  const [activeTab, setActiveTab] = useState("location-time")

  // State initialized from initialFilters
  const [immediateFilters, setImmediateFilters] = useState(initialFilters)
  const [location, setLocation] = useState(initialFilters.location || { province: "", district: "", ward: "" })
  const [pickupTime, setPickupTime] = useState(initialFilters.pickupTime)
  const [dropoffTime, setDropoffTime] = useState(initialFilters.dropoffTime)
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || "")
  console.log(initialFilters)
  // Sync state with initialFilters when prop changes
  useEffect(() => {
    setImmediateFilters(initialFilters)
    setLocation(initialFilters.location || { province: "", district: "", ward: "" })
    setPickupTime(initialFilters.pickupTime)
    setDropoffTime(initialFilters.dropoffTime)
    setSearchQuery(initialFilters.searchQuery || "")
  }, [initialFilters])

  const getFilterTags = () => {
    const tags: Array<{ id: string; label: string; type: string; value: any }> = []

    if (searchQuery.trim()) {
      tags.push({ id: "search", label: `"${searchQuery}"`, type: "search", value: searchQuery })
    }

    if (location.province) {
      const locationLabel = `${location.province}${location.district ? `, ${location.district}` : ""}${location.ward ? `, ${location.ward}` : ""}`
      tags.push({ id: "location", label: locationLabel, type: "location", value: location })
    }

    if (pickupTime) {
      tags.push({
        id: "pickupTime",
        label: `Pickup: ${pickupTime.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`,
        type: "pickupTime",
        value: pickupTime,
      })
    }

    if (dropoffTime) {
      tags.push({
        id: "dropoffTime",
        label: `Dropoff: ${dropoffTime.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`,
        type: "dropoffTime",
        value: dropoffTime,
      })
    }

    immediateFilters.carTypes.forEach((type) => tags.push({ id: `car-type-${type}`, label: type, type: "carTypes", value: type }))
    immediateFilters.fuelTypes.forEach((fuel) => tags.push({ id: `fuel-${fuel}`, label: fuel, type: "fuelTypes", value: fuel }))
    immediateFilters.transmissionTypes.forEach((trans) => tags.push({ id: `trans-${trans}`, label: trans, type: "transmissionTypes", value: trans }))
    immediateFilters.brands.forEach((brand) => tags.push({ id: `brand-${brand}`, label: brand, type: "brands", value: brand }))
    immediateFilters.seats.forEach((seat) => tags.push({ id: `seat-${seat}`, label: `${seat} Seats`, type: "seats", value: seat }))

    if (immediateFilters.priceRange[0] > 0 || immediateFilters.priceRange[1] < 10000000) {
      tags.push({ id: "price-range", label: `$${immediateFilters.priceRange[0]} - $${immediateFilters.priceRange[1]}`, type: "priceRange", value: immediateFilters.priceRange })
    }

    return tags
  }

  const removeFilterTag = (tagType: string, tagValue: any) => {
    switch (tagType) {
      case "search": setSearchQuery(""); break
      case "location": setLocation({ province: "", district: "", ward: "" }); break
      case "pickupTime": setPickupTime(undefined); break
      case "dropoffTime": setDropoffTime(undefined); break
      case "carTypes":
      case "fuelTypes":
      case "transmissionTypes":
      case "brands":
      case "seats":
        setImmediateFilters((prev) => ({
          ...prev,
          [tagType]: (prev as any)[tagType].filter((v: string) => v !== tagValue)
        }))
        break
      case "priceRange":
        setImmediateFilters((prev) => ({ ...prev, priceRange: [0, 10000000] }))
        break
      case "sort":
        setImmediateFilters((prev) => ({ ...prev, sortBy: "newest", order: "asc" }))
        break
    }
  }

  const handleFilterChange = (filterType: string, value: any) => {
    setImmediateFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const toggleArrayFilter = (filterType: string, value: string) => {
    setImmediateFilters((prev) => {
      const current = (prev as any)[filterType]
      if (Array.isArray(current)) {
        return {
          ...prev,
          [filterType]: current.includes(value) ? current.filter((item: string) => item !== value) : [...current, value],
        }
      }
      return prev
    })
  }

  const handleLocationChange = (field: string, value: string) => {
    setLocation((prev) => {
      if (field === "province" && value !== prev.province) return { province: value, district: "", ward: "" }
      if (field === "district" && value !== prev.district) return { ...prev, district: value, ward: "" }
      return { ...prev, [field]: value }
    })
  }

  const clearAllFilters = () => {
    setImmediateFilters({
      priceRange: [0, 10000000],
      carTypes: [],
      fuelTypes: [],
      transmissionTypes: [],
      brands: [],
      seats: [],
      sortBy: initialSortBy,
      order: initialOrder,
      searchQuery: "",
    })
    setSearchQuery("")
  }

  const activeFiltersCount = getFilterTags().filter((tag) => tag.type !== "location").length

  const applyFilters = () => {
    const updatedFilters: FilterCriteria = {
      ...immediateFilters,
      searchQuery,
      location: location.province ? location : undefined,
      pickupTime,
      dropoffTime,
    }
    onFilterChange(updatedFilters)
    setIsExpanded(false)
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
        pickupTime={pickupTime ?? undefined}
        dropoffTime={dropoffTime ?? undefined}
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
        pickupTime={pickupTime ?? undefined}
        dropoffTime={dropoffTime ?? undefined}
        onPickupTimeChange={setPickupTime}
        onDropoffTimeChange={setDropoffTime}
        onApplyFilters={applyFilters}
      />
    </>
  )
}
