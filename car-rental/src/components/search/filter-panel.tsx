"use client"

import { useState, useEffect } from "react"
import { X, AlignJustify, Check, Car, CircleDollarSign, Fuel, BadgeCheck, Gauge } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { DualRangeSlider } from "../ui/dual-slider"

interface FilterPanelProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  toggleArrayFilter: (filterType: string, value: string) => void
  clearAllFilters: () => void
  getActiveFilterCount: () => number
  rentalDays: number
}

const filterTabs = [
  { id: "vehicle-type", icon: <Car size={18} />, label: "Vehicle Type" },
  { id: "price", icon: <CircleDollarSign size={18} />, label: "Price" },
  { id: "fuel", icon: <Fuel size={18} />, label: "Fuel Type" },
  { id: "features", icon: <BadgeCheck size={18} />, label: "Features" },
  { id: "transmission", icon: <Gauge size={18} />, label: "Transmission" },
]

export default function FilterPanel({
  showFilters,
  setShowFilters,
  filters,
  handleFilterChange,
  toggleArrayFilter,
  clearAllFilters,
  getActiveFilterCount,
  rentalDays,
}: FilterPanelProps) {
  const [isFullFilterView, setIsFullFilterView] = useState(false)
  const [activeFilterTab, setActiveFilterTab] = useState<string>("vehicle-type")
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle animation states
  useEffect(() => {
    if (showFilters) {
      setIsAnimating(true)
      // Reset animation state after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [showFilters])

  if (!showFilters) return null

  return (
    <div
      className={cn(
        "bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out",
        showFilters
          ? "max-h-[800px] opacity-100 transform translate-y-0"
          : "max-h-0 opacity-0 transform -translate-y-4",
      )}
    >
      <div
        className={cn("max-w-7xl mx-auto px-4 transition-all duration-300 ease-in-out", showFilters ? "py-4" : "py-0")}
      >
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            showFilters && !isAnimating ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2",
          )}
        >
          {/* Filter Panel Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-xl">Filters</h3>
              <button
                className="text-xs text-green-600 hover:text-green-700 underline flex items-center transition-colors"
                onClick={() => setIsFullFilterView(!isFullFilterView)}
              >
                <AlignJustify size={14} className="mr-1" />
                {isFullFilterView ? "Compact view" : "Full view"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter Navigation Tabs - Only show in compact mode */}
          {!isFullFilterView && (
            <div className="border-b border-gray-200 mb-4">
              <div className="flex space-x-2 md:space-x-6 overflow-x-auto pb-2 px-1 scrollbar-hide">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium pb-3 px-2 border-b-2 transition-all duration-200 whitespace-nowrap min-w-fit",
                      activeFilterTab === tab.id
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )}
                    onClick={() => setActiveFilterTab(tab.id)}
                  >
                    <span className="flex-shrink-0">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Content */}
          <div className="min-h-[200px]">
            {/* Compact View - Show only active section */}
            {!isFullFilterView ? (
              <div
                className={cn("transition-all duration-300 ease-in-out", "animate-in fade-in slide-in-from-right-2")}
                key={activeFilterTab}
              >
                {activeFilterTab === "vehicle-type" && (
                  <VehicleTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />
                )}

                {activeFilterTab === "price" && (
                  <PriceFilter filters={filters} handleFilterChange={handleFilterChange} rentalDays={rentalDays} />
                )}

                {activeFilterTab === "fuel" && (
                  <FuelTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />
                )}

                {activeFilterTab === "features" && (
                  <FeaturesFilter filters={filters} handleFilterChange={handleFilterChange} />
                )}

                {activeFilterTab === "transmission" && (
                  <TransmissionFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />
                )}
              </div>
            ) : (
              // Full View - Show all filter sections with mobile-optimized layout
              <div className="max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-6 animate-in fade-in duration-300 pb-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg mb-4">Vehicle Type</h4>
                    <VehicleTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} compact />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg mb-4">Price Range</h4>
                    <PriceFilter
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                      rentalDays={rentalDays}
                      compact
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg mb-4">Features</h4>
                    <FeaturesFilter filters={filters} handleFilterChange={handleFilterChange} compact />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg mb-4">Fuel Type</h4>
                    <FuelTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} compact />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg mb-4">Transmission</h4>
                    <TransmissionFilter filters={filters} toggleArrayFilter={toggleArrayFilter} compact />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg mb-4">Brands</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Porsche", "Maserati", "BMW", "Toyota", "Honda", "Tesla"].map((brand) => (
                        <div
                          key={brand}
                          className={cn(
                            "px-3 py-2 text-sm border rounded-full cursor-pointer transition-all duration-200",
                            filters.brands.includes(brand)
                              ? "bg-green-500 text-white border-green-500 scale-105"
                              : "border-gray-300 hover:border-green-500 hover:scale-105",
                          )}
                          onClick={() => toggleArrayFilter("brands", brand)}
                        >
                          {brand}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end items-center mt-8">
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 hover:scale-105"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Individual filter components
function VehicleTypeFilter({
  filters,
  toggleArrayFilter,
  compact = false,
}: {
  filters: any
  toggleArrayFilter: (filterType: string, value: string) => void
  compact?: boolean
}) {
  const vehicleTypes = [
    { id: "SUV", icon: "/placeholder.svg?height=30&width=60&text=SUV", label: "SUV" },
    { id: "Sedan", icon: "/placeholder.svg?height=30&width=60&text=Sedan", label: "Sedan" },
    { id: "Sports", icon: "/placeholder.svg?height=30&width=60&text=Sports", label: "Sports Car" },
    { id: "Compact", icon: "/placeholder.svg?height=30&width=60&text=Compact", label: "Compact" },
    { id: "Electric", icon: "/placeholder.svg?height=30&width=60&text=Electric", label: "Electric" },
  ]

  return (
    <div>
      {!compact && <h4 className="font-medium text-lg mb-4">Vehicle Type</h4>}
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
        )}
      >
        {vehicleTypes.map((type) => (
          <div
            key={type.id}
            className={cn(
              "flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 min-h-[80px] justify-center",
              filters.carTypes.includes(type.id)
                ? "border-green-500 bg-green-50 shadow-md"
                : "border-gray-200 hover:border-green-500",
            )}
            onClick={() => toggleArrayFilter("carTypes", type.id)}
          >
            <div className="relative">
              {!compact && (
                <img
                  src={type.icon || "/placeholder.svg"}
                  alt={type.label}
                  className="h-8 w-12 sm:h-12 sm:w-20 object-cover mb-2"
                />
              )}
              {filters.carTypes.includes(type.id) && (
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <Check size={12} className="text-white" />
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm text-center">{compact ? type.id : type.label}</span>
          </div>
        ))}
      </div>

      {!compact && (
        <>
          <h4 className="font-medium text-md mt-6 mb-3">Popular Brands</h4>
          <div className="flex flex-wrap gap-2">
            {["Porsche", "Maserati", "BMW", "Toyota", "Honda", "Tesla"].map((brand) => (
              <div
                key={brand}
                className={cn(
                  "px-3 py-2 text-sm border rounded-full cursor-pointer transition-all duration-200 hover:scale-105 min-h-[36px] flex items-center",
                  filters.brands.includes(brand)
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300 hover:border-green-500",
                )}
                onClick={() => toggleArrayFilter("brands", brand)}
              >
                {brand}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PriceFilter({
  filters,
  handleFilterChange,
  rentalDays,
  compact = false,
}: {
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  rentalDays: number
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="space-y-6">
        <div>
          <h5 className="font-medium text-sm mb-3">Total Price Range</h5>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">${filters.priceRange[0]}</span>
            <span className="font-medium">${filters.priceRange[1]}</span>
          </div>
          <DualRangeSlider
            defaultValue={[0, 1000]}
            min={0}
            max={1000}
            step={10}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={(value) => handleFilterChange("priceRange", [value[0], value[1]])}
            className="w-full"
          />
        </div>

        <div>
          <h5 className="font-medium text-sm mb-3">Daily Price Max</h5>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">$0</span>
            <span className="font-medium">${filters.dailyPriceMax}</span>
          </div>
          <DualRangeSlider
            defaultValue={[200]}
            min={0}
            max={200}
            step={5}
            value={[filters.dailyPriceMax]}
            onValueChange={(value) => handleFilterChange("dailyPriceMax", value[0])}
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h5 className="font-medium text-sm mb-3">Price includes</h5>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="free-cancellation-compact"
                checked={filters.freeCancellation}
                onCheckedChange={(checked) => handleFilterChange("freeCancellation", checked)}
              />
              <label htmlFor="free-cancellation-compact" className="text-sm">
                Free cancellation
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="instant-confirmation-compact"
                checked={filters.instantConfirmation}
                onCheckedChange={(checked) => handleFilterChange("instantConfirmation", checked)}
              />
              <label htmlFor="instant-confirmation-compact" className="text-sm">
                Instant confirmation
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-medium text-lg mb-4">Total Price Range</h4>
          <p className="text-sm text-gray-500 mb-2">For the entire {rentalDays}-day rental</p>

          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">${filters.priceRange[0]}</span>
              <span className="font-medium">${filters.priceRange[1]}</span>
            </div>

            <DualRangeSlider
              defaultValue={[0, 1000]}
              min={0}
              max={1000}
              step={10}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={(value) => handleFilterChange("priceRange", [value[0], value[1]])}
              className="w-full"
            />

            <div className="grid grid-cols-5 text-center text-xs text-gray-500">
              <span>$0</span>
              <span>$250</span>
              <span>$500</span>
              <span>$750</span>
              <span>$1000</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-4">Daily Price</h4>
          <p className="text-sm text-gray-500 mb-2">Price per day</p>

          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">$0</span>
              <span className="font-medium">${filters.dailyPriceMax}</span>
            </div>

            <DualRangeSlider
              defaultValue={[200]}
              min={0}
              max={200}
              step={5}
              value={[filters.dailyPriceMax]}
              onValueChange={(value) => handleFilterChange("dailyPriceMax", value[0])}
              className="w-full"
            />

            <div className="grid grid-cols-5 text-center text-xs text-gray-500">
              <span>$0</span>
              <span>$50</span>
              <span>$100</span>
              <span>$150</span>
              <span>$200</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="font-medium mb-3">Price includes</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="free-cancellation"
              checked={filters.freeCancellation}
              onCheckedChange={(checked) => handleFilterChange("freeCancellation", checked)}
            />
            <label htmlFor="free-cancellation" className="text-sm">
              Free cancellation
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="instant-confirmation"
              checked={filters.instantConfirmation}
              onCheckedChange={(checked) => handleFilterChange("instantConfirmation", checked)}
            />
            <label htmlFor="instant-confirmation" className="text-sm">
              Instant confirmation
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function FuelTypeFilter({
  filters,
  toggleArrayFilter,
  compact = false,
}: {
  filters: any
  toggleArrayFilter: (filterType: string, value: string) => void
  compact?: boolean
}) {
  const fuelTypes = [
    { id: "PETROL", label: "Petrol", icon: <Fuel size={20} /> },
    { id: "DIESEL", label: "Diesel", icon: <Fuel size={20} /> },
    { id: "HYBRID", label: "Hybrid", icon: <Fuel size={20} /> },
    { id: "ELECTRIC", label: "Electric", icon: <Fuel size={20} /> },
  ]

  if (compact) {
    return (
      <div className="space-y-3">
        {fuelTypes.map((fuel) => (
          <label key={fuel.id} className="flex items-center py-1">
            <input
              type="checkbox"
              checked={filters.fuelTypes.includes(fuel.id)}
              onChange={() => toggleArrayFilter("fuelTypes", fuel.id)}
              className="mr-3 rounded text-green-500 border-gray-300 focus:ring-green-500 w-4 h-4"
            />
            <span className="text-sm">{fuel.label}</span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h4 className="font-medium text-lg mb-4">Fuel Type</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fuelTypes.map((type) => (
          <div
            key={type.id}
            className={cn(
              "flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 min-h-[60px]",
              filters.fuelTypes.includes(type.id) ? "border-green-500 bg-green-50" : "border-gray-200",
            )}
            onClick={() => toggleArrayFilter("fuelTypes", type.id)}
          >
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              {type.icon}
            </div>
            <span className="flex-1">{type.label}</span>
            {filters.fuelTypes.includes(type.id) && <Check size={16} className="text-green-500 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesFilter({
  filters,
  handleFilterChange,
  compact = false,
}: {
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  compact?: boolean
}) {
  const features = [
    { id: "airConditioning", label: "Air conditioning" },
    { id: "unlimitedMileage", label: "Unlimited mileage" },
    { id: "freeCancellation", label: "Free cancellation" },
    { id: "instantConfirmation", label: "Instant confirmation" },
    { id: "luxuryOnly", label: "Luxury vehicles only" },
  ]

  return (
    <div>
      {!compact && <h4 className="font-medium text-lg mb-4">Features</h4>}
      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center space-x-3">
            <Switch
              id={`${feature.id}-${compact ? "compact" : "full"}`}
              checked={filters[feature.id]}
              onCheckedChange={(checked) => handleFilterChange(feature.id, checked)}
            />
            <label htmlFor={`${feature.id}-${compact ? "compact" : "full"}`} className="text-sm">
              {feature.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function TransmissionFilter({
  filters,
  toggleArrayFilter,
  compact = false,
}: {
  filters: any
  toggleArrayFilter: (filterType: string, value: string) => void
  compact?: boolean
}) {
  const transmissionTypes = [
    { id: "AUTOMATIC", label: "Automatic" },
    { id: "MANUAL", label: "Manual" },
  ]

  if (compact) {
    return (
      <div className="space-y-3">
        {transmissionTypes.map((transmission) => (
          <label key={transmission.id} className="flex items-center">
            <input
              type="checkbox"
              checked={filters.transmissionTypes.includes(transmission.id)}
              onChange={() => toggleArrayFilter("transmissionTypes", transmission.id)}
              className="mr-3 rounded text-green-500 border-gray-300 focus:ring-green-500 w-4 h-4"
            />
            <span className="text-sm">{transmission.label}</span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h4 className="font-medium text-lg mb-4">Transmission Type</h4>
      <div className="grid grid-cols-2 gap-4">
        {transmissionTypes.map((type) => (
          <div
            key={type.id}
            className={cn(
              "flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105",
              filters.transmissionTypes.includes(type.id) ? "border-green-500 bg-green-50" : "border-gray-200",
            )}
            onClick={() => toggleArrayFilter("transmissionTypes", type.id)}
          >
            <span className="font-medium">{type.label}</span>
            {filters.transmissionTypes.includes(type.id) && <Check size={16} className="ml-auto text-green-500" />}
          </div>
        ))}
      </div>
    </div>
  )
}
