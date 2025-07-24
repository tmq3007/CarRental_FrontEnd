"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Luggage, Fuel, Settings, Check, ChevronLeft, ChevronRight, X, Calendar, Gauge } from "lucide-react"
import type { CarVO_Detail } from "@/lib/services/car-api"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"

interface CarSelectionStepProps {
  car: CarVO_Detail
}

export function CarSelectionStep({ car }: CarSelectionStepProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const carImages = [
    {
      src: car.carImageFront || "/placeholder.svg?height=400&width=700",
      alt: `${car.brand} ${car.model} Front`,
      title: "Front View",
    },
    {
      src: car.carImageBack || "/placeholder.svg?height=400&width=700",
      alt: `${car.brand} ${car.model} Back`,
      title: "Back View",
    },
    {
      src: car.carImageLeft || "/placeholder.svg?height=400&width=700",
      alt: `${car.brand} ${car.model} Left`,
      title: "Left View",
    },
    {
      src: car.carImageRight || "/placeholder.svg?height=400&width=700",
      alt: `${car.brand} ${car.model} Right`,
      title: "Right View",
    },
  ].filter((image) => image.src !== "/placeholder.svg?height=400&width=700")

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Car Header */}
      <div>
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl mb-8">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=300&width=1200')] opacity-5"></div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <span className="text-blue-400 font-medium text-xs sm:text-sm uppercase tracking-wider">
                Premium Vehicle
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
              {car.brand} <span className="text-blue-400">{car.model}</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-full lg:max-w-2xl leading-relaxed">
              {car.description || "Experience luxury and performance in perfect harmony with this premium vehicle."}
            </p>
          </div>

          {/* Pricing Card */}
          <div className="flex-shrink-0 order-1 lg:order-2 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-4 border border-white/20 w-full sm:w-auto sm:min-w-[200px]">
              <div className="text-center sm:text-left lg:text-center">
                <p className="text-lg sm:text-xl font-bold text-white mb-1">Available</p>
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-2">Starting from:</p>
                <div className="flex items-center justify-center sm:justify-start lg:justify-center">
                  <p className="text-green-400 font-bold text-xl sm:text-2xl lg:text-lg">
                    <span>{formatCurrency(car.basePrice)}/day</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        {/* Enhanced Car Specifications */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              Vehicle Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Fuel className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
                  </div>
                  <p className="text-orange-600 font-medium text-sm mb-1">Fuel Type</p>
                  <p className="text-slate-800 font-bold text-lg">{car.isGasoline ? "Gasoline" : "Diesel"}</p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                  </div>
                  <p className="text-green-600 font-medium text-sm mb-1">Seating</p>
                  <p className="text-slate-800 font-bold text-lg">{car.numberOfSeats || 4} Seats</p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
                  </div>
                  <p className="text-purple-600 font-medium text-sm mb-1">Mileage</p>
                  <p className="text-slate-800 font-bold text-lg">
                    {car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                  </div>
                  <p className="text-blue-600 font-medium text-sm mb-1">Year</p>
                  <p className="text-slate-800 font-bold text-lg">{car.productionYear || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Additional Quick Stats */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">
                    {car.isAutomatic ? "Automatic" : "Manual"} Transmission
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">
                    {car.numberOfSeats ? `${Math.floor(car.numberOfSeats / 2)} Large Bags` : "Standard Luggage"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Car Images Carousel */}
        <Card className="mt-6">
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
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 ${index === currentImageIndex
                      ? "ring-2 ring-indigo-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                      }`}
                  >
                    <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-20 h-16 object-cover" />
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
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? "bg-green-600" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About this Car */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              About this {car.brand} {car.model}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              {car.description ||
                `Experience the ${car.brand} ${car.model}, a vehicle that combines performance and comfort.`}
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
                  <p className="font-medium">
                    {car.numberOfSeats ? `${Math.floor(car.numberOfSeats / 2)} Large Bags` : "N/A"}
                  </p>
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
        <Card className="mt-6">
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
                    {car.insuranceUriIsVerified ? (
                      <Check className={`h-4 w-4 text-green-500`} />
                    ) : (
                      <X className={`h-4 w-4 text-red-500`} />
                    )}
                    <span className="text-sm">
                      Insurance {car.insuranceUriIsVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {car.registrationPaperUriIsVerified ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      Registration {car.registrationPaperUriIsVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {car.certificateOfInspectionUriIsVerified ? (
                      <Check className={`h-4 w-4 text-green-500`} />
                    ) : (
                      <X className={`h-4 w-4 text-red-500`} />
                    )}
                    <span className="text-sm">
                      Inspection {car.certificateOfInspectionUriIsVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
