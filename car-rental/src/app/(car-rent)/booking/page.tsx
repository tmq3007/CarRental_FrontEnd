"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { CarSelectionStep } from "@/components/rent-a-car/car-selection-step";
import { BookingSummaryStep } from "@/components/rent-a-car/booking-summary-step";
import { CheckoutStep } from "@/components/rent-a-car/checkout-step";
import { ConfirmationStep } from "@/components/rent-a-car/confirmation-step";
import { BookingPanel } from "@/components/rent-a-car/booking-panel";
import { OrderSummary } from "@/components/rent-a-car/order-summary";
import { Location } from "@/components/common/address-input";
import { RootState } from "@/lib/store";
import Stepper from "@/components/rent-a-car/stepper";
import { useGetBookingCarAndUserQuery } from "@/lib/services/booking-api";

interface Step {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}
export interface BookingState {
  carId?: string;
  driverId?: string;
  pickupDate?: Date;
  returnDate?: Date;
  pickupLocation: Location;
  dropoffLocation: Location;
  rentalDays?: number;
  paymentType?: string;
  deposit?: number;
  driverFullName?: string;
  driverDob?: Date;
  driverEmail?: string;
  driverPhoneNumber?: string;
  driverNationalId?: string;
  driverDrivingLicenseUri?: string;
  driverHouseNumberStreet?: string;
  driverLocation: Location;
}
export default function CarRentalBooking() {
  const searchParams = useSearchParams();
  // const carId = searchParams.get("carId");
  const carId = "DD63B6FF-0559-4084-B392-02EF2AC777C5"; // For testing purposes, replace with actual carId from searchParams

  const locationProvince = searchParams.get("locationProvince") || "";
  const pickupTime = searchParams.get("pickupTime");
  const dropoffTime = searchParams.get("dropoffTime");
  const userId = useSelector((state: RootState) => state.user.id);

  // Fetch booking data
  const { data: bookingResponse, isLoading, error ,isFetching} = useGetBookingCarAndUserQuery(carId ?? "", {
    skip: !carId,
  });

  const car = bookingResponse?.data.car;
  const user = bookingResponse?.data.user;
  console.log(bookingResponse, "bookingResponse");
  console.log(car, "car");
  console.log(user, "user");

  const parseQueryDate = (time: string | null): Date | undefined => {
    if (!time) return undefined;
    try {
      const date = new Date(time);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  const [bookingState, setBookingState] = useState<BookingState>({
    carId: carId ?? undefined,
    driverId: userId ?? undefined,
    pickupDate: parseQueryDate(pickupTime),
    returnDate: parseQueryDate(dropoffTime),
    pickupLocation: { province: locationProvince, district: "", ward: "" },
    dropoffLocation: { province: locationProvince, district: "", ward: "" },
    rentalDays: undefined,
    paymentType: undefined,
    deposit: car?.deposit,
    driverFullName: user?.fullName,
    driverDob: user?.dob ? new Date(user.dob) : undefined,
    driverEmail: user?.email,
    driverPhoneNumber: user?.phoneNumber,
    driverNationalId: user?.nationalId,
    driverDrivingLicenseUri: user?.drivingLicenseUri,
    driverHouseNumberStreet: user?.houseNumberStreet,
    driverLocation: {
      province: user?.cityProvince ?? "",
      district: user?.district ?? "",
      ward: user?.ward ?? "",
    },
  });

  useEffect(() => {
    if (car && user) {
      setBookingState((prev) => ({
        ...prev,
        carId: carId ?? undefined,
        driverId: userId ?? undefined,
        deposit: car.deposit,
        driverFullName: prev.driverFullName || user.fullName,
        driverDob: prev.driverDob || (user.dob ? new Date(user.dob) : undefined),
        driverEmail: prev.driverEmail || user.email,
        driverPhoneNumber: prev.driverPhoneNumber || user.phoneNumber,
        driverNationalId: prev.driverNationalId || user.nationalId,
        driverDrivingLicenseUri: prev.driverDrivingLicenseUri || user.drivingLicenseUri,
        driverHouseNumberStreet: prev.driverHouseNumberStreet || user.houseNumberStreet,
        driverLocation: {
          province: prev.driverLocation.province || user.cityProvince || "",
          district: prev.driverLocation.district || user.district || "",
          ward: prev.driverLocation.ward || user.ward || "",
        },
      }));
    }
  }, [car, user, carId, userId]);

  useEffect(() => {
    if (bookingState.pickupDate && bookingState.returnDate) {
      const diffTime = bookingState.returnDate.getTime() - bookingState.pickupDate.getTime();
      const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setBookingState((prev) => ({ ...prev, rentalDays: rentalDays > 0 ? rentalDays : 1 }));
    }
  }, [bookingState.pickupDate, bookingState.returnDate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const handlePickupDateChange = (date: Date | undefined) => {
    setBookingState((prev) => ({ ...prev, pickupDate: date }));
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    setBookingState((prev) => ({ ...prev, returnDate: date }));
  };

  const handlePickupLocationChange = (field: string, value: string) => {
    setBookingState((prev) => {
      const newPickupLocation = { ...prev.pickupLocation, [field]: value };
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
    if (field === "ward" || field === "street") {
      setBookingState((prev) => ({
        ...prev,
        dropoffLocation: {
          ...prev.dropoffLocation,
          [field]: value,
          province: prev.pickupLocation.province,
          district: prev.pickupLocation.district,
        },
      }));
    }
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

  // Conditionally render steps based on data availability
  const steps: Step[] = [
    {
      id: 1,
      title: "Car Selection",
      description: "Choose your perfect vehicle",
      component: car ? <CarSelectionStep car={car} /> : <div>Loading car details...</div>,
    },
    {
      id: 2,
      title: "Booking Summary",
      description: "Enter your details",
      component: car && user ? (
        <BookingSummaryStep
          bookingState={bookingState}
          setBookingState={setBookingState}
          car={car}
          user={user}
        />
      ) : (
        <div>Loading user and car details...</div>
      ),
    },
    {
      id: 3,
      title: "Checkout",
      description: "Payment & confirmation",
      component: (
        <CheckoutStep
          onUpdatePaymentDetails={(details: { paymentType?: string; deposit?: number }) =>
            setBookingState((prev) => ({ ...prev, ...details }))
          }
          paymentDetails={{ paymentType: bookingState.paymentType, deposit: bookingState.deposit }}
          onNextStep={nextStep}
        />
      ),
    },
    {
      id: 4,
      title: "Confirmation",
      description: "Booking complete",
      component: <ConfirmationStep bookingData={bookingState} />,
    },
  ];

  if ( isLoading || isFetching) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !carId || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Error: Unable to load car or user details. Please try again.
        error: {typeof error === "string"
          ? error
          : error
          ? JSON.stringify(error)
          : "Unknown error"}
        <br />
      </div>
    );
  }

  const currentStepData = steps.find((step) => step.id === currentStep);
  const showBookingPanel = currentStep === 1;
  const showOrderSummary = currentStep === 2 || currentStep === 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper
        steps={steps.map((step) => ({
          id: step.id,
          title: step.title,
          description: step.description,
        }))}
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={cn("grid gap-8", showBookingPanel || showOrderSummary ? "lg:grid-cols-10" : "lg:grid-cols-1")}>
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
          {showBookingPanel && (
            <div className="lg:col-span-4">
              <BookingPanel
                onNextStep={nextStep}
                pickupDate={bookingState.pickupDate}
                returnDate={bookingState.returnDate}
                pickupLocation={bookingState.pickupLocation}
                dropoffLocation={bookingState.dropoffLocation}
                onUpdatePickupDate={handlePickupDateChange}
                onUpdateReturnDate={handleReturnDateChange}
                onUpdatePickupLocation={handlePickupLocationChange}
                onUpdateDropoffLocation={handleDropoffLocationChange}
              />
            </div>
          )}
          {showOrderSummary && (
            <div className="lg:col-span-4">
              <OrderSummary
                currentStep={currentStep}
                onNextStep={nextStep}
                // Pass additional props if neede
                // bookingState={bookingState}
              />
            </div>
          )}
        </div>
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