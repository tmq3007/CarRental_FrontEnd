"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef } from "react"

const carTypes = [
  {
    title: "Economy Cars",
    description: "Perfect for city driving and budget-conscious travelers",
    price: "From $25/day",
    features: ["Fuel Efficient", "Easy Parking", "Affordable"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "SUVs & 4WDs",
    description: "Ideal for family trips and off-road adventures",
    price: "From $55/day",
    features: ["Spacious", "All-Terrain", "Family Friendly"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Luxury Vehicles",
    description: "Premium cars for special occasions and business travel",
    price: "From $95/day",
    features: ["Premium Comfort", "Latest Technology", "Professional"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Vans & Minivans",
    description: "Perfect for group travel and moving large items",
    price: "From $65/day",
    features: ["High Capacity", "Group Travel", "Cargo Space"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Sports Cars",
    description: "High-performance vehicles for an exhilarating driving experience",
    price: "From $120/day",
    features: ["High Performance", "Sporty Design", "Premium Experience"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Electric Vehicles",
    description: "Eco-friendly cars with zero emissions and cutting-edge technology",
    price: "From $45/day",
    features: ["Zero Emissions", "Advanced Tech", "Eco-Friendly"],
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function CarTypesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const getVisibleCards = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 4 // lg: 4 cards
      if (window.innerWidth >= 768) return 2 // md: 2 cards
      return 1 // sm: 1 card
    }
    return 4
  }

  const [visibleCards, setVisibleCards] = useState(getVisibleCards)

  const maxIndex = Math.max(0, carTypes.length - visibleCards)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  // Handle window resize
  useState(() => {
    const handleResize = () => {
      const newVisibleCards = getVisibleCards()
      setVisibleCards(newVisibleCards)
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, carTypes.length - newVisibleCards)))
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  })

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vehicle Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From compact cars to luxury vehicles, we have the perfect car for every occasion and budget
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={carouselRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {carTypes.map((carType, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-3">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={carType.image || "/placeholder.svg"}
                        alt={carType.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{carType.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{carType.description}</p>

                      <div className="mb-6">
                        <p className="text-2xl font-bold text-green-600 mb-3">{carType.price}</p>
                        <ul className="space-y-2">
                          {carType.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-green-600 rounded-full mr-3 flex-shrink-0"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button stays at bottom */}
                      <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 mt-auto">
                        View Cars
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg border-gray-200 z-10"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg border-gray-200 z-10"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-green-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile swipe hint */}
        <div className="text-center mt-4 md:hidden">
          <p className="text-sm text-gray-500">Swipe to see more categories</p>
        </div>
      </div>
    </section>
  )
}
