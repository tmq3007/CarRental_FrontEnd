"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddressInput, { Location } from "../common/address-input";
import { DateTimePicker } from "../common/date-time-picker";
import { CarVO_Detail } from "@/lib/services/car-api";
import { isWithinInterval, isSameDay, addDays, format } from "date-fns";
import { formatCurrency } from "@/lib/hook/useFormatCurrency";

export interface OccupiedDateRange {
  start: Date;
  end: Date;
}

interface BookingPanelProps {
  car?: CarVO_Detail;
  onNextStep: () => void;
  pickupDate?: Date;
  returnDate?: Date;
  pickupLocation: Location;
  dropoffLocation: Location;
  onUpdatePickupDate: (date: Date | undefined) => void;
  onUpdateReturnDate: (date: Date | undefined) => void;
  onUpdatePickupLocation: (field: string, value: string) => void;
  onUpdateDropoffLocation: (field: string, value: string) => void;
  occupiedDates?: OccupiedDateRange[];
}

export function BookingPanel({
  car,
  onNextStep,
  pickupDate,
  returnDate,
  pickupLocation,
  dropoffLocation,
  onUpdatePickupDate,
  onUpdateReturnDate,
  onUpdatePickupLocation,
  onUpdateDropoffLocation,
  occupiedDates: rawOccupiedDates = [],
}: BookingPanelProps) {
  const [errors, setErrors] = useState<{
    pickupDate?: string;
    returnDate?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
  }>({});
  const [maxReturnDate, setMaxReturnDate] = useState<Date | undefined>(undefined);
  const occupiedDates = useMemo<OccupiedDateRange[]>(() => {
    return rawOccupiedDates.map(range => ({
      start: new Date(range.start),
      end: new Date(range.end),
    }));
  }, [rawOccupiedDates]);

  useEffect(() => {
    // Recalculate maxReturnDate whenever pickupDate or occupiedDates changes
    const nearestOccupied = getNearestOccupiedDate();
    setMaxReturnDate(nearestOccupied ? addDays(nearestOccupied, -1) : undefined); // Allow selection up to the day before the nearest occupied date
  }, [pickupDate, occupiedDates]);

  const calculateTotal = () => {
    let total = 0;
    if (pickupDate && returnDate) {
      const days = calculateRentalDays();
      total = days * (car?.basePrice ?? 99999999999999);
    }
    return total;
  };

  const calculateRentalDays = () => {
    if (pickupDate && returnDate) {
      const diffTime = returnDate.getTime() - pickupDate.getTime();
      return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  const getNearestOccupiedDate = () => {
    if (!pickupDate || !occupiedDates || occupiedDates.length === 0) return undefined;
    const sortedRanges = occupiedDates
      .filter((range) => range.start > pickupDate)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    return sortedRanges.length > 0 ? sortedRanges[0].start : undefined;
  };

  const isRangeOccupied = (start: Date, end: Date) => {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (
        occupiedDates.some(
          (range) =>
            isWithinInterval(d, { start: range.start, end: range.end }) ||
            isSameDay(d, range.start) ||
            isSameDay(d, range.end)
        )
      ) {
        return true;
      }
    }
    return false;
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
    if (pickupDate && returnDate) {
      if (pickupDate > returnDate) {
        newErrors.returnDate = "Return date must be after pick-up date.";
      }
      if (isRangeOccupied(pickupDate, returnDate)) {
        newErrors.returnDate = "Selected date range includes occupied dates. Please choose a continuous available period.";
      }
      if (maxReturnDate && returnDate > addDays(maxReturnDate, 1)) {
        newErrors.returnDate = `Return date cannot be after ${format(maxReturnDate, "MM/dd/yyyy")} due to an existing booking.`;
      }
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
    onNextStep();
  };

  return (
    <Card className="sticky top-16">
      <CardHeader>
        <CardTitle>Book Your Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pickupDate">Pick-up Date</Label>
          <DateTimePicker
            value={pickupDate}
            onChange={(date) => {
              onUpdatePickupDate(date);
              setErrors((prev) => ({ ...prev, pickupDate: undefined, returnDate: undefined }));
            }}
            placeholder="Select pick-up date & time"
            occupiedDates={occupiedDates}
            minDate={new Date()}
          />
          {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="returnDate">Return Date</Label>
          <DateTimePicker
            value={returnDate}
            onChange={(date) => {
              onUpdateReturnDate(date);
              setErrors((prev) => ({ ...prev, returnDate: undefined }));
            }}
            placeholder="Select return date & time"
            occupiedDates={occupiedDates}
            minDate={pickupDate ? pickupDate : undefined}
            maxDate={maxReturnDate} // Use state-managed maxReturnDate
          />
          {errors.returnDate && <p className="text-red-500 text-sm">{errors.returnDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupLocation">Pick-up Location</Label>
          <AddressInput
            location={pickupLocation}
            onLocationChange={onUpdatePickupLocation}
            orientation="horizontal"
            spacing="md"
            disabledFields={["province"]}
          />
          {errors.pickupLocation && <p className="text-red-500 text-sm">{errors.pickupLocation}</p>}
        </div>

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

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base Rate ({calculateRentalDays()} days)</span>
            <span>{formatCurrency(calculateRentalDays() * (car?.basePrice ?? 99999999999999))}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 h-12"
          onClick={handleNextStep}
          disabled={!pickupDate || !returnDate || !pickupLocation.province || !dropoffLocation.province}
        >
          Continue →
        </Button>

        <p className="text-xs text-gray-600 text-center">Free cancellation up to 24 hours before pickup</p>
      </CardContent>
    </Card>
  );
}