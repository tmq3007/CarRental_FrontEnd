"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Check, Search, X } from "lucide-react"
import { useState } from "react"

interface VehicleTypeFilterProps {
  filters: any
  toggleArrayFilter: (filterType: string, value: string) => void
  compact?: boolean
}

export default function VehicleTypeFilter({ filters, toggleArrayFilter, compact = false }: VehicleTypeFilterProps) {
  const [brandSearchQuery, setBrandSearchQuery] = useState("")
  const [showAllBrands, setShowAllBrands] = useState(false)

  const vehicleTypes = [
    { id: "SUV", label: "SUV" },
    { id: "Sedan", label: "Sedan" },
    { id: "Sports", label: "Sports Car" },
    { id: "Compact", label: "Compact" },
    { id: "Electric", label: "Electric" },
    { id: "Luxury", label: "Luxury" },
  ]

  const allBrands = [
    "Porsche",
    "Maserati",
    "BMW",
    "Toyota",
    "Honda",
    "Tesla",
    "Mercedes",
    "Audi",
    "Ford",
    "Chevrolet",
    "Nissan",
    "Hyundai",
    "Volkswagen",
    "Lexus",
    "Infiniti",
    "Acura",
    "Cadillac",
    "Lincoln",
    "Jaguar",
    "Land Rover",
    "Volvo",
    "Subaru",
    "Mazda",
    "Mitsubishi",
    "Kia",
    "Genesis",
    "Alfa Romeo",
    "Bentley",
    "Rolls Royce",
    "Ferrari",
  ]

  const filteredBrands = allBrands.filter((brand) => brand.toLowerCase().includes(brandSearchQuery.toLowerCase()))

  const displayedBrands = compact
    ? filteredBrands.slice(0, showAllBrands ? filteredBrands.length : 6)
    : filteredBrands.slice(0, showAllBrands ? filteredBrands.length : 12)

  const selectedBrands = filters.brands || []

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Vehicle Types */}
        <div className="grid grid-cols-2 gap-2">
          {vehicleTypes.slice(0, 4).map((type) => (
            <div
              key={type.id}
              className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all duration-200 text-xs ${
                filters.carTypes.includes(type.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleArrayFilter("carTypes", type.id)}
            >
              {type.label}
            </div>
          ))}
        </div>

        {/* Brand Search */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search brands..."
              value={brandSearchQuery}
              onChange={(e) => setBrandSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            {brandSearchQuery && (
              <button
                onClick={() => setBrandSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Selected Brands Count */}
          {selectedBrands.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {selectedBrands.length} brand{selectedBrands.length !== 1 ? "s" : ""} selected
            </div>
          )}

          {/* Brand List */}
          <div className="max-h-32 overflow-y-auto space-y-1">
            {displayedBrands.map((brand) => (
              <Label
                key={brand}
                className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-muted/50 transition-colors text-xs"
              >
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleArrayFilter("brands", brand)}
                  className="h-3 w-3"
                />
                <span>{brand}</span>
              </Label>
            ))}
          </div>

          {/* Show More/Less Button */}
          {filteredBrands.length > (compact ? 6 : 12) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="w-full h-6 text-xs"
            >
              {showAllBrands ? "Show Less" : `Show ${filteredBrands.length - (compact ? 6 : 12)} More`}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Types */}
      <div>
        <h4 className="font-medium text-base mb-4">Vehicle Type</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {vehicleTypes.map((type) => (
            <div
              key={type.id}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 min-h-[60px] ${
                filters.carTypes.includes(type.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleArrayFilter("carTypes", type.id)}
            >
              <span className="text-sm font-medium text-center">{type.label}</span>
              {filters.carTypes.includes(type.id) && <Check size={16} className="ml-2 text-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* Brands with Search */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-base">Brands</h4>
          {selectedBrands.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedBrands.length} selected</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleArrayFilter("brands", "")}
                className="text-xs h-6 px-2"
                onClickCapture={(e) => {
                  e.preventDefault()
                  // Clear all selected brands
                    selectedBrands.forEach((brand: string) => toggleArrayFilter("brands", brand))
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search brands..."
            value={brandSearchQuery}
            onChange={(e) => setBrandSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          {brandSearchQuery && (
            <button
              onClick={() => setBrandSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Selected Brands Display */}
        {selectedBrands.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Selected Brands:</div>
            <div className="flex flex-wrap gap-2">
                {selectedBrands.map((brand: string) => (
                <Badge
                  key={brand}
                  variant="default"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => toggleArrayFilter("brands", brand)}
                >
                  {brand}
                  <X size={12} className="ml-1" />
                </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Brand Selection Grid */}
        <div className="space-y-2">
          {brandSearchQuery && filteredBrands.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No brands found matching "{brandSearchQuery}"
            </div>
          )}

          <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayedBrands.map((brand) => (
                <Label
                  key={brand}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleArrayFilter("brands", brand)}
                  />
                  <span className="text-sm">{brand}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* Show More/Less Button */}
          {filteredBrands.length > 12 && (
            <Button variant="outline" size="sm" onClick={() => setShowAllBrands(!showAllBrands)} className="w-full">
              {showAllBrands ? "Show Less" : `Show ${filteredBrands.length - 12} More Brands`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
