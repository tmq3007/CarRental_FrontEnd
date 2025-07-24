"use client"

import type React from "react"

import { Star, Bookmark, Car, Fuel, Cog, Ruler, Box, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState, useRef } from "react"
import { CarSearchVO } from "@/lib/services/car-api"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"


interface CarRentalListCardProps {
  car: CarSearchVO
}

export default function CarRentalListCard({ car }: CarRentalListCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [rentButtonPos, setRentButtonPos] = useState({ x: 0, y: 0 })
  const [viewButtonPos, setViewButtonPos] = useState({ x: 0, y: 0 })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const rentButtonRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>
  const viewButtonRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>
  const router = useRouter();

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: React.RefObject<HTMLButtonElement>,
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  ) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <Card className="w-full overflow-hidden border border-gray-200 rounded-lg mb-4">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Car Image and Info */}
        <div className="w-full lg:w-1/3 p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl">{car.brand}</h3>
              <p className="text-sm text-gray-500">{car.model}</p>
            </div>
            <button onClick={() => setIsSaved(!isSaved)} className="text-gray-500 hover:text-gray-700">
              <Bookmark className={isSaved ? "fill-black" : ""} size={20} />
            </button>
          </div>

          <div className="relative group mb-4">
            <img
              src={car.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${car.brand} ${car.model} - Image ${currentImageIndex + 1}`}
              className="w-full h-48 object-cover rounded-lg transition-opacity duration-300"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="ml-1 text-sm font-medium">
                {car.rating} ({car.rating})
              </span>
            </div>
            <div className="text-xs text-gray-500">{car.bookedTime}</div>
            <div className="flex">
              {car.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToImage(i)}
                  className={`w-2 h-2 rounded-full mx-0.5 transition-colors duration-200 ${i === currentImageIndex ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Vehicle Specifications */}
        <div className="w-full lg:w-1/3 p-4 border-t lg:border-t-0 lg:border-l lg:border-r border-gray-200">
          <h4 className="font-medium text-lg mb-4">Vehicle Specifications</h4>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center text-center">
              <Car size={20} className="text-gray-500 mb-1 md:mb-2" />
              <span className="text-xs text-gray-500">{car.specs.engine}</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center text-center">
              <Fuel size={20} className="text-gray-500 mb-1 md:mb-2" />
              <span className="text-xs text-gray-500">{car.specs.fuel}</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center text-center">
              <Cog size={20} className="text-gray-500 mb-1 md:mb-2" />
              <span className="text-xs text-gray-500">{car.specs.transmission}</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center text-center">
              <Ruler size={20} className="text-gray-500 mb-1 md:mb-2" />
              <span className="text-xs text-gray-500">{car.specs.fuelConsumption}</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center text-center">
              <Box size={20} className="text-gray-500 mb-1 md:mb-2" />
              <span className="text-xs text-gray-500">{car.specs.numberOfSeat}</span>
            </div>
            <div onClick={() => {
              router.push(`/home/car-list/${car.id}`);
            }}
              className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col items-center justify-center text-center text-green-600 cursor-pointer hover:bg-green-50">
              <span className="text-xs font-medium">View All</span>
              <span className="text-xs">Specification</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center text-xs md:text-sm text-green-600">
              <Check size={16} className="mr-2 flex-shrink-0" />
              <span>Free cancellation up to 48h before pick-up time</span>
            </div>
            <div className="flex items-center text-xs md:text-sm text-green-600">
              <Check size={16} className="mr-2 flex-shrink-0" />
              <span>Instant confirmation</span>
            </div>
            <div className="flex items-center text-xs md:text-sm text-green-600">
              <Check size={16} className="mr-2 flex-shrink-0" />
              <span>Full prepayment</span>
            </div>
          </div>
        </div>

        {/* Right Section - Pricing and Actions */}
        <div className="w-full lg:w-1/3 p-4 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col justify-center">
          <div className="text-center lg:text-right mb-6">
            <p className="text-sm text-gray-500 mb-1">Per day</p>
            <p className="text-gray-500 line-through text-lg">{formatCurrency(car.basePrice * 1.2)}</p>
            <p className="text-green-600 text-3xl md:text-4xl font-bold mb-1">{formatCurrency(car.basePrice)}</p>
          </div>

          <div className="space-y-3">
            <button
              ref={rentButtonRef}
              className="relative overflow-hidden bg-black text-white w-full py-2 md:py-3 px-4 md:px-6 rounded-full font-medium transition-colors duration-700 group"
              onMouseEnter={(e) => handleMouseEnter(e, rentButtonRef, setRentButtonPos)}
              onClick={() => {
                router.push(`/booking?carId=${car.id}`);
              }}
            >
              <span className="relative z-10">RENT NOW</span>
              <div
                className="absolute bg-green-500 rounded-full scale-0 group-hover:scale-[35] transition-transform duration-1500 ease-in-out"
                style={{
                  left: `${rentButtonPos.x}px`,
                  top: `${rentButtonPos.y}px`,
                  width: "30px",
                  height: "30px",
                  transformOrigin: "center",
                }}
              ></div>
            </button>
            <button
              ref={viewButtonRef}
              className="relative overflow-hidden border border-gray-300 text-gray-700 w-full py-2 md:py-3 px-4 md:px-6 rounded-full font-medium hover:border-green-500 transition-colors duration-700 group"
              onMouseEnter={(e) => handleMouseEnter(e, viewButtonRef, setViewButtonPos)}
              onClick={() => {
                router.push(`/home/car-list/${car.id}`);
              }}
            >
              <span className="relative z-10 transition-colors duration-700 group-hover:text-white">VIEW DEAL</span>
              <div
                className="absolute bg-green-500 rounded-full scale-0 group-hover:scale-[35] transition-transform duration-1500 ease-in-out"
                style={{
                  left: `${viewButtonPos.x}px`,
                  top: `${viewButtonPos.y}px`,
                  width: "30px",
                  height: "30px",
                  transformOrigin: "center",
                }}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
