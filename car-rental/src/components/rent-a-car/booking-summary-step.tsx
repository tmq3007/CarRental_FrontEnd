"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Users, Luggage, Settings, Edit } from "lucide-react"

export function BookingSummaryStep() {
  const [isDifferentDriver, setIsDifferentDriver] = useState(false)

  return (
    <div className="space-y-6">
      {/* Compact Horizontal Car Summary - matches first image */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 overflow-hidden">
            {/* Car Image */}
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg?height=80&width=120"
                alt="Mercedes S-Class"
                className="h-20 w-30 rounded-lg object-cover bg-gray-200 flex-shrink-0"
              />
            </div>

            {/* Car Details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1">Mercedes S-Class</h2>
              <div className="flex items-center space-x-2 mb-1">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Luxury Sedan</Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Available</Badge>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-600 mb-1">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>4 Adults</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Settings className="h-3 w-3" />
                  <span>Automatic</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Luggage className="h-3 w-3" />
                  <span>3 Large Bags</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-600">(48 Reviews)</span>
              </div>
            </div>

            {/* Rental Details - Right side */}
            <div className="flex-shrink-0 text-right">
              <div className="grid grid-cols-3 gap-4 text-xs mb-2">
                <div>
                  <p className="text-gray-600 font-medium">Pick-up</p>
                  <p className="font-semibold">Mar 15, 2024</p>
                  <p className="text-gray-500">New York City</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Drop-off</p>
                  <p className="font-semibold">Mar 18, 2024</p>
                  <p className="text-gray-500">New York City</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Duration</p>
                  <p className="font-semibold">3 Days</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* Selected Services */}
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Insurance Coverage - $87</span>
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
              <Input id="renterFullName" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterDob">Date of Birth *</Label>
              <Input id="renterDob" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterPhone">Phone Number *</Label>
              <Input id="renterPhone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterEmail">Email Address *</Label>
              <Input id="renterEmail" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterNationalId">National ID No. *</Label>
              <Input id="renterNationalId" placeholder="Enter national ID number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterLicense">Driving License *</Label>
              <Input id="renterLicense" placeholder="Enter driving license number" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="renterAddress">Address *</Label>
              <Input id="renterAddress" placeholder="Enter full address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterCity">City *</Label>
              <Input id="renterCity" placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterState">State/Province *</Label>
              <Input id="renterState" placeholder="Enter state or province" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renterZip">ZIP Code *</Label>
              <Input id="renterZip" placeholder="Enter ZIP code" />
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
            {/* Checkbox to toggle driver form */}
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

            {/* Conditional Driver Form */}
            {isDifferentDriver && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="driverFullName">Full Name *</Label>
                  <Input id="driverFullName" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverDob">Date of Birth *</Label>
                  <Input id="driverDob" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverPhone">Phone Number *</Label>
                  <Input id="driverPhone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverEmail">Email Address *</Label>
                  <Input id="driverEmail" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverNationalId">National ID No. *</Label>
                  <Input id="driverNationalId" placeholder="Enter national ID number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverLicense">Driving License *</Label>
                  <Input id="driverLicense" placeholder="Enter driving license number" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="driverAddress">Address *</Label>
                  <Input id="driverAddress" placeholder="Enter full address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverCity">City *</Label>
                  <Input id="driverCity" placeholder="Enter city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverState">State/Province *</Label>
                  <Input id="driverState" placeholder="Enter state or province" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverZip">ZIP Code *</Label>
                  <Input id="driverZip" placeholder="Enter ZIP code" />
                </div>
              </div>
            )}

            {/* Message when driver is same as renter */}
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
  )
}
