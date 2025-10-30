"use client"

import { ChevronLeft, ChevronRight, Calendar, MapPin, CreditCard, Hash, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import { BookingDetailVO } from "@/lib/services/booking-api"
import Link from "next/link";

interface BookingHeaderProps {
  title: string
  bookingData: BookingDetailVO
  handleConfirmPickup: () => void
  handleCancelBooking: () => void
  handleReturnCar: () => void
  carId? : string
}

export default function BookingHeader({
  title = "Booking Details",
  bookingData,
  handleConfirmPickup,
  handleCancelBooking,
  handleReturnCar,
    carId
}: BookingHeaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carImages = [
    { src: bookingData.carImageFront, alt: "Front view" },
    { src: bookingData.carImageBack, alt: "Back view" },
    { src: bookingData.carImageLeft, alt: "Left side view" },
    { src: bookingData.carImageRight, alt: "Right side view" },
  ]
  function calculateNumberOfDays(startDate?: string, endDate?: string): number {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === carImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? carImages.length - 1 : prevIndex - 1))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
      in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending_payment: { label: "Pending Payment", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      pending_deposit: { label: "Pending Deposit", className: "bg-orange-100 text-orange-800 border-orange-200" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800 border-gray-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed
    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Car Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group">
              <img
                src={carImages[currentImageIndex].src || "/placeholder.svg?height=300&width=400&text=Car+Image"}
                alt={carImages[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute top-4 right-4">{getStatusBadge(bookingData.status || "confirmed")}</div>
            </div>

            <div className="flex justify-center space-x-2">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentImageIndex ? "bg-green-500" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Car Details and Actions Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{bookingData.carName}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <Hash className="w-4 h-4" />
                <span className="font-medium">{bookingData.bookingNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">{bookingData.pickUpTime}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Return</p>
                    <p className="text-sm text-gray-600">{bookingData.dropOffTime}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">
                      {calculateNumberOfDays(bookingData.pickUpTime, bookingData.dropOffTime)} day
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Cost</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency((bookingData.basePrice ?? -1))}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Deposit:</span>
                  <p className="font-semibold text-gray-900">{formatCurrency(bookingData.deposit ?? -1)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href={`/user/booking/car-detail/${bookingData.carId}`} passHref>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Car Details
              </Button>
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookingData.status === "confirmed" && (
                  <>
                    <Button
                      onClick={handleConfirmPickup}
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      Confirm Pickup
                    </Button>
                    <Button
                      onClick={handleCancelBooking}
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      Cancel Booking
                    </Button>
                  </>
                )}

                {bookingData.status === "pending_deposit" && (
                  <Button
                    onClick={handleCancelBooking}
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 sm:col-span-2 bg-transparent"
                  >
                    Cancel Booking
                  </Button>
                )}

                {bookingData.status === "in_progress" && (
                  <Button onClick={handleReturnCar} className="bg-blue-600 hover:bg-blue-700 text-white sm:col-span-2">
                    Return Car
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
