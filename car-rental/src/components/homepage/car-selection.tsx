"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export interface CarFeature {
  id: string
  label: string
}

export interface CarType {
  id: string
  label: string
  icon?: string
}

export interface CarSelectionProps {
  selectedType: string
  selectedFeatures: string[]
  onTypeChange: (type: string) => void
  onFeatureToggle: (featureId: string) => void
}

const carTypes: CarType[] = [
  { id: "all", label: "All Car Types" },
  { id: "economy", label: "Economy" },
  { id: "compact", label: "Compact" },
  { id: "midsize", label: "Mid-size" },
  { id: "suv", label: "SUV" },
  { id: "luxury", label: "Luxury" },
  { id: "van", label: "Van/Minivan" },
  { id: "convertible", label: "Convertible" },
]

const carFeatures: CarFeature[] = [
  { id: "automatic", label: "Automatic" },
  { id: "manual", label: "Manual" },
  { id: "gps", label: "GPS Navigation" },
  { id: "bluetooth", label: "Bluetooth" },
  { id: "child-seat", label: "Child Seat" },
  { id: "air-conditioning", label: "Air Conditioning" },
]

export default function CarSelection({
  selectedType,
  selectedFeatures,
  onTypeChange,
  onFeatureToggle,
}: CarSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Car Type</Label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select car type" />
          </SelectTrigger>
          <SelectContent>
            {carTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Features</Label>
        <div className="grid grid-cols-2 gap-3">
          {carFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onCheckedChange={() => onFeatureToggle(feature.id)}
              />
              <label
                htmlFor={feature.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
