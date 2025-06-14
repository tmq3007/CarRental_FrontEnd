"use client"
import { Button } from "@/components/ui/button"
import { X, AlignJustify } from "lucide-react"
import FilterTabs from "./filter-tabs"
import VehicleTypeFilter from "./filters/vehicle-type-filter"
import PriceFilter from "./filters/price-filter"
import FuelTypeFilter from "./filters/fuel-type-filter"
import TransmissionFilter from "./filters/transmission-filter"
import LocationAndTimeFilter from "./filters/datetime-filter"

interface FilterPanelProps {
  isExpanded: boolean
  onToggleExpanded: () => void
  activeTab: string
  onTabChange: (tab: string) => void
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  toggleArrayFilter: (filterType: string, value: string) => void
  onClearAll: () => void
  activeFiltersCount: number
  rentalDays: number
  isFullView: boolean
  onToggleFullView: () => void
  location: {
    province: string
    district: string
    ward: string
  }
  onLocationChange: (field: string, value: string) => void
  pickupTime: Date | undefined
  dropoffTime: Date | undefined
  onPickupTimeChange: (date: Date | undefined) => void
  onDropoffTimeChange: (date: Date | undefined) => void
  onApplyFilters: () => void // New prop
}

export default function FilterPanel({
  isExpanded,
  onToggleExpanded,
  activeTab,
  onTabChange,
  filters,
  handleFilterChange,
  toggleArrayFilter,
  onClearAll,
  activeFiltersCount,
  rentalDays,
  isFullView,
  onToggleFullView,
  location,
  onLocationChange,
  pickupTime,
  dropoffTime,
  onPickupTimeChange,
  onDropoffTimeChange,
  onApplyFilters,
}: FilterPanelProps) {
  if (!isExpanded) return null

  return (
    <div className="sticky top-28 z-40 transition-all duration-300 opacity-100 pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onToggleExpanded} />

      {/* Filter Panel */}
      <div
        className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-background rounded-xl shadow-2xl transition-all duration-300 ease-out translate-y-0 opacity-100"
        style={{
          maxHeight: "75vh",
          width: "90%",
          maxWidth: isFullView ? "1000px" : "800px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Filter Options</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullView}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <AlignJustify size={14} />
              {isFullView ? "Compact view" : "Full view"}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleExpanded} className="rounded-full h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Content */}
        {isFullView ? (
          <FullViewContent
            filters={filters}
            handleFilterChange={handleFilterChange}
            toggleArrayFilter={toggleArrayFilter}
            rentalDays={rentalDays}
            location={location}
            onLocationChange={onLocationChange}
            pickupTime={pickupTime}
            dropoffTime={dropoffTime}
            onPickupTimeChange={onPickupTimeChange}
            onDropoffTimeChange={onDropoffTimeChange}
          />
        ) : (
          <CompactViewContent
            activeTab={activeTab}
            onTabChange={onTabChange}
            filters={filters}
            handleFilterChange={handleFilterChange}
            toggleArrayFilter={toggleArrayFilter}
            rentalDays={rentalDays}
            location={location}
            onLocationChange={onLocationChange}
            pickupTime={pickupTime}
            dropoffTime={dropoffTime}
            onPickupTimeChange={onPickupTimeChange}
            onDropoffTimeChange={onDropoffTimeChange}
          />
        )}

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t">
          <Button variant="outline" onClick={onClearAll} className="flex-1" disabled={activeFiltersCount === 0}>
            Clear All
          </Button>
          <Button onClick={onApplyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

// ... (CompactViewContent and FullViewContent remain unchanged)
function CompactViewContent({
  activeTab,
  onTabChange,
  filters,
  handleFilterChange,
  toggleArrayFilter,
  rentalDays,
  location,
  onLocationChange,
  pickupTime,
  dropoffTime,
  onPickupTimeChange,
  onDropoffTimeChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  toggleArrayFilter: (filterType: string, value: string) => void
  rentalDays: number
  location: {
    province: string
    district: string
    ward: string
  }
  onLocationChange: (field: string, value: string) => void
  pickupTime: Date | undefined
  dropoffTime: Date | undefined
  onPickupTimeChange: (date: Date | undefined) => void
  onDropoffTimeChange: (date: Date | undefined) => void
}) {
  return (
    <>
      {/* Filter Tabs */}
      <FilterTabs activeTab={activeTab} onTabChange={onTabChange} />

      {/* Filter Content */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(75vh - 180px)" }}>
        {activeTab === "location-time" && (
          <LocationAndTimeFilter
            pickupTime={pickupTime}
            dropoffTime={dropoffTime}
            onPickupTimeChange={onPickupTimeChange}
            onDropoffTimeChange={onDropoffTimeChange}
            location={location}
            onLocationChange={onLocationChange}
          />
        )}

        {activeTab === "vehicle-type" && <VehicleTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />}

        {activeTab === "price" && (
          <PriceFilter filters={filters} handleFilterChange={handleFilterChange} rentalDays={rentalDays} />
        )}

        {activeTab === "fuel" && <FuelTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />}

        {activeTab === "transmission" && <TransmissionFilter filters={filters} toggleArrayFilter={toggleArrayFilter} />}
      </div>
    </>
  )
}

function FullViewContent({
  filters,
  handleFilterChange,
  toggleArrayFilter,
  rentalDays,
  location,
  onLocationChange,
  pickupTime,
  dropoffTime,
  onPickupTimeChange,
  onDropoffTimeChange,
}: {
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  toggleArrayFilter: (filterType: string, value: string) => void
  rentalDays: number
  location: {
    province: string
    district: string
    ward: string
  }
  onLocationChange: (field: string, value: string) => void
  pickupTime: Date | undefined
  dropoffTime: Date | undefined
  onPickupTimeChange: (date: Date | undefined) => void
  onDropoffTimeChange: (date: Date | undefined) => void
}) {
  return (
    <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(75vh - 140px)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <div className="col-span-2">
          <LocationAndTimeFilter
            pickupTime={pickupTime}
            dropoffTime={dropoffTime}
            onPickupTimeChange={onPickupTimeChange}
            onDropoffTimeChange={onDropoffTimeChange}
            location={location}
            onLocationChange={onLocationChange}
          />
        </div>

        <div>
          <h4 className="font-medium text-base mb-4">Vehicle & Brands</h4>
          <VehicleTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} compact />
        </div>

        <div>
          <h4 className="font-medium text-base mb-4">Price Range</h4>
          <PriceFilter filters={filters} handleFilterChange={handleFilterChange} rentalDays={rentalDays} compact />
        </div>

        <div>
          <h4 className="font-medium text-base mb-4">Fuel Type</h4>
          <FuelTypeFilter filters={filters} toggleArrayFilter={toggleArrayFilter} compact />
        </div>

        <div>
          <h4 className="font-medium text-base mb-4">Transmission</h4>
          <TransmissionFilter filters={filters} toggleArrayFilter={toggleArrayFilter} compact />
        </div>
      </div>
    </div>
  )
}
