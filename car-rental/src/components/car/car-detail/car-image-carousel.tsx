"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarImageCarouselProps {
    images?: string[]
    alt?: string
}

export function CarImageCarousel({images=[ ], alt = "" }: CarImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % Math.max(1, images.length))
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + Math.max(1, images.length)) % Math.max(1, images.length))
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="relative">
                    <div className="aspect-[4/3] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        {images.length > 0 ? (
                            <img
                                src={images[currentImageIndex] || "/placeholder.svg"}
                                alt={alt}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-gray-400 text-6xl">✕</div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-black" : "bg-gray-300"}`}
                        />
                    ))}

                </div>
            </CardContent>
        </Card>
    )
}
