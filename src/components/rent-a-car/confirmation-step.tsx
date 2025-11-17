"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Phone, Mail, MessageCircle, Calendar, Users, Settings, Luggage, Sparkles, Package, Navigation } from "lucide-react";
import SpotlightCard from "@/blocks/Components/SpotlightCard/SpotlightCard";
import { BookingVO } from "@/lib/services/booking-api";
import { formatCurrency } from "@/lib/hook/useFormatCurrency";
import { BookingStatusBadge } from "../car-owner/booking/status-badge";
import Confetti from "react-confetti";

interface ConfirmationStepProps {
  bookingData: BookingVO;
}

export function ConfirmationStep({ bookingData }: ConfirmationStepProps) {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const timer = window.setTimeout(() => setShowConfetti(false), 20000);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.clearTimeout(timer);
    };
  }, []);

  const calculateTotal = () => {
    // Assuming basePrice is per day and rentalDays is derived from pickupDate and returnDate
    const pickup = new Date(bookingData.pickupDate);
    const dropoff = new Date(bookingData.returnDate);
    const diffTime = dropoff.getTime() - pickup.getTime();
    const rentalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    let total = rentalDays * bookingData.basePrice;
    return total;
  };

  return (
    <>
      {showConfetti && windowSize.width > 0 && windowSize.height > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={350}
          recycle={false}
          style={{ pointerEvents: "none", position: "fixed", top: 0, left: 0 }}
        />
      )}

      <div className="mx-auto px-4 sm:px-6 max-w-7xl">
      <div className="space-y-4 lg:space-y-6">
        {/* Success Message */}
        <Card>
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(76, 187, 23, 0.2)">
            <div className="text-center py-4 lg:py-8">
              <div className="mx-auto w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 lg:mb-4">
                <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-sm lg:text-base text-gray-600">
                Your {bookingData.carName} rental has been successfully booked.
              </p>
            </div>
          </SpotlightCard>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <BookingStatusBadge status={bookingData.status} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div>
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="font-mono text-base lg:text-lg font-semibold text-indigo-600">
                  {bookingData.bookingNumber}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-xl lg:text-2xl font-bold">{formatCurrency(calculateTotal())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rental */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rental</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
              <img
                src="/placeholder.svg?height=120&width=160"
                alt={bookingData.carName}
                className="h-24 w-32 sm:h-30 sm:w-40 rounded-lg object-cover bg-gray-200 mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg lg:text-xl font-semibold mb-2">{bookingData.carName}</h3>
                <div className="flex justify-center sm:justify-start items-center space-x-2 mb-3">
                  <Badge className="bg-purple-100 text-purple-700 text-xs">Luxury Sedan</Badge>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 lg:gap-6 text-xs lg:text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>4 Adults</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>Automatic</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Luggage className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>3 Large Bags</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup & Return Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup & Return Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600">Pickup Location</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{bookingData.pickUpLocation}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>
                      {new Date(bookingData.pickupDate).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600">Return Location</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{bookingData.dropOffLocation}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span>
                      {new Date(bookingData.returnDate).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• Please arrive 15 minutes before your pickup time</li>
              <li>• Bring your driver's license and credit card used for booking</li>
              <li>• The fuel tank should be returned at the same level as pickup</li>
              <li>• Late return charges apply after 30 minutes grace period</li>
            </ul>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4">
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 lg:h-12 flex items-center justify-center space-x-2 text-sm lg:text-base"
              onClick={() => router.push("/")} // Redirect to homepage or another page
            >
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Book Another Car</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 lg:h-12 flex items-center justify-center space-x-2 text-sm lg:text-base"
              onClick={() => window.print()}
            >
              <Mail className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Print Confirmation</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 lg:h-12 flex items-center justify-center space-x-2 text-sm lg:text-base"
              onClick={() => alert("Email confirmation sent!")} // Replace with actual email logic
            >
              <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Email Confirmation</span>
            </Button>
            <Separator className="my-4 lg:my-6" />
            <div className="space-y-2 lg:space-y-3">
              <h3 className="font-semibold text-sm lg:text-base">Need Help?</h3>
              <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-600" />
                  <span>support@mycarrental.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-600" />
                  <span>Live Chat Support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhance Your Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Enhance Your Experience</CardTitle>
            <p className="text-sm text-gray-600">Additional services to make your trip even better</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-3 lg:p-4 border rounded-lg">
                <Navigation className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 mx-auto mb-2 lg:mb-3" />
                <h3 className="font-semibold mb-1 lg:mb-2 text-sm lg:text-base">GPS Navigation</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">
                  Add premium GPS with real-time traffic updates and points of interest
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs lg:text-sm">
                  Add for $15/day
                </Button>
              </div>
              <div className="text-center p-3 lg:p-4 border rounded-lg">
                <Package className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 mx-auto mb-2 lg:mb-3" />
                <h3 className="font-semibold mb-1 lg:mb-2 text-sm lg:text-base">Luggage Delivery</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">
                  Have your luggage delivered directly to your hotel or destination
                </p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm">
                  Book Service
                </Button>
              </div>
              <div className="text-center p-3 lg:p-4 border rounded-lg">
                <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 mx-auto mb-2 lg:mb-3" />
                <h3 className="font-semibold mb-1 lg:mb-2 text-sm lg:text-base">Car Cleaning</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">
                  Professional car cleaning service before your pickup
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs lg:text-sm">
                  Add for $25
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}