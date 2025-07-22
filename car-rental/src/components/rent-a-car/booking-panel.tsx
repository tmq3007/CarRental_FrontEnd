"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddressInput from "../common/address-input";
import { DateTimePicker } from "../common/date-time-picker";

interface Location {
  province?: string;
  district?: string;
  ward?: string;
}

interface BookingPanelProps {
  onNextStep: () => void;
  pickupDate?: Date;
  returnDate?: Date;
  pickupLocation: Location;
  dropoffLocation: Location;
  onPickupDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  onPickupLocationChange: (field: string, value: string) => void;
  onDropoffLocationChange: (field: string, value: string) => void;
}

export function BookingPanel({
  onNextStep,
  pickupDate,
  returnDate,
  pickupLocation,
  dropoffLocation,
  onPickupDateChange,
  onReturnDateChange,
  onPickupLocationChange,
  onDropoffLocationChange,
}: BookingPanelProps) {
  const calculateTotal = () => {
    let total = 897; // Base rate for 3 days
    if (pickupDate && returnDate) {
      const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
      total = days * 299; // Example: $299 per day
    }
    total += 98; // Taxes & Fees
    return total;
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
            onChange={onPickupDateChange}
            placeholder="Select pick-up date & time"
          />
        </div>

        {/* Return Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="returnDate">Return Date</Label>
          <DateTimePicker
            value={returnDate}
            onChange={onReturnDateChange}
            placeholder="Select return date & time"
          />
        </div>

        {/* Pickup Location Selection */}
        <div className="space-y-2">
          <Label htmlFor="pickupLocation">Pick-up Location</Label>
          <AddressInput
            location={pickupLocation}
            onLocationChange={onPickupLocationChange}
            orientation="horizontal"
            spacing="md"
          />
        </div>

        {/* Drop-off Location Selection */}
        <div className="space-y-2">
          <Label htmlFor="dropoffLocation">Drop-off Location</Label>
          <AddressInput
            location={dropoffLocation}
            onLocationChange={onDropoffLocationChange}
            orientation="horizontal"
            spacing="md"
          />
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base Rate ({pickupDate && returnDate ? Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) : 3} days)</span>
            <span>${pickupDate && returnDate ? (Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) * 299).toLocaleString() : "897"}</span>
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
          onClick={onNextStep}
          disabled={!pickupDate || !returnDate || !pickupLocation.province || !dropoffLocation.province}
        >
          Book Now →
        </Button>

        <p className="text-xs text-gray-600 text-center">Free cancellation up to 24 hours before pickup</p>
      </CardContent>
    </Card>
  );
}