"use client"

import { useState, useCallback } from "react"
import { addDays } from "date-fns"
import FilterComponent, { FilterCriteria } from "@/components/search/filter-component"
import Header from "@/components/search/header"
import SearchResultComponent from "@/components/search/search-result-component"

// Sample car data (in real app, this would come from backend)
const allCars = [
  {
    id: 1,
    brand: "Porsche",
    model: "Cayenne GT",
    type: "SUV",
    rating: 4.6,
    reviews: 302,
    bookedTime: "Booked till 10 PM",
    originalPrice: 532,
    discountedPrice: 352,
    dailyPrice: 67.99,
    images: [
      "/placeholder.svg?height=240&width=400&text=Cayenne+Front",
      "/placeholder.svg?height=240&width=400&text=Cayenne+Side",
      "/placeholder.svg?height=240&width=400&text=Cayenne+Interior",
      "/placeholder.svg?height=240&width=400&text=Cayenne+Back",
      "/placeholder.svg?height=240&width=400&text=Cayenne+Dashboard",
    ],
    specs: {
      engine: "Q2",
      fuel: "DIESEL",
      transmission: "AUTOMATIC",
      efficiency: "6.5 ft/100 km",
      capacity: "615 LT",
    },
  },
  {
    id: 2,
    brand: "Maserati",
    model: "GranTurismo",
    type: "Sports",
    rating: 4.8,
    reviews: 125,
    bookedTime: "Booked 10:11 PM",
    originalPrice: 649,
    discountedPrice: 459,
    dailyPrice: 149,
    images: [
      "/placeholder.svg?height=240&width=400&text=Maserati+Front",
      "/placeholder.svg?height=240&width=400&text=Maserati+Side",
      "/placeholder.svg?height=240&width=400&text=Maserati+Interior",
      "/placeholder.svg?height=240&width=400&text=Maserati+Back",
      "/placeholder.svg?height=240&width=400&text=Maserati+Dashboard",
    ],
    specs: {
      engine: "CC",
      fuel: "PETROL",
      transmission: "AUTOMATIC",
      efficiency: "4.5 ft/120 km",
      capacity: "610 LT",
    },
  },
  {
    id: 3,
    brand: "BMW",
    model: "X5 M Sport",
    type: "SUV",
    rating: 4.7,
    reviews: 189,
    bookedTime: "Booked till 9 PM",
    originalPrice: 720,
    discountedPrice: 520,
    dailyPrice: 104,
    images: [
      "/placeholder.svg?height=240&width=400&text=BMW+Front",
      "/placeholder.svg?height=240&width=400&text=BMW+Side",
      "/placeholder.svg?height=240&width=400&text=BMW+Interior",
      "/placeholder.svg?height=240&width=400&text=BMW+Back",
      "/placeholder.svg?height=240&width=400&text=BMW+Dashboard",
    ],
    specs: {
      engine: "V8",
      fuel: "PETROL",
      transmission: "AUTOMATIC",
      efficiency: "8.2 ft/100 km",
      capacity: "650 LT",
    },
  },
  {
    id: 4,
    brand: "Toyota",
    model: "Camry",
    type: "Sedan",
    rating: 4.3,
    reviews: 456,
    bookedTime: "Available",
    originalPrice: 280,
    discountedPrice: 220,
    dailyPrice: 44,
    images: [
      "/placeholder.svg?height=240&width=400&text=Camry+Front",
      "/placeholder.svg?height=240&width=400&text=Camry+Side",
      "/placeholder.svg?height=240&width=400&text=Camry+Interior",
    ],
    specs: {
      engine: "4-Cyl",
      fuel: "HYBRID",
      transmission: "AUTOMATIC",
      efficiency: "5.2 ft/100 km",
      capacity: "500 LT",
    },
  },
  {
    id: 5,
    brand: "Honda",
    model: "Civic",
    type: "Compact",
    rating: 4.4,
    reviews: 234,
    bookedTime: "Available",
    originalPrice: 200,
    discountedPrice: 160,
    dailyPrice: 32,
    images: [
      "/placeholder.svg?height=240&width=400&text=Civic+Front",
      "/placeholder.svg?height=240&width=400&text=Civic+Side",
    ],
    specs: {
      engine: "4-Cyl",
      fuel: "PETROL",
      transmission: "MANUAL",
      efficiency: "6.8 ft/100 km",
      capacity: "428 LT",
    },
  },
  {
    id: 6,
    brand: "Tesla",
    model: "Model S",
    type: "Electric",
    rating: 4.9,
    reviews: 89,
    bookedTime: "Booked till 8 PM",
    originalPrice: 800,
    discountedPrice: 650,
    dailyPrice: 130,
    images: [
      "/placeholder.svg?height=240&width=400&text=Tesla+Front",
      "/placeholder.svg?height=240&width=400&text=Tesla+Side",
      "/placeholder.svg?height=240&width=400&text=Tesla+Interior",
      "/placeholder.svg?height=240&width=400&text=Tesla+Back",
    ],
    specs: {
      engine: "Electric",
      fuel: "ELECTRIC",
      transmission: "AUTOMATIC",
      efficiency: "0 ft/100 km",
      capacity: "804 LT",
    },
  },
]

