"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Users, Luggage, Settings, Edit, Upload, X, Eye } from "lucide-react"
import AddressInput from "@/components/common/address-input"
import type { Location } from "@/components/common/address-input"
import type { CarVO_Detail } from "@/lib/services/car-api"
import type { UserProfile } from "@/lib/services/user-api"
import type { BookingState } from "@/app/(car-rent)/booking/page"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BookingSummaryStepProps {
  bookingState: BookingState
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>
  car: CarVO_Detail
  user: UserProfile
}

// Interface for preserved driver data
interface DriverSpecificData {
  fullName: string
  dob: Date | undefined
  phoneNumber: string
  email: string
  nationalId: string
  drivingLicenseUri: string
  location: Location
  houseNumberStreet: string
}

export function BookingSummaryStep({ bookingState, setBookingState, car, user }: BookingSummaryStepProps) {
  const [isDifferentDriver, setIsDifferentDriver] = useState(false) // Initialize as unchecked
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State to preserve driver-specific data when toggling checkbox
  const [preservedDriverData, setPreservedDriverData] = useState<DriverSpecificData>({
    fullName: "",
    dob: undefined,
    phoneNumber: "",
    email: "",
    nationalId: "",
    drivingLicenseUri: "",
    location: {
      province: "",
      district: "",
      ward: "",
    },
    houseNumberStreet: "",
  })

  // Initialize driver information with renter data when component mounts
  useEffect(() => {
    if (!isDifferentDriver) {
      setBookingState((prev) => ({
        ...prev,
        driverFullName: user.fullName || "",
        driverDob: user.dob ? new Date(user.dob) : undefined,
        driverPhoneNumber: user.phoneNumber || "",
        driverEmail: user.email || "",
        driverNationalId: user.nationalId || "",
        driverDrivingLicenseUri: user.drivingLicenseUri || "",
        driverLocation: {
          province: user.cityProvince || "",
          district: user.district || "",
          ward: user.ward || "",
        },
        driverHouseNumberStreet: user.houseNumberStreet || "",
      }))
    }
  }, [user, setBookingState, isDifferentDriver])

  const handleInputChange = (field: keyof BookingState, value: string | Date) => {
    setBookingState((prev) => ({ ...prev, [field]: value }))

    // Also update preserved data when different driver is selected
    if (isDifferentDriver) {
      const fieldMap: { [key: string]: keyof DriverSpecificData } = {
        driverFullName: "fullName",
        driverDob: "dob",
        driverPhoneNumber: "phoneNumber",
        driverEmail: "email",
        driverNationalId: "nationalId",
        driverDrivingLicenseUri: "drivingLicenseUri",
        driverHouseNumberStreet: "houseNumberStreet",
      }

      const preservedField = fieldMap[field as string]
      if (preservedField) {
        setPreservedDriverData((prev) => ({
          ...prev,
          [preservedField]: value,
        }))
      }
    }
  }

  const handleAddressChange = (field: keyof BookingState, addressField: string, value: string) => {
    setBookingState((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as Location),
        [addressField]: value,
      },
    }))

    // Also update preserved location data when different driver is selected
    if (isDifferentDriver && field === "driverLocation") {
      setPreservedDriverData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [addressField]: value,
        },
      }))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        setPreviewImage(base64String)

        // Update both booking state and preserved data
        handleInputChange("driverDrivingLicenseUri", base64String)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    if (isDifferentDriver) {
      handleInputChange("driverDrivingLicenseUri", "")
    } else {
      // If not different driver, revert to user's license
      handleInputChange("driverDrivingLicenseUri", user.drivingLicenseUri || "")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDifferentDriverChange = (checked: boolean) => {
    setIsDifferentDriver(checked)

    if (!checked) {
      // When unchecked, populate with renter data but preserve driver-specific data
      setBookingState((prev) => ({
        ...prev,
        driverFullName: user.fullName || "",
        driverDob: user.dob ? new Date(user.dob) : undefined,
        driverPhoneNumber: user.phoneNumber || "",
        driverEmail: user.email || "",
        driverNationalId: user.nationalId || "",
        driverDrivingLicenseUri: user.drivingLicenseUri || "",
        driverLocation: {
          province: user.cityProvince || "",
          district: user.district || "",
          ward: user.ward || "",
        },
        driverHouseNumberStreet: user.houseNumberStreet || "",
      }))

      // Clear preview image when switching to renter data
      setPreviewImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } else {
      // When checked, restore preserved driver-specific data
      setBookingState((prev) => ({
        ...prev,
        driverFullName: preservedDriverData.fullName,
        driverDob: preservedDriverData.dob,
        driverPhoneNumber: preservedDriverData.phoneNumber,
        driverEmail: preservedDriverData.email,
        driverNationalId: preservedDriverData.nationalId,
        driverDrivingLicenseUri: preservedDriverData.drivingLicenseUri,
        driverLocation: preservedDriverData.location,
        driverHouseNumberStreet: preservedDriverData.houseNumberStreet,
      }))

      // Restore preview image if there was one
      if (preservedDriverData.drivingLicenseUri && preservedDriverData.drivingLicenseUri.startsWith("data:")) {
        setPreviewImage(preservedDriverData.drivingLicenseUri)
      }
    }
  }

  const currentLicenseImage = isDifferentDriver
    ? previewImage || bookingState.driverDrivingLicenseUri || ""
    : user.drivingLicenseUri || ""

  return (
    <div className="space-y-6">
      {/* Compact Horizontal Car Summary */}
      <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start gap-4 overflow-hidden">
          {/* Car Image */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <img
              src={car.carImageFront || "/placeholder.svg?height=80&width=120"}
              alt={`${car.brand} ${car.model}`}
              className="h-20 w-full sm:w-30 lg:w-30 rounded-lg object-cover bg-gray-200 flex-shrink-0"
            />
          </div>

          {/* Car Details */}
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              {car.brand} {car.model}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">{car.brand || "Car"}</Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{car.status}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{car.numberOfSeats || 4} Adults</span>
              </div>
              <div className="flex items-center space-x-1">
                <Settings className="h-3 w-3" />
                <span>{car.isAutomatic ? "Automatic" : "Manual"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Luggage className="h-3 w-3" />
                <span>{car.numberOfSeats ? `${Math.floor(car.numberOfSeats / 2)} Large Bags` : "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(car.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({car.numberOfRides || 0} Reviews)</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:text-right">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs mb-4">
              <div className="text-center sm:text-left lg:text-right">
                <p className="text-gray-600 font-medium">Pick-up</p>
                <p className="font-semibold">{bookingState.pickupDate?.toLocaleDateString() || "Not set"}</p>
                <p className="text-gray-500">{bookingState.pickupLocation.province || "Not set"}</p>
              </div>
              <div className="text-center sm:text-left lg:text-right">
                <p className="text-gray-600 font-medium">Drop-off</p>
                <p className="font-semibold">{bookingState.returnDate?.toLocaleDateString() || "Not set"}</p>
                <p className="text-gray-500">{bookingState.dropoffLocation.province || "Not set"}</p>
              </div>
              <div className="text-center sm:text-left lg:text-right">
                <p className="text-gray-600 font-medium">Duration</p>
                <p className="font-semibold">{bookingState.rentalDays || 0} Days</p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Insurance - ${car.insuranceUriIsVerified ? 87 : "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-red-500" />
            <span className="text-sm">Additional Driver - $45</span>
          </div>
        </div>
      </CardContent>
    </Card>

      {/* Renter's Information */}
      <Card>
        <CardHeader>
          <CardTitle>Renter's Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="renterFullName">Full Name *</Label>
              <Input
                id="renterFullName"
                value={user.fullName || ""}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterDob">Date of Birth *</Label>
              <Input
                id="renterDob"
                type="date"
                value={user.dob || ""}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterPhone">Phone Number *</Label>
              <Input
                id="renterPhone"
                value={user.phoneNumber || ""}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterEmail">Email Address *</Label>
              <Input
                id="renterEmail"
                type="email"
                value={user.email || ""}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterNationalId">National ID No. *</Label>
              <Input
                id="renterNationalId"
                value={user.nationalId || ""}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="renterAddress">Address *</Label>
              <AddressInput
                location={{
                  province: user.cityProvince || "",
                  district: user.district || "",
                  ward: user.ward || "",
                }}
                onLocationChange={() => {}} // No-op since it's disabled
                orientation="horizontal"
                disabledFields={["province","district","ward"]}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="renterStreetAddress">Street Address *</Label>
              <Input
                id="renterStreetAddress"
                value={user.houseNumberStreet || ""}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Renter's Driving License Image */}
          <div className="mt-6 pt-6 border-t">
            <Label className="text-base font-medium">Renter's Driving License</Label>
            <div className="mt-3">
              {user.drivingLicenseUri ? (
                <div className="relative inline-block">
                  <img
                    src={user.drivingLicenseUri || "/placeholder.svg"}
                    alt="Renter's Driving License"
                    className="w-40 h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <div className="absolute top-1 right-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="secondary" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Renter's Driving License</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <img
                            src={user.drivingLicenseUri || "/placeholder.svg"}
                            alt="Renter's Driving License"
                            className="max-w-full max-h-96 object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">No driving license image available</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver's Information */}
      <Card>
        <CardHeader>
          <CardTitle>Driver's Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="differentDriver"
                checked={isDifferentDriver}
                onCheckedChange={handleDifferentDriverChange}
              />
              <Label htmlFor="differentDriver" className="text-sm font-medium cursor-pointer">
                Different from Renter's information
              </Label>
            </div>

            {!isDifferentDriver && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  The driver information will be the same as the renter's information above.
                  {preservedDriverData.fullName && (
                    <span className="block mt-1 font-medium">
                      Previously entered driver data is preserved and will be restored when checked.
                    </span>
                  )}
                </p>
              </div>
            )}

            {isDifferentDriver && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="driverFullName">Full Name *</Label>
                  <Input
                    id="driverFullName"
                    placeholder="Enter full name"
                    value={bookingState.driverFullName || ""}
                    onChange={(e) => handleInputChange("driverFullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverDob">Date of Birth *</Label>
                  <Input
                    id="driverDob"
                    type="date"
                    value={bookingState.driverDob ? bookingState.driverDob.toISOString().split("T")[0] : ""}
                    onChange={(e) => handleInputChange("driverDob", new Date(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverPhone">Phone Number *</Label>
                  <Input
                    id="driverPhone"
                    placeholder="Enter phone number"
                    value={bookingState.driverPhoneNumber || ""}
                    onChange={(e) => handleInputChange("driverPhoneNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverEmail">Email Address *</Label>
                  <Input
                    id="driverEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={bookingState.driverEmail || ""}
                    onChange={(e) => handleInputChange("driverEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverNationalId">National ID No. *</Label>
                  <Input
                    id="driverNationalId"
                    placeholder="Enter national ID number"
                    value={bookingState.driverNationalId || ""}
                    onChange={(e) => handleInputChange("driverNationalId", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="driverAddress">Address *</Label>
                  <AddressInput
                    location={bookingState.driverLocation}
                    onLocationChange={(field, value) => handleAddressChange("driverLocation", field, value)}
                    orientation="horizontal"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="driverStreetAddress">Street Address *</Label>
                  <Input
                    id="driverStreetAddress"
                    placeholder="Enter full address"
                    value={bookingState.driverHouseNumberStreet || ""}
                    onChange={(e) => handleInputChange("driverHouseNumberStreet", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Driver's Driving License Image Uploader - Placed at the end */}
            <div className="mt-6 pt-6 border-t">
              <div className="mt-3 space-y-3">
                

                {/* Upload Button - Only show when different driver is selected */}
                {isDifferentDriver && (
                  <>
                  <Label className="text-base font-medium">Driver's Driving License {isDifferentDriver ? "*" : ""}</Label>
                  <div className="flex items-center gap-2">
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? "Uploading..." : currentLicenseImage ? "Change Image" : "Upload Image"}
                    </Button>
                    <span className="text-xs text-gray-500">Max 5MB, JPG/PNG only</span>
                  </div>
                  </>
                )}

                {/* Show message when using renter's license */}
                {!isDifferentDriver && !currentLicenseImage && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">Driver will use the same driving license as the renter.</p>
                  </div>
                )}

                {/* Hidden File Input */}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
