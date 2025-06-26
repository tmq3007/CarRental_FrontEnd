"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarSelectionStep } from "@/components/rent-a-car/car-selection-step";
import { BookingSummaryStep } from "@/components/rent-a-car/booking-summary-step";
import { CheckoutStep } from "@/components/rent-a-car/checkout-step";
import { ConfirmationStep } from "@/components/rent-a-car/confirmation-step";
import Stepper from "@/components/rent-a-car/stepper";
import { OrderSummary } from "@/components/rent-a-car/order-summary";
import { BookingPanel } from "@/components/rent-a-car/booking-panel";

interface Step {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface Location {
  province?: string;
  district?: string;
  ward?: string;
}

interface BookingState {
  pickupDate?: Date;
  returnDate?: Date;
  pickupLocation: Location;
  dropoffLocation: Location;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Car Selection",
    description: "Choose your perfect vehicle",
    component: <CarSelectionStep />,
  },
  {
    id: 2,
    title: "Booking Summary",
    description: "Enter your details",
    component: <BookingSummaryStep />,
  },
  {
    id: 3,
    title: "Checkout",
    description: "Payment & confirmation",
    component: <CheckoutStep />,
  },
  {
    id: 4,
    title: "Confirmation",
    description: "Booking complete",
    component: <ConfirmationStep />,
  },
];

export default function CarRentalBooking() {
  const searchParams = useSearchParams();

  // Parse query parameters
  const locationProvince = searchParams.get("locationProvince") || "";
  const pickupTime = searchParams.get("pickupTime");
  const dropoffTime = searchParams.get("dropoffTime");

  // Convert query parameter times to Date objects
  const parseQueryDate = (time: string | null): Date | undefined => {
    if (!time) return undefined;
    try {
      const date = new Date(time);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  // Initialize state with query parameters
  const [bookingState, setBookingState] = useState<BookingState>({
    pickupDate: parseQueryDate(pickupTime),
    returnDate: parseQueryDate(dropoffTime),
    pickupLocation: { province: locationProvince, district: "", ward: "" },
    dropoffLocation: { province: locationProvince, district: "", ward: "" },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Handlers for updating booking state
  const handlePickupDateChange = (date: Date | undefined) => {
    setBookingState((prev) => ({ ...prev, pickupDate: date }));
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    setBookingState((prev) => ({ ...prev, returnDate: date }));
  };

  const handlePickupLocationChange = (field: string, value: string) => {
    setBookingState((prev) => {
      const newPickupLocation = { ...prev.pickupLocation, [field]: value };
      // Update dropoffLocation to mirror province and district
      const newDropoffLocation = {
        province: field === "province" ? value : prev.dropoffLocation.province,
        district: field === "district" ? value : field === "province" ? "" : prev.dropoffLocation.district,
        ward: field === "province" || field === "district" ? "" : prev.dropoffLocation.ward,
      };
      return {
        ...prev,
        pickupLocation: newPickupLocation,
        dropoffLocation: newDropoffLocation,
      };
    });
  };

  const handleDropoffLocationChange = (field: string, value: string) => {
    setBookingState((prev) => ({
      ...prev,
      dropoffLocation: { ...prev.dropoffLocation, [field]: value },
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber !== currentStep) {
      setDirection(stepNumber > currentStep ? 1 : -1);
      setCurrentStep(stepNumber);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentStepData = steps.find((step) => step.id === currentStep);
  const showBookingPanel = currentStep === 1;
  const showOrderSummary = currentStep === 2 || currentStep === 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Step Indicator */}
      <Stepper
        steps={steps.map((step) => ({
          id: step.id,
          title: step.title,
          description: step.description,
        }))}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={cn("grid gap-8", showBookingPanel || showOrderSummary ? "lg:grid-cols-10" : "lg:grid-cols-1")}>
          {/* Step Content */}
          <div className={cn("relative overflow-hidden", showBookingPanel || showOrderSummary ? "lg:col-span-6" : "lg:col-span-1")}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {currentStepData?.component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Booking Panel - Show on step 1 */}
          {showBookingPanel && (
            <div className="lg:col-span-4">
              <BookingPanel
                onNextStep={nextStep}
                pickupDate={bookingState.pickupDate}
                returnDate={bookingState.returnDate}
                pickupLocation={bookingState.pickupLocation}
                dropoffLocation={bookingState.dropoffLocation}
                onPickupDateChange={handlePickupDateChange}
                onReturnDateChange={handleReturnDateChange}
                onPickupLocationChange={handlePickupLocationChange}
                onDropoffLocationChange={handleDropoffLocationChange}
              />
            </div>
          )}

          {/* Order Summary - Show on steps 2 and 3 */}
          {showOrderSummary && (
            <div className="lg:col-span-4">
              <OrderSummary
                currentStep={currentStep}
                onNextStep={nextStep}
                // bookingState={bookingState}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons - Only show when Booking Panel or Order Summary is not visible */}
        {!showBookingPanel && !showOrderSummary && (
          <div className="flex justify-between mt-8 max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center bg-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentStep === steps.length ? (
                <Button className="bg-green-600 hover:bg-green-700">Book Another Car</Button>
              ) : (
                <Button onClick={nextStep} className="flex items-center bg-indigo-600 hover:bg-indigo-700">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}