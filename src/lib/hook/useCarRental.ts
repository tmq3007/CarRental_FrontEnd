"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"

// Define the Redux state type
interface RootState {
  auth: {
    isLoggedIn: boolean
    user?: any
  }
}

export function useCarRental() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  // Get login status from Redux store
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  const handleRentNow = (carId: string) => {
    if (isLoggedIn) {
      router.push(`/booking?carId=${carId}`)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleViewDetail = (carId: string) => {
    router.push(`/home/car-list/${carId}`)
  }

  const handleLoginRedirect = () => {
    setShowLoginModal(false)
    router.push("/login")
  }

  const handleSignupRedirect = () => {
    setShowLoginModal(false)
    router.push("/signup")
  }

  const handleCloseModal = () => {
    setShowLoginModal(false)
  }

  return {
    showLoginModal,
    handleRentNow,
    handleViewDetail,
    handleLoginRedirect,
    handleSignupRedirect,
    handleCloseModal,
  }
}