export default function SearchResultSection() {
  // Date and time state
  const [pickupDate, setPickupDate] = useState<Date>(new Date())
  const [dropoffDate, setDropoffDate] = useState<Date>(addDays(new Date(), 5))
  const [pickupTime, setPickupTime] = useState("10:00")
  const [dropoffTime, setDropoffTime] = useState("10:00")

  // Location state
  const [location, setLocation] = useState("Concord, NC, United States")

  // Filter state
  const [currentFilters, setCurrentFilters] = useState<FilterCriteria | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate the rental duration in days
  const rentalDays = Math.max(1, Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))

  // Filter cars based on current filters (simulating backend filtering)
  const filteredCars = currentFilters
    ? allCars.filter((car) => {
        // Price range filter
        if (car.discountedPrice < currentFilters.priceRange[0] || car.discountedPrice > currentFilters.priceRange[1])
          return false

        // Daily price filter
        if (car.dailyPrice > currentFilters.dailyPriceMax) return false

        // Car type filter
        if (currentFilters.carTypes.length > 0 && !currentFilters.carTypes.includes(car.type)) return false

        // Fuel type filter
        if (currentFilters.fuelTypes.length > 0 && !currentFilters.fuelTypes.includes(car.specs.fuel)) return false

        // Transmission filter
        if (
          currentFilters.transmissionTypes.length > 0 &&
          !currentFilters.transmissionTypes.includes(car.specs.transmission)
        )
          return false

        // Brand filter
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(car.brand)) return false

        // Luxury filter
        if (currentFilters.luxuryOnly && !["Porsche", "Maserati", "Tesla"].includes(car.brand)) return false

        // Search query filter
        if (currentFilters.searchQuery.trim()) {
          const query = currentFilters.searchQuery.toLowerCase()
          const searchableText = `${car.brand} ${car.model} ${car.type}`.toLowerCase()
          if (!searchableText.includes(query)) return false
        }

        return true
      })
    : allCars

  // Handle filter changes from FilterComponent
  const handleFilterChange = useCallback((filters: FilterCriteria) => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      setCurrentFilters(filters)
      setIsLoading(false)

      // In a real app, you would send filters to backend here:
      // await fetchCarsFromBackend(filters)
      console.log("Filter criteria to send to backend:", filters)
    }, 300)
  }, [])

  // Handle clearing all filters
  const handleClearFilters = useCallback(() => {
    setCurrentFilters(null)
    // In a real app, you would also reset the FilterComponent state
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header
        location={location}
        setLocation={setLocation}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        dropoffDate={dropoffDate}
        setDropoffDate={setDropoffDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        dropoffTime={dropoffTime}
        setDropoffTime={setDropoffTime}
      />

      {/* Filter Component */}
      <FilterComponent onFilterChange={handleFilterChange} rentalDays={rentalDays} />

      {/* Search Result Component */}
      <SearchResultComponent
        cars={filteredCars}
        location={location}
        isLoading={isLoading}
        onClearFilters={handleClearFilters}
      />
    </div>
  )
}
