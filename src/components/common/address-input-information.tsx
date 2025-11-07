"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { useGetDistrictsQuery, useGetProvincesQuery, useGetWardsQuery } from "@/lib/services/local-api/address-api"

interface AddressComponentProps {
  // Address fields
  houseNumberStreet?: string
  cityProvince?: string
  district?: string
  ward?: string

  // Change handlers
  onHouseNumberStreetChange?: (value: string) => void
  onCityProvinceChange?: (value: string) => void
  onDistrictChange?: (value: string) => void
  onWardChange?: (value: string) => void

  // Error messages
  errors?: {
    houseNumberStreet?: string
    cityProvince?: string
    district?: string
    ward?: string
  }

  // Display modes
  mode?: 'booking' | 'profile' // Added mode prop to differentiate usage
  readOnly?: boolean
  className?: string
  compact?: boolean // For more compact layout when needed
}

export function AddressComponent({
                                   houseNumberStreet = "",
                                   cityProvince = "",
                                   district = "",
                                   ward = "",
                                   onHouseNumberStreetChange = () => {},
                                   onCityProvinceChange = () => {},
                                   onDistrictChange = () => {},
                                   onWardChange = () => {},
                                   errors = {},
                                   mode = 'booking',
                                   readOnly = false,
                                   className = "",
                                   compact = false
                                 }: AddressComponentProps) {
  // Fetch Provinces
  const { data: provinces = [] } = useGetProvincesQuery()

  // Fetch Districts when cityProvince changes
  const { data: districts = [] } = useGetDistrictsQuery(
      provinces.find(p => p.name === cityProvince)?.code || 0,
      { skip: !cityProvince }
  )

  // Fetch Wards when district changes
  const { data: wards = [] } = useGetWardsQuery(
      districts.find(d => d.name === district)?.code || 0,
      { skip: !district }
  )

  // Find current selections by name
  const currentProvince = provinces.find(p => p.name === cityProvince)
  const currentDistrict = districts.find(d => d.name === district)
  const currentWard = wards.find(w => w.name === ward)

  // Handlers for address changes
  const handleProvinceChange = (code: string) => {
    const selectedProvince = provinces.find(p => p.code.toString() === code)
    if (selectedProvince) {
      onCityProvinceChange(selectedProvince.name)
      // Reset dependent fields
      onDistrictChange("")
      onWardChange("")
    }
  }

  const handleDistrictChange = (code: string) => {
    const selectedDistrict = districts.find(d => d.code.toString() === code)
    if (selectedDistrict) {
      onDistrictChange(selectedDistrict.name)
      // Reset dependent field
      onWardChange("")
    }
  }

  const handleWardChange = (code: string) => {
    const selectedWard = wards.find(w => w.code.toString() === code)
    if (selectedWard) {
      onWardChange(selectedWard.name)
    }
  }

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
    )
  }

  if (readOnly) {
    return (
        <div className={className}>
          <Label className="text-sm font-medium">Address:</Label>
          <div className="mt-1">
            {houseNumberStreet && <span>{houseNumberStreet}, </span>}
            {ward && <span>{ward}, </span>}
            {district && <span>{district}, </span>}
            {cityProvince && <span>{cityProvince}</span>}
          </div>
        </div>
    )
  }

  if (mode === 'booking') {
    return (
        <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
          {/* Left side: House number & Street */}
          <div className="flex-1 space-y-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">City/Province*</Label>
              <Select
                  onValueChange={handleProvinceChange}
                  value={currentProvince?.code.toString() || ""}
              >
                <SelectTrigger className={errors.cityProvince ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select City/Province">
                    {cityProvince || "Select City/Province"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code.toString()}>
                        {province.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.cityProvince} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">District*</Label>
              <Select
                  onValueChange={handleDistrictChange}
                  value={currentDistrict?.code.toString() || ""}
                  disabled={!cityProvince}
              >
                <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select District">
                    {district || "Select District"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                      <SelectItem key={district.code} value={district.code.toString()}>
                        {district.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.district} />
            </div>


          </div>


          {/* Right side: Province, District, Ward */}
          <div className="flex-1 space-y-2">

            <div className="space-y-2">
              <Label className="text-sm font-medium">Ward*</Label>
              <Select
                  onValueChange={handleWardChange}
                  value={currentWard?.code.toString() || ""}
                  disabled={!district}
              >
                <SelectTrigger className={errors.ward ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Ward">
                    {ward || "Select Ward"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.code.toString()}>
                        {ward.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.ward} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">House number & Street*</Label>
              <Input
                  value={houseNumberStreet}
                  onChange={(e) => onHouseNumberStreetChange(e.target.value)}
                  className={errors.houseNumberStreet ? "border-red-500" : ""}
              />
              <ErrorMessage error={errors.houseNumberStreet} />
            </div>

          </div>
        </div>
    )

  }

  // Default mode (profile)
  return (
      <div className={`space-y-2 ${className}`}>
        <Label className="text-sm font-medium">Address:</Label>
        <div className="space-y-2">
          <div>
            <Input
                value={houseNumberStreet}
                onChange={(e) => onHouseNumberStreetChange(e.target.value)}
                placeholder="House number and street (optional)"
                className={errors.houseNumberStreet ? "border-red-500" : ""}
            />
            <ErrorMessage error={errors.houseNumberStreet} />
          </div>

          <div>
            <Label className="text-sm font-medium">City/Province:</Label>
            <Select
                onValueChange={handleProvinceChange}
                value={currentProvince?.code.toString() || ""}
            >
              <SelectTrigger className={errors.cityProvince ? "border-red-500" : ""}>
                <SelectValue placeholder="Select City/Province">
                  {cityProvince || "Select City/Province"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code.toString()}>
                      {province.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.cityProvince} />
          </div>

          <div>
            <Label className="text-sm font-medium">District:</Label>
            <Select
                onValueChange={handleDistrictChange}
                value={currentDistrict?.code.toString() || ""}
                disabled={!cityProvince}
            >
              <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                <SelectValue placeholder="Select District">
                  {district || "Select District"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code.toString()}>
                      {district.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.district} />
          </div>

          <div>
            <Label className="text-sm font-medium">Ward:</Label>
            <Select
                onValueChange={handleWardChange}
                value={currentWard?.code.toString() || ""}
                disabled={!district}
            >
              <SelectTrigger className={errors.ward ? "border-red-500" : ""}>
                <SelectValue placeholder="Select Ward">
                  {ward || "Select Ward"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code.toString()}>
                      {ward.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.ward} />
          </div>
        </div>
      </div>
  )
}