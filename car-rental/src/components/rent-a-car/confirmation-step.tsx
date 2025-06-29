"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Phone, Mail, MessageCircle, Calendar, Users, Settings, Luggage, Sparkles, Package, Navigation } from "lucide-react";
import SpotlightCard from "@/blocks/Components/SpotlightCard/SpotlightCard";
import { BookingState } from "@/app/(car-rent)/booking/page";


interface ConfirmationStepProps {
  bookingData: BookingState;
}

export function ConfirmationStep({ bookingData }: ConfirmationStepProps) {
  const router = useRouter();

  const pickupLocation = `${bookingData.pickupLocation.ward || ""}, ${bookingData.pickupLocation.district || ""}, ${bookingData.pickupLocation.province || ""}`.trim();
  const dropoffLocation = `${bookingData.dropoffLocation.ward || ""}, ${bookingData.dropoffLocation.district || ""}, ${bookingData.dropoffLocation.province || ""}`.trim();

  const calculateTotal = () => {
    let total = (bookingData.rentalDays || 3) * 299; // Example: $299 per day
    total += 98; // Taxes & Fees
    return total;
  };

  const handleConfirmBooking = async () => {
    const bookingDTO = {
      carId: bookingData.carId || "00000000-0000-0000-0000-000000000000",
      driverId: bookingData.driverId || "00000000-0000-0000-0000-000000000000",
      pickupTime: bookingData.pickupDate?.toISOString() || "",
      dropoffTime: bookingData.returnDate?.toISOString() || "",
      pickupLocation,
      dropOffLocation: dropoffLocation,
      rentalDays: bookingData.rentalDays || 1,
      driverFullName: bookingData.driverFullName,
      driverDob: bookingData.driverDob ? new Date(bookingData.driverDob).toISOString().split("T")[0] : undefined,
      driverEmail: bookingData.driverEmail,
      driverPhoneNumber: bookingData.driverPhoneNumber,
      driverNationalId: bookingData.driverNationalId,
      driverDrivingLicenseUri: bookingData.driverDrivingLicenseUri,
      driverHouseNumberStreet: bookingData.driverHouseNumberStreet,
      driverWard: bookingData.driverLocation.ward,
      driverDistrict: bookingData.driverLocation.district,
      driverCityProvince: bookingData.driverLocation.province,
      paymentType: bookingData.paymentType || "",
      deposit: bookingData.deposit || 0,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDTO),
      });
      if (response.ok) {
        alert("Booking confirmed!");
        router.push("/"); // Redirect to homepage or bookings page
      } else {
        const errorData = await response.json();
        alert(`Failed to create booking: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("An error occurred while submitting the booking.");
    }
  };

  return (
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
                Your {bookingData.carId ? "car rental" : "Mercedes S-Class rental"} has been successfully booked.
              </p>
            </div>
          </SpotlightCard>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Confirmed
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div>
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="font-mono text-base lg:text-lg font-semibold text-indigo-600">
                  MCR-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0")}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-xl lg:text-2xl font-bold">${calculateTotal().toLocaleString()}</p>
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
                alt="Car"
                className="h-24 w-32 sm:h-30 sm:w-40 rounded-lg object-cover bg-gray-200 mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg lg:text-xl font-semibold mb-2">{bookingData.carId || "Mercedes S-Class"}</h3>
                <div className="flex justify-center sm:justify-start items-center space-x-2 mb-3">
                  <Badge className="bg-purple-100 text-purple-700 text-xs">Luxury Sedan</Badge>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 lg:gap-6 text-xs lg:text-sm text-gray-600">
                  <div className="flex items-center space-x-1 карт">
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
                <h3 className="font-semibold text-indigo-600">Pickup Location</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{pickupLocation || "MyCarRental Manhattan"}</p>
                    <p className="text-sm text-gray-600">{bookingData.driverHouseNumberStreet || "123 Broadway Street"}</p>
                    <p className="text-sm text-gray-600">{bookingData.driverLocation.province || "New York, NY 10001"}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{bookingData.driverPhoneNumber || "+1 (555) 123-4567"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>
                      {bookingData.pickupDate
                        ? bookingData.pickupDate.toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                        : "March 15, 2024 at 10:00 AM"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600">Return Location</h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{dropoffLocation || "MyCarRental Manhattan"}</p>
                    <p className="text-sm text-gray-600">{bookingData.driverHouseNumberStreet || "123 Broadway Street"}</p>
                    <p className="text-sm text-gray-600">{bookingData.driverLocation.district || "New York, NY 10001"}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{bookingData.driverPhoneNumber || "+1 (555) 123-4567"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span>
                      {bookingData.returnDate
                        ? bookingData.returnDate.toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                        : "March 18, 2024 at 10:00 AM"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <h3 className="font-semibold mb-3">Primary Driver</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {bookingData.driverFullName || "John Doe"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {bookingData.driverEmail || "john.doe@email.com"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {bookingData.driverPhoneNumber || "+1 (555) 987-6543"}
                  </p>
                  <p>
                    <span className="font-medium">License:</span> {bookingData.driverNationalId || "NY12345789"}
                  </p>
                </div>
              </div>
              {/* Optional: Add logic for additional driver if supported by backend */}
              {bookingData.driverFullName && (
                <div>
                  <h3 className="font-semibold mb-3">Additional Driver</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> None
                    </p>
                  </div>
                </div>
              )}
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
              onClick={handleConfirmBooking}
            >
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Confirm Booking</span>
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
            <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1 lg:mb-2 text-sm lg:text-base">Confirmation Sent</h4>
              <p className="text-xs lg:text-sm text-green-700">
                A confirmation email has been sent to {bookingData.driverEmail || "john.doe@email.com"} with all the details
              </p>
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
  );
}