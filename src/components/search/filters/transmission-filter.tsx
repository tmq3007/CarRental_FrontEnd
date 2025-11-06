"use client"

import { Check } from "lucide-react"

interface TransmissionFilterProps {
  filters: any
  toggleArrayFilter: (filterType: string, value: string) => void
  compact?: boolean
}

export default function TransmissionFilter({ filters, toggleArrayFilter, compact = false }: TransmissionFilterProps) {
  const transmissionTypes = [
    { id: "AUTOMATIC", label: "Automatic" },
    { id: "MANUAL", label: "Manual" },
  ]

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {transmissionTypes.map((type) => (
          <div
            key={type.id}
            className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all duration-200 text-sm ${
              filters.transmissionTypes.includes(type.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => toggleArrayFilter("transmissionTypes", type.id)}
          >
            {type.label}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h4 className="font-medium text-base mb-4">Transmission Type</h4>
      <div className="grid grid-cols-2 gap-4">
        {transmissionTypes.map((type) => (
          <div
            key={type.id}
            className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              filters.transmissionTypes.includes(type.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => toggleArrayFilter("transmissionTypes", type.id)}
          >
            <span className="font-medium">{type.label}</span>
            {filters.transmissionTypes.includes(type.id) && <Check size={16} className="ml-2 text-primary" />}
          </div>
        ))}
      </div>
    </div>
  )
}
