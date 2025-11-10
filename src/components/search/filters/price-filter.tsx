"use client"

import { DualRangeSlider } from "@/components/ui/dual-slider"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"

interface PriceFilterProps {
  filters: any
  handleFilterChange: (filterType: string, value: any) => void
  rentalDays: number
  compact?: boolean
}

export default function PriceFilter({ filters, handleFilterChange, rentalDays, compact = false }: PriceFilterProps) {
  if (compact) {
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span>Total: {formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </div>
          <DualRangeSlider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            max={10000000}
            min={0}
            step={100000}
            className="w-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-medium text-base mb-4">Total Price Range</h4>
        <p className="text-sm text-muted-foreground mb-4">For the entire {rentalDays}-day rental</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{formatCurrency(filters.priceRange[0])}</span>
            <span className="font-medium">{formatCurrency(filters.priceRange[1])}</span>
          </div>

          <DualRangeSlider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            max={10000000}
            min={0}
            step={100000}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
