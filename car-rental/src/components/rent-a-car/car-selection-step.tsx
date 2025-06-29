"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, Luggage, Fuel, Settings, Check, ChevronLeft, ChevronRight } from "lucide-react";

export function CarSelectionStep() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carImages = [
    {
      src: "/placeholder.svg?height=400&width=700",
      alt: "Mercedes S-Class Main View",
      title: "Exterior View",
    },
    {
      src: "/placeholder.svg?height=400&width=700",
      alt: "Mercedes S-Class Interior",
      title: "Interior View",
    },
    {
      src: "/placeholder.svg?height=400&width=700",
      alt: "Mercedes S-Class Detail",
      title: "Detail View",
    },
    {
      src: "/placeholder.svg?height=400&width=700",
      alt: "Mercedes S-Class Side View",
      title: "Side View",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

  const calculateTotal = () => {
    let total = 897; // Base rate for 3 days
    total += 98; // Taxes & Fees
    return total;
  };

  function nextStep(): void {
    // For now, just show a simple alert. Replace with navigation or state update as needed.
    alert("Proceeding to the next step of booking!");
  }
  return (
    <div className="max-w-7xl mx-auto">
      {/* Car Name Header */}
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Mercedes S-Class</h1>
        <p className="text-lg text-gray-600 mt-2">Luxury Sedan Experience</p>
      </div>

      <div>
        {/* Left Side - Car Details */}
        <div className="space-y-6">
          {/* Car Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Engine</p>
              <p className="font-bold">4.0L V8</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Power</p>
              <p className="font-bold">496 HP</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">0-60 mph</p>
              <p className="font-bold">4.5s</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Top Speed</p>
              <p className="font-bold">155 mph</p>
            </div>
          </div>

          {/* Car Images Carousel */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Main Carousel Image */}
                <div className="relative overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={carImages[currentImageIndex].src || "/placeholder.svg"}
                    alt={carImages[currentImageIndex].alt}
                    className="w-full h-80 lg:h-96 object-cover transition-all duration-300"
                  />

                  {/* Navigation Arrows */}
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

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {carImages.length}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
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
                      <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-20 h-16 object-cover" />
                      {index === currentImageIndex && <div className="absolute inset-0 bg-indigo-500/20"></div>}
                    </button>
                  ))}
                </div>

                {/* Image Title */}
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-700">{carImages[currentImageIndex].title}</p>
                </div>

                {/* Dots Indicator */}
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

          {/* About this Mercedes S-Class */}
          <Card>
            <CardHeader>
              <CardTitle>About this Mercedes S-Class</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Experience unparalleled luxury with the Mercedes S-Class, the flagship sedan that sets the standard for
                automotive excellence. This masterpiece of German engineering combines sophisticated design with
                cutting-edge technology to deliver an exceptional driving experience.
              </p>

              {/* Car Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">Luxury Sedan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-medium">Automatic</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Seats</p>
                    <p className="font-medium">4 Adults</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Luggage className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Luggage</p>
                    <p className="font-medium">3 Large Bags</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Fuel className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium">Premium</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Settings className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-medium">Unlimited</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Comfort & Convenience</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Air Conditioning with 4-zone Climate Control</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Heated & Ventilated Seats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Panoramic Sunroof</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Power Trunk Lid</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Technology & Safety</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">12.3" Digital Instrument Cluster</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">MBUX Infotainment System</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">360° Camera System</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Active Parking Assist</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}