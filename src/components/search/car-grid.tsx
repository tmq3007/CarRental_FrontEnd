"use client"

import { Filter } from "lucide-react"
import CarRentalListCard from "./cards/list-view-card"
import CarRentalGridCard from "./cards/grid-view-card"
import { CarSearchVO } from "@/lib/services/car-api"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { LoginModal } from "./login-modal"

interface CarGridProps {
  filteredCars: CarSearchVO[]
  viewMode: "list" | "grid"
  clearAllFilters: () => void
}

export default function CarGrid({ filteredCars, viewMode, clearAllFilters }: CarGridProps) {
  const router = useRouter()
  const isLoggedIn = useSelector((state: RootState) => state.user.id !== "")
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Common state for each car
  const [carStates, setCarStates] = useState<{
    [key: string]: {
      isSaved: boolean
      currentImageIndex: number
      rentButtonPos: { x: number; y: number }
      viewButtonPos: { x: number; y: number }
    }
  }>(
    filteredCars.reduce(
      (acc, car) => ({
        ...acc,
        [car.id]: {
          isSaved: false,
          currentImageIndex: 0,
          rentButtonPos: { x: 0, y: 0 },
          viewButtonPos: { x: 0, y: 0 },
        },
      }),
      {}
    )
  )

  const handleMouseEnter = (
    carId: string,
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: React.RefObject<HTMLButtonElement>,
    setPosition: "rentButtonPos" | "viewButtonPos"
  ) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCarStates((prev) => ({
        ...prev,
        [carId]: {
          ...prev[carId],
          [setPosition]: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
        },
      }))
    }
  }

  const nextImage = (carId: string) => {
    setCarStates((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        currentImageIndex: (prev[carId].currentImageIndex + 1) % filteredCars.find((car) => car.id === carId)!.images.length,
      },
    }))
  }

  const prevImage = (carId: string) => {
    setCarStates((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        currentImageIndex:
          (prev[carId].currentImageIndex - 1 + filteredCars.find((car) => car.id === carId)!.images.length) %
          filteredCars.find((car) => car.id === carId)!.images.length,
      },
    }))
  }

  const goToImage = (carId: string, index: number) => {
    setCarStates((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        currentImageIndex: index,
      },
    }))
  }

  const toggleSave = (carId: string) => {
    setCarStates((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        isSaved: !prev[carId].isSaved,
      },
    }))
  }

  const handleRentNow = (carId: string) => {
    if (isLoggedIn) {
      router.push(`/booking?carId=${carId}`)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLoginRedirect = () => {
    setShowLoginModal(false)
    router.push("/signin")
  }

  const handleSignupRedirect = () => {
    setShowLoginModal(false)
    router.push("/signup")
  }
  const handleCloseModal = () => {
    setShowLoginModal(false)
  }

  if (filteredCars.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Filter size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"}>
        {filteredCars.map((car, index) => (
          <div
            key={car.id}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {viewMode === "list" ? (
              <CarRentalListCard
                car={car}
                isSaved={carStates[car.id].isSaved}
                currentImageIndex={carStates[car.id].currentImageIndex}
                rentButtonPos={carStates[car.id].rentButtonPos}
                viewButtonPos={carStates[car.id].viewButtonPos}
                toggleSave={() => toggleSave(car.id)}
                nextImage={() => nextImage(car.id)}
                prevImage={() => prevImage(car.id)}
                goToImage={(index) => goToImage(car.id, index)}
                handleMouseEnter={handleMouseEnter}
                handleRentNow={() => handleRentNow(car.id)}
                handleViewDeal={() => router.push(`/home/car-list/${car.id}`)}
              />
            ) : (
              <CarRentalGridCard
                car={car}
                isSaved={carStates[car.id].isSaved}
                currentImageIndex={carStates[car.id].currentImageIndex}
                rentButtonPos={carStates[car.id].rentButtonPos}
                viewButtonPos={carStates[car.id].viewButtonPos}
                toggleSave={() => toggleSave(car.id)}
                nextImage={() => nextImage(car.id)}
                prevImage={() => prevImage(car.id)}
                goToImage={(index) => goToImage(car.id, index)}
                handleMouseEnter={handleMouseEnter}
                handleRentNow={() => handleRentNow(car.id)}
                handleViewDeal={() => router.push(`/home/car-list/${car.id}`)}
              />
            )}
          </div>
        ))}
      </div>

      <LoginModal
        open={showLoginModal}
        onLoginRedirect={handleLoginRedirect}
        onSignupRedirect={handleSignupRedirect}
        onClose={handleCloseModal}
      />
    </>
  )
}