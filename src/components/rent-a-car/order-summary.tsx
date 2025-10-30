"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Shield, Check, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookingVO, CreateBookingDTO, useCreateBookingMutation } from "@/lib/services/booking-api";
import type { BookingState } from "@/app/(car-rent)/booking/page";
import { CarVO_Detail } from "@/lib/services/car-api";
import { formatCurrency } from "@/lib/hook/useFormatCurrency";

interface OrderSummaryProps {
  car?: CarVO_Detail;
  currentStep: number;
  bookingState: BookingState;
  onNextStep: (bookingVO?: BookingVO) => void;
  validateForm?: () => boolean;
  validationErrors?: { paymentType?: string; deposit?: string; terms?: string };
}

export function OrderSummary({ car, currentStep, bookingState, onNextStep, validateForm, validationErrors }: OrderSummaryProps) {
  const router = useRouter();
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [submitError, setSubmitError] = useState<string>();

  const handleClick = async () => {
    if (currentStep === 3) {
      // Validate form before creating booking
      if (!validateForm || !validateForm()) {
        setSubmitError("Please fix the errors in the checkout form.");
        return;
      }

      try {
        const bookingData: CreateBookingDTO = {
          ...bookingState,
          pickupDate: bookingState.pickupDate ? bookingState.pickupDate.toISOString() : "",
          dropoffDate: bookingState.returnDate ? bookingState.returnDate.toISOString() : "",
          paymentType: bookingState.paymentType ?? "cash",
          deposit: bookingState.deposit ?? 0,
          driverDob: bookingState.driverDob
            ? bookingState.driverDob instanceof Date
              ? bookingState.driverDob.toISOString()
              : bookingState.driverDob
            : null,
        };
        const response = await createBooking(bookingData).unwrap();
        onNextStep(response.data); // Pass the BookingVO response to the next step
      } catch {
        setSubmitError("Failed to confirm booking. Please try again.");
      }
    } else {
      onNextStep();
    }
  };

  return (
    <div className="sticky top-16">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Car Image and Details */}
          <div className="flex items-center space-x-3">
            <img
              src={`${car?.carImageFront}`}
              alt={`${car?.brand} ${car?.model}`}
              className="h-15 w-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">{car?.brand} {car?.model} {car?.productionYear}</h3>
              <p className="text-sm text-gray-600">{car?.licensePlate}</p>
            </div>
          </div>

          <Separator />

          {/* Rental Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pick-up</span>
              <span>{bookingState.pickupDate?.toLocaleDateString() || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Drop-off</span>
              <span>{bookingState.returnDate?.toLocaleDateString() || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span>{bookingState.rentalDays ? `${bookingState.rentalDays} days` : "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Location</span>
              <span>{bookingState.pickupLocation?.ward + " - " + bookingState.pickupLocation?.district + " - " + bookingState.pickupLocation?.province || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Drop-off Location</span>
              <span>{bookingState.dropoffLocation?.ward + " - " + bookingState.dropoffLocation?.district + " - " + bookingState.dropoffLocation?.province || "Not set"}</span>
            </div>
          </div>
          <Separator />

          {/* Pricing */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Car Rental ({bookingState.rentalDays || 0} days)</span>
              <span>{formatCurrency((bookingState.rentalDays || 0) * (car?.basePrice || 0))}</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance Coverage</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Driver</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>{formatCurrency(0)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency((bookingState.rentalDays || 0) * (car?.basePrice || 0))}</span>
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input placeholder="Promotion Code" className="flex-1" />
              <Button variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Apply
              </Button>
            </div>
          </div>

          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          {validationErrors && Object.values(validationErrors).some((error) => error) && (
            <div className="text-red-500 text-sm">
              <p>Please fix the following errors:</p>
              <ul className="list-disc pl-4">
                {validationErrors.paymentType && <li>{validationErrors.paymentType}</li>}
                {validationErrors.deposit && <li>{validationErrors.deposit}</li>}
                {validationErrors.terms && <li>{validationErrors.terms}</li>}
              </ul>
            </div>
          )}

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleClick}
            disabled={isLoading}
          >
            {currentStep === 2 ? "Proceed to Payment" : "Confirm Booking"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          {/* Security Features */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Free cancellation up to 24 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span>Secure payment processing</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-orange-50 p-3">
            <Shield className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-orange-700">Your payment is secured with 256-bit SSL encryption</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}