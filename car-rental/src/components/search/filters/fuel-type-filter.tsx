"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface FuelTypeFilterProps {
  filters: any
  toggleArrayFilter: (filterType: string, value: string) => void
  compact?: boolean
}

export default function FuelTypeFilter({ filters, toggleArrayFilter, compact = false }: FuelTypeFilterProps) {
  const fuelTypes = [
    { id: "PETROL", label: "Petrol" },
    { id: "DIESEL", label: "Diesel" },
    { id: "HYBRID", label: "Hybrid" },
    { id: "ELECTRIC", label: "Electric" },
  ]

  if (compact) {
    return (
      <div className="space-y-2">
        {fuelTypes.map((type) => (
          <Label key={type.id} className="flex items-center space-x-2 cursor-pointer text-sm">
            <Checkbox
              checked={filters.fuelTypes.includes(type.id)}
              onCheckedChange={() => toggleArrayFilter("fuelTypes", type.id)}
            />
            <span>{type.label}</span>
          </Label>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h4 className="font-medium text-base mb-4">Fuel Type</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fuelTypes.map((type) => (
          <Label
            key={type.id}
            className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors border"
          >
            <Checkbox
              checked={filters.fuelTypes.includes(type.id)}
              onCheckedChange={() => toggleArrayFilter("fuelTypes", type.id)}
            />
            <span className="text-sm font-medium">{type.label}</span>
          </Label>
        ))}
      </div>
    </div>
  )
}
