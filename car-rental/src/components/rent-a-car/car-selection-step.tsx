"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Luggage, Fuel, Settings, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { CarVO_Detail } from "@/lib/services/car-api";

interface CarSelectionStepProps {
  car: CarVO_Detail;
}

export function CarSelectionStep({ car }: CarSelectionStepProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carImages = [
    { src: car.carImageFront || "/placeholder.svg?height=400&width=700", alt: `${car.brand} ${car.model} Front`, title: "Front View" },
    { src: car.carImageBack || "/placeholder.svg?height=400&width=700", alt: `${car.brand} ${car.model} Back`, title: "Back View" },
    { src: car.carImageLeft || "/placeholder.svg?height=400&width=700", alt: `${car.brand} ${car.model} Left`, title: "Left View" },
    { src: car.carImageRight || "/placeholder.svg?height=400&width=700", alt: `${car.brand} ${car.model} Right`, title: "Right View" },
  ].filter(image => image.src !== "/placeholder.svg?height=400&width=700"); // Filter out undefined images

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Car Name Header */}
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {car.brand} {car.model}
        </h1>
        <p className="text-lg text-gray-600 mt-2">{car.description || "Premium Vehicle Experience"}</p>
      </div>

      <div>
        {/* Car Specifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Fuel Type</p>
            <p className="font-bold">{car.isGasoline ? "Gasoline" : "Diesel"}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Seats</p>
            <p className="font-bold">{car.numberOfSeats || 4}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Mileage</p>
            <p className="font-bold">{car.mileage ? `${car.mileage} km` : "N/A"}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Year</p>
            <p className="font-bold">{car.productionYear || "N/A"}</p>
          </div>
        </div>

        {/* Car Images Carousel */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={carImages[currentImageIndex]?.src || "/placeholder.svg"}
                  alt={carImages[currentImageIndex]?.alt}
                  className="w-full h-80 lg:h-96 object-cover transition-all duration-300"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {carImages.length}
                </div>
              </div>
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                {carImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 ${
                      index === currentImageIndex
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                    }`}
                  >
                    <img src={image.src} alt={image.alt} className="w-20 h-16 object-cover" />
                    {index === currentImageIndex && <div className="absolute inset-0 bg-indigo-500/20"></div>}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-gray-700">{carImages[currentImageIndex]?.title}</p>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {carImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? "bg-indigo-600" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About this Car */}
        <Card>
          <CardHeader>
            <CardTitle>About this {car.brand} {car.model}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              {car.description || `Experience the ${car.brand} ${car.model}, a vehicle that combines performance and comfort.`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{car.brand || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-medium">{car.isAutomatic ? "Automatic" : "Manual"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-medium">{car.numberOfSeats || 4} Adults</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Luggage className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Luggage</p>
                  <p className="font-medium">{car.numberOfSeats ? `${Math.floor(car.numberOfSeats / 2)} Large Bags` : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Fuel className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="font-medium">{car.isGasoline ? "Gasoline" : "Diesel"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Settings className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mileage</p>
                  <p className="font-medium">{car.mileage ? `${car.mileage} km` : "Unlimited"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Comfort & Convenience</h3>
                <div className="space-y-2">
                  {car.additionalFunction ? (
                    car.additionalFunction.split(",").map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature.trim()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No additional features listed.</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Verification Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className={`h-4 w-4 ${car.insuranceUriIsVerified ? "text-green-500" : "text-gray-500"}`} />
                    <span className="text-sm">Insurance {car.insuranceUriIsVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`h-4 w-4 ${car.registrationPaperUriIsVerified ? "text-green-500" : "text-gray-500"}`} />
                    <span className="text-sm">Registration {car.registrationPaperUriIsVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`h-4 w-4 ${car.certificateOfInspectionUriIsVerified ? "text-green-500" : "text-gray-500"}`} />
                    <span className="text-sm">Inspection {car.certificateOfInspectionUriIsVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}