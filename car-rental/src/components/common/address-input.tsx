"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/lib/services/local-api/address-api"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the shape of the location object
export interface Location {
  province?: string;
  district?: string;
  ward?: string;
}

interface AddressInputProps {
  onLocationChange: (field: string, value: string) => void;
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  location: Location;
  disabledFields?: string[];
}

interface ComboBoxProps {
  options: { value: string; label: string }[];
  placeholder: string;
  label: string;
  isLoading: boolean;
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  disabled?: boolean;
}

const ComboBox = ({ options, placeholder, label, isLoading, selectedValue, onSelect, disabled }: ComboBoxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={disabled ? () => {} : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", disabled && "opacity-50 cursor-not-allowed")}
          disabled={disabled}
        >
          {isLoading ? (
            "Loading..."
          ) : selectedValue ? (
            options.find((option) => option.value === selectedValue)?.label
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onSelect(option.value === selectedValue ? null : option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const AddressInput = ({
  onLocationChange,
  orientation = "vertical",
  spacing = "md",
  location,
  disabledFields = [],
}: AddressInputProps) => {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null)
  const [selectedWardCode, setSelectedWardCode] = useState<number | null>(null)

  // Fetch provinces
  const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery()

  // Fetch districts based on selected province
  const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(selectedProvinceCode!, {
    skip: !selectedProvinceCode,
  })

  // Fetch wards based on selected district
  const { data: wards = [], isLoading: wardsLoading } = useGetWardsQuery(selectedDistrictCode!, {
    skip: !selectedDistrictCode,
  })

  // Sync local state with location prop
  useEffect(() => {
    if (location.province) {
      const province = provinces.find((p) => p.name === location.province)
      setSelectedProvinceCode(province?.code || null)
    } else {
      setSelectedProvinceCode(null)
    }
  }, [location.province, provinces])

  useEffect(() => {
    if (location.district && selectedProvinceCode) {
      const district = districts.find((d) => d.name === location.district)
      setSelectedDistrictCode(district?.code || null)
    } else {
      setSelectedDistrictCode(null)
    }
  }, [location.district, districts, selectedProvinceCode])

  useEffect(() => {
    if (location.ward && selectedDistrictCode) {
      const ward = wards.find((w) => w.name === location.ward)
      setSelectedWardCode(ward?.code || null)
    } else {
      setSelectedWardCode(null)
    }
  }, [location.ward, wards, selectedDistrictCode])

  // Convert provinces, districts, and wards to Combobox options format
  const provinceOptions = provincesLoading
    ? [{ value: "loading", label: "Loading..." }]
    : provinces.map((province) => ({
        value: province.code.toString(),
        label: province.name,
      }))

  const districtOptions = districtsLoading
    ? [{ value: "loading", label: "Loading..." }]
    : districts.map((district) => ({
        value: district.code.toString(),
        label: district.name,
      }))

  const wardOptions = wardsLoading
    ? [{ value: "loading", label: "Loading..." }]
    : wards.map((ward) => ({
        value: ward.code.toString(),
        label: ward.name,
      }))

  // Handle selection changes
  const handleProvinceSelect = (value: string | null) => {
    const province = provinces.find((p) => p.code.toString() === value)
    setSelectedProvinceCode(province?.code || null)
    setSelectedDistrictCode(null)
    setSelectedWardCode(null)
    onLocationChange("province", province?.name || "")
    onLocationChange("district", "")
    onLocationChange("ward", "")
  }

  const handleDistrictSelect = (value: string | null) => {
    const district = districts.find((d) => d.code.toString() === value)
    setSelectedDistrictCode(district?.code || null)
    setSelectedWardCode(null)
    onLocationChange("district", district?.name || "")
    onLocationChange("ward", "")
  }

  const handleWardSelect = (value: string | null) => {
    const ward = wards.find((w) => w.code.toString() === value)
    setSelectedWardCode(ward?.code || null)
    onLocationChange("ward", ward?.name || "")
  }

  // Dynamic spacing classes
  const getSpacingClass = () => {
    const spacingMap = {
      sm: orientation === "horizontal" ? "gap-2" : "space-y-2",
      md: orientation === "horizontal" ? "gap-4" : "space-y-4",
      lg: orientation === "horizontal" ? "gap-6" : "space-y-6",
    }
    return spacingMap[spacing]
  }

  // Container classes based on orientation
  const containerClasses = orientation === "horizontal"
    ? `flex flex-col sm:flex-row w-full ${getSpacingClass()}`
    : `${getSpacingClass()}`

  // Item classes for horizontal layout
  const itemClasses = orientation === "horizontal" ? "flex-1 min-w-0" : ""

  return (
    <div className={containerClasses}>
      {/* Province Selection */}
      <div className={`space-y-2 ${itemClasses}`}>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Province
        </Label>
        <ComboBox
          options={provinceOptions}
          placeholder="Select province..."
          label="Province"
          isLoading={provincesLoading}
          selectedValue={selectedProvinceCode?.toString() || null}
          onSelect={handleProvinceSelect}
          disabled={disabledFields.includes("province")}
        />
      </div>

      {/* District Selection */}
      <div className={`space-y-2 ${itemClasses}`}>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          District
        </Label>
        <ComboBox
          options={districtOptions}
          placeholder="Select district..."
          label="District"
          isLoading={districtsLoading}
          selectedValue={selectedDistrictCode?.toString() || null}
          onSelect={handleDistrictSelect}
          disabled={disabledFields.includes("district") || !selectedProvinceCode}
        />
      </div>

      {/* Ward Selection */}
      <div className={`space-y-2 ${itemClasses}`}>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Ward
        </Label>
        <ComboBox
          options={wardOptions}
          placeholder="Select ward..."
          label="Ward"
          isLoading={wardsLoading}
          selectedValue={selectedWardCode?.toString() || null}
          onSelect={handleWardSelect}
          disabled={!selectedDistrictCode}
        />
      </div>
    </div>
  )
}

export default AddressInput