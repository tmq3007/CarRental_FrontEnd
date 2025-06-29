"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddressInput, { Location } from "../common/address-input";
import { DateTimePicker } from "../common/date-time-picker";

interface BookingPanelProps {
  onNextStep: () => void;
  pickupDate?: Date;
  returnDate?: Date;
  pickupLocation: Location;
  dropoffLocation: Location;
  onUpdatePickupDate: (date: Date | undefined) => void;
  onUpdateReturnDate: (date: Date | undefined) => void;
  onUpdatePickupLocation: (field: string, value: string) => void;
  onUpdateDropoffLocation: (field: string, value: string) => void;
}

export function BookingPanel({
  onNextStep,
  pickupDate,
  returnDate,
  pickupLocation,
  dropoffLocation,
  onUpdatePickupDate,
  onUpdateReturnDate,
  onUpdatePickupLocation,
  onUpdateDropoffLocation,
}: BookingPanelProps) {
  const [errors, setErrors] = useState<{
    pickupDate?: string;
    returnDate?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
  }>({});

  const calculateTotal = () => {
    let total = 897; // Base rate for 3 days
    if (pickupDate && returnDate) {
      const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
      total = days * 299; // Example: $299 per day
    }
    total += 98; // Taxes & Fees
    return total;
  };

  const calculateRentalDays = () => {
    if (pickupDate && returnDate) {
      return Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 3; // Default to 3 days if dates are not set
  };

  const validateForm = () => {
    const newErrors: {
      pickupDate?: string;
      returnDate?: string;
      pickupLocation?: string;
      dropoffLocation?: string;
    } = {};

    if (!pickupDate) {
      newErrors.pickupDate = "Please select a pick-up date and time.";
    }
    if (!returnDate) {
      newErrors.returnDate = "Please select a return date and time.";
    }
    if (pickupDate && returnDate && pickupDate >= returnDate) {
      newErrors.returnDate = "Return date must be after pick-up date.";
    }
    if (!pickupLocation.province) {
      newErrors.pickupLocation = "Please select a valid pick-up location.";
    }
    if (!dropoffLocation.province) {
      newErrors.dropoffLocation = "Please select a valid drop-off location.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateForm()) {
      return;
    }

    // Format locations for CreateBookingDTO
    const formattedPickupLocation = `${pickupLocation.ward || ""}, ${pickupLocation.district || ""}, ${pickupLocation.province || ""}`.trim();
    const formattedDropoffLocation = `${dropoffLocation.ward || ""}, ${pickupLocation.district || ""}, ${pickupLocation.province || ""}`.trim();

    onNextStep();
  };

  return (
    <Card className="sticky top-16">
      <CardHeader>
        <CardTitle>Book Your Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pickup Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="pickupDate">Pick-up Date</Label>
          <DateTimePicker
            value={pickupDate}
            onChange={(date) => {
              onUpdatePickupDate(date);
              setErrors((prev) => ({ ...prev, pickupDate: undefined }));
            }}
            placeholder="Select pick-up date & time"
          />
          {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate}</p>}
        </div>

        {/* Return Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="returnDate">Return Date</Label>
          <DateTimePicker
            value={returnDate}
            onChange={(date) => {
              onUpdateReturnDate(date);
              setErrors((prev) => ({ ...prev, returnDate: undefined }));
            }}
            placeholder="Select return date & time"
          />
          {errors.returnDate && <p className="text-red-500 text-sm">{errors.returnDate}</p>}
        </div>

        {/* Pickup Location Selection */}
        <div className="space-y-2">
          <Label htmlFor="pickupLocation">Pick-up Location</Label>
          <AddressInput
            location={pickupLocation}
            onLocationChange={onUpdatePickupLocation}
            orientation="horizontal"
            spacing="md"
          />
          {errors.pickupLocation && <p className="text-red-500 text-sm">{errors.pickupLocation}</p>}
        </div>

        {/* Drop-off Location Selection */}
        <div className="space-y-2">
          <Label htmlFor="dropoffLocation">Drop-off Location</Label>
          <AddressInput
            location={{ ...dropoffLocation, province: pickupLocation.province, district: pickupLocation.district }}
            onLocationChange={onUpdateDropoffLocation}
            orientation="horizontal"
            spacing="md"
            disabledFields={["province", "district"]}
          />
          {errors.dropoffLocation && <p className="text-red-500 text-sm">{errors.dropoffLocation}</p>}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base Rate ({calculateRentalDays()} days)</span>
            <span>${(calculateRentalDays() * 299).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span>$98</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${calculateTotal().toLocaleString()}</span>
        </div>

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 h-12"
          onClick={handleNextStep}
          disabled={!pickupDate || !returnDate || !pickupLocation.province || !dropoffLocation.province}
        >
          Book Now →
        </Button>

        <p className="text-xs text-gray-600 text-center">Free cancellation up to 24 hours before pickup</p>
      </CardContent>
    </Card>
  );
}