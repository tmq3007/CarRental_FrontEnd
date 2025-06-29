"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Users, Luggage, Settings, Edit } from "lucide-react";
import AddressInput from "@/components/common/address-input";
import { Location } from "@/components/common/address-input";
import { CarVO_Detail } from "@/lib/services/car-api";
import { UserProfile } from "@/lib/services/user-api";
import { BookingState } from "@/app/(car-rent)/booking/page";

interface BookingSummaryStepProps {
  bookingState: BookingState;
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>;
  car: CarVO_Detail;
  user: UserProfile;
}

export function BookingSummaryStep({ bookingState, setBookingState, car, user }: BookingSummaryStepProps) {
  const [isDifferentDriver, setIsDifferentDriver] = useState(false);

  const handleInputChange = (field: keyof BookingState, value: string | Date) => {
    setBookingState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof BookingState, addressField: string, value: string) => {
    setBookingState((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as Location),
        [addressField]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Compact Horizontal Car Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 overflow-hidden">
            <div className="flex-shrink-0">
              <img
                src={car.carImageFront || "/placeholder.svg?height=80&width=120"}
                alt={`${car.brand} ${car.model}`}
                className="h-20 w-30 rounded-lg object-cover bg-gray-200 flex-shrink-0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1">{car.brand} {car.model}</h2>
              <div className="flex items-center space-x-2 mb-1">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">{car.brand || "Car"}</Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{car.status}</Badge>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-600 mb-1">
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
            <div className="flex-shrink-0 text-right">
              <div className="grid grid-cols-3 gap-4 text-xs mb-2">
                <div>
                  <p className="text-gray-600 font-medium">Pick-up</p>
                  <p className="font-semibold">{bookingState.pickupDate?.toLocaleDateString() || "Not set"}</p>
                  <p className="text-gray-500">{bookingState.pickupLocation.province || "Not set"}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Drop-off</p>
                  <p className="font-semibold">{bookingState.returnDate?.toLocaleDateString() || "Not set"}</p>
                  <p className="text-gray-500">{bookingState.dropoffLocation.province || "Not set"}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Duration</p>
                  <p className="font-semibold">{bookingState.rentalDays || 0} Days</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
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
                placeholder="Enter full name"
                value={bookingState.driverFullName || user.fullName || ""}
                onChange={(e) => handleInputChange("driverFullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterDob">Date of Birth *</Label>
              <Input
                id="renterDob"
                type="date"
                value={bookingState.driverDob ? bookingState.driverDob.toISOString().split("T")[0] : user.dob || ""}
                onChange={(e) => handleInputChange("driverDob", new Date(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterPhone">Phone Number *</Label>
              <Input
                id="renterPhone"
                placeholder="Enter phone number"
                value={bookingState.driverPhoneNumber || user.phoneNumber || ""}
                onChange={(e) => handleInputChange("driverPhoneNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterEmail">Email Address *</Label>
              <Input
                id="renterEmail"
                type="email"
                placeholder="Enter email address"
                value={bookingState.driverEmail || user.email || ""}
                onChange={(e) => handleInputChange("driverEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterNationalId">National ID No. *</Label>
              <Input
                id="renterNationalId"
                placeholder="Enter national ID number"
                value={bookingState.driverNationalId || user.nationalId || ""}
                onChange={(e) => handleInputChange("driverNationalId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterLicense">Driving License *</Label>
              <Input
                id="renterLicense"
                placeholder="Enter driving license number"
                value={bookingState.driverDrivingLicenseUri || user.drivingLicenseUri || ""}
                onChange={(e) => handleInputChange("driverDrivingLicenseUri", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="renterAddress">Address *</Label>
              <AddressInput
                location={{
                  province: bookingState.driverLocation.province || user.cityProvince || "",
                  district: bookingState.driverLocation.district || user.district || "",
                  ward: bookingState.driverLocation.ward || user.ward || "",
                }}
                onLocationChange={(field, value) => handleAddressChange("driverLocation", field, value)}
                orientation="horizontal"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="driverAddress">Street Address *</Label>
              <Input
                id="driverAddress"
                placeholder="Enter full address"
                value={bookingState.driverHouseNumberStreet || user.houseNumberStreet || ""}
                onChange={(e) => handleInputChange("driverHouseNumberStreet", e.target.value)}
              />
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
                onCheckedChange={(checked) => setIsDifferentDriver(checked as boolean)}
              />
              <Label htmlFor="differentDriver" className="text-sm font-medium cursor-pointer">
                Different from Renter's information
              </Label>
            </div>
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
                <div className="space-y-2">
                  <Label htmlFor="driverLicense">Driving License *</Label>
                  <Input
                    id="driverLicense"
                    placeholder="Enter driving license number"
                    value={bookingState.driverDrivingLicenseUri || ""}
                    onChange={(e) => handleInputChange("driverDrivingLicenseUri", e.target.value)}
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
                  <Label htmlFor="driverAddress">Street Address *</Label>
                  <Input
                    id="driverAddress"
                    placeholder="Enter full address"
                    value={bookingState.driverHouseNumberStreet || ""}
                    onChange={(e) => handleInputChange("driverHouseNumberStreet", e.target.value)}
                  />
                </div>
              </div>
            )}
            {!isDifferentDriver && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  The driver information will be the same as the renter's information above.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}