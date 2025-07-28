"use client"

import type React from "react"
import { Star, Bookmark, Car, Fuel, Cog, Ruler, Box, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { CarSearchVO } from "@/lib/services/car-api"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"
import { useRef } from "react"

interface CarRentalGridCardProps {
  car: CarSearchVO
  isSaved: boolean
  currentImageIndex: number
  rentButtonPos: { x: number; y: number }
  viewButtonPos: { x: number; y: number }
  toggleSave: () => void
  nextImage: () => void
  prevImage: () => void
  goToImage: (index: number) => void
  handleMouseEnter: (
    carId: string,
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: React.RefObject<HTMLButtonElement>,
    setPosition: "rentButtonPos" | "viewButtonPos"
  ) => void
  handleRentNow: () => void
  handleViewDeal: () => void
}

export default function CarRentalGridCard({
  car,
  isSaved,
  currentImageIndex,
  rentButtonPos,
  viewButtonPos,
  toggleSave,
  nextImage,
  prevImage,
  goToImage,
  handleMouseEnter,
  handleRentNow,
  handleViewDeal,
}: CarRentalGridCardProps) {
  const rentButtonRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>
  const viewButtonRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center p-4 pb-0">
        <div>
          <h3 className="font-bold text-lg">{car.brand}</h3>
          <p className="text-sm text-gray-500">{car.model}</p>
        </div>
        <button onClick={toggleSave} className="text-gray-500 hover:text-gray-700">
          <Bookmark className={isSaved ? "fill-black" : ""} size={20} />
        </button>
      </CardHeader>

      <div className="relative group">
        <img
          src={car.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${car.brand} ${car.model} - Image ${currentImageIndex + 1}`}
          className="w-full h-48 object-cover transition-opacity duration-300"
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
        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1} / {car.images.length}
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between border-b">
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
              className={`w-2 h-2 rounded-full mx-0.5 transition-colors duration-200 ${
                i === currentImageIndex ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex border-b flex-grow">
        {/* Vehicle Specifications */}
        <div className="w-2/3 py-3 pl-4">
          <h4 className="font-medium text-sm mb-3">Vehicle Specifications</h4>
          <div className="grid grid-cols-3">
            <div className="border border-r-0 border-b-0 p-2 flex flex-col items-center justify-center text-center">
              <Car size={18} className="text-gray-500 mb-1" />
              <span className="text-xs">{car.specs.engine}</span>
            </div>
            <div className="border border-r-0 border-b-0 p-2 flex flex-col items-center justify-center text-center">
              <Fuel size={18} className="text-gray-500 mb-1" />
              <span className="text-xs">{car.specs.fuel}</span>
            </div>
            <div className="border border-b-0 p-2 flex flex-col items-center justify-center text-center">
              <Cog size={18} className="text-gray-500 mb-1" />
              <span className="text-xs">{car.specs.transmission}</span>
            </div>
            <div className="border border-r-0 p-2 flex flex-col items-center justify-center text-center">
              <Ruler size={18} className="text-gray-500 mb-1" />
              <span className="text-xs">{car.specs.fuelConsumption}</span>
            </div>
            <div className="border border-r-0 p-2 flex flex-col items-center justify-center text-center">
              <Box size={18} className="text-gray-500 mb-1" />
              <span className="text-xs">{car.specs.numberOfSeat}</span>
            </div>
            <div
              className="border p-2 flex flex-col items-center justify-center text-center text-green-600 cursor-pointer"
              onClick={handleViewDeal}
            >
              <span className="text-xs font-medium">View All</span>
              <span className="text-xs">Specification</span>
            </div>
          </div>
        </div>
        {/* Price Section */}
        <div className="w-1/3 p-3 flex flex-col justify-center items-center border-l">
          <p className="text-xs text-gray-500">Per day</p>
          <p className="text-gray-500 line-through text-sm">{formatCurrency(car.basePrice * 1.2)}</p>
          <p className="text-green-600 text-2xl font-bold">{formatCurrency(car.basePrice)}</p>
        </div>
      </div>

      <div className="p-4 flex justify-center mt-auto">
        <div className="flex flex-col gap-2 w-full">
          <button
            ref={rentButtonRef}
            className="relative overflow-hidden bg-black text-white w-full py-2 px-4 rounded-full font-medium transition-colors duration-700 group"
            onMouseEnter={(e) => handleMouseEnter(car.id, e, rentButtonRef, "rentButtonPos")}
            onClick={handleRentNow}
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
            className="relative overflow-hidden border border-gray-300 text-gray-700 w-full py-2 px-4 rounded-full font-medium hover:border-green-500 transition-colors duration-700 group"
            onMouseEnter={(e) => handleMouseEnter(car.id, e, viewButtonRef, "viewButtonPos")}
            onClick={handleViewDeal}
          >
            <span className="relative z-10 transition-colors duration-700 group-hover:text-white">VIEW DETAIL</span>
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

      <CardFooter className="p-4 pt-0 text-xs text-gray-500 flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Free consultation until 48 hours before pick-up
      </CardFooter>
    </Card>
  )
}