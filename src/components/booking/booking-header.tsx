"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, MapPin, CreditCard, Hash } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { BookingDetailVO, BookingStatus } from "@/lib/services/booking-api"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import { BookingStatusBadge } from "../car-owner/booking/status-badge"

interface BookingHeaderProps {
  title?: string
  bookingData: BookingDetailVO
}




function calculateNumberOfDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const daySpan = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(daySpan, 0) + 1
}

export default function BookingHeader({ title = "Booking Details", bookingData }: BookingHeaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carImages = [
    { src: bookingData.carImageFront, alt: "Front view" },
    { src: bookingData.carImageBack, alt: "Back view" },
    { src: bookingData.carImageLeft, alt: "Left side view" },
    { src: bookingData.carImageRight, alt: "Right side view" },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === carImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? carImages.length - 1 : prevIndex - 1))
  }


  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
      </div>

      <div className="p-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="group relative aspect-video overflow-hidden rounded-lg bg-slate-100">
              <img
                src={carImages[currentImageIndex].src || "/placeholder.svg?height=300&width=400&text=Car+Image"}
                alt={carImages[currentImageIndex].alt}
                className="h-full w-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-slate-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-slate-700" />
              </button>
              <div className="absolute right-4 top-4">
                <BookingStatusBadge status={bookingData.status} />
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`h-3 w-3 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex ? "bg-blue-500" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">{bookingData.carName}</h2>
              <div className="flex items-center gap-2 text-slate-600">
                <Hash className="h-4 w-4" />
                <span className="font-medium">{bookingData.bookingNumber}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Pickup</p>
                    <p className="text-sm text-slate-600">{bookingData.pickUpTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Return</p>
                    <p className="text-sm text-slate-600">{bookingData.dropOffTime}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Duration</p>
                    <p className="text-sm text-slate-600">{calculateNumberOfDays(bookingData.pickUpTime, bookingData.dropOffTime)} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Total cost</p>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(bookingData.basePrice ?? 0)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Deposit</p>
                  <p className="text-base font-semibold text-slate-900">{formatCurrency(bookingData.deposit ?? 0)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment type</p>
                  <p className="text-base font-semibold text-slate-900">{bookingData.paymentType ?? "—"}</p>
                </div>
              </div>
            </div>

            {bookingData.carId && (
              <Link href={`/user/booking/car-detail/${bookingData.carId}`} passHref>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  View car details
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
