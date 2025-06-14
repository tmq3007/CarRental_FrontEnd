"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LocationFilterProps {
  location: {
    province: string
    district: string
    ward: string
  }
  onLocationChange: (field: string, value: string) => void
  compact?: boolean
}

export default function LocationFilter({ location, onLocationChange, compact = false }: LocationFilterProps) {
  const [provinces, setProvinces] = useState([
    "Hanoi",
    "Ho Chi Minh City",
    "Da Nang",
    "Hai Phong",
    "Can Tho",
    "Nha Trang",
  ])

  const [districts, setDistricts] = useState<string[]>([])
  const [wards, setWards] = useState<string[]>([])

  // Simulate loading districts based on province
  useEffect(() => {
    if (location.province) {
      // In a real app, you would fetch districts based on the selected province
      setDistricts([
        `${location.province} District 1`,
        `${location.province} District 2`,
        `${location.province} District 3`,
        `${location.province} District 4`,
      ])
    } else {
      setDistricts([])
    }
  }, [location.province])

  // Simulate loading wards based on district
  useEffect(() => {
    if (location.district) {
      // In a real app, you would fetch wards based on the selected district
      setWards([`${location.district} Ward 1`, `${location.district} Ward 2`, `${location.district} Ward 3`])
    } else {
      setWards([])
    }
  }, [location.district])

  if (compact) {
    return (
      <div className="space-y-2">
        <Select value={location.province} onValueChange={(value) => onLocationChange("province", value)}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-2">
          <Select
            value={location.district}
            onValueChange={(value) => onLocationChange("district", value)}
            disabled={!location.province}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={location.ward}
            onValueChange={(value) => onLocationChange("ward", value)}
            disabled={!location.district}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward} value={ward}>
                  {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={18} className="text-primary" />
        <h4 className="font-medium text-base">Pickup Location</h4>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="province" className="text-sm mb-1 block">
            Province
          </Label>
          <Select value={location.province} onValueChange={(value) => onLocationChange("province", value)}>
            <SelectTrigger id="province" className="w-full">
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="district" className="text-sm mb-1 block">
              District
            </Label>
            <Select
              value={location.district}
              onValueChange={(value) => onLocationChange("district", value)}
              disabled={!location.province}
            >
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ward" className="text-sm mb-1 block">
              Ward
            </Label>
            <Select
              value={location.ward}
              onValueChange={(value) => onLocationChange("ward", value)}
              disabled={!location.district}
            >
              <SelectTrigger id="ward" className="w-full">
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
