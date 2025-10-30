"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarImageCarouselProps {
    images?: string[]
    alt?: string
    className?: string
}

export function CarImageCarousel({ images = [], alt = "", className = "" }: CarImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        )
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        )
    }

    return (
        <div className={`border rounded-md flex items-center justify-center relative bg-gray-50 ${className}`}>
            <ChevronLeft
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={prevImage}
            />

            {images.length > 0 ? (
                <img
                    src={images[currentImageIndex]}
                    alt={alt}
                    className="w-full h-full object-cover rounded-md"
                />
            ) : (
                <div className="text-gray-400 text-6xl">✕</div>
            )}

            <ChevronRight
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={nextImage}
            />

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}