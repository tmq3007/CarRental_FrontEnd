"use client"

import { useState } from "react"

export function useImageCarousel(images: string[]) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return {
    currentImageIndex,
    nextImage,
    prevImage,
    goToImage,
  }
}
