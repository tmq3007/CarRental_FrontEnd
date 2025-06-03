"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface CarInfo {
    name: string
    ratings: number
    totalRatings: number
    numberOfRides: number
    price: string
    location: string
    status: "Available" | "Unavailable" | "Rented"
}

interface CarInfoHeaderProps {
    carInfo: CarInfo
    onRentClick?: () => void
}

export function CarInfoHeader({ carInfo, onRentClick }: CarInfoHeaderProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Available":
                return "bg-green-100 text-green-800"
            case "Rented":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{carInfo.name}</h2>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Ratings:</span>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= carInfo.ratings ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
              {carInfo.totalRatings > 0 ? `(${carInfo.totalRatings} ratings)` : "(No ratings yet)"}
            </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
            <span>
              <strong>No. of rides:</strong> {carInfo.numberOfRides}
            </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
            <span>
              <strong>Price:</strong> {carInfo.price}
            </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
            <span>
              <strong>Locations:</strong> {carInfo.location}
            </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
            <span>
              <strong>Status:</strong>
            </span>
                        <Badge variant="secondary" className={getStatusColor(carInfo.status)}>
                            {carInfo.status}
                        </Badge>
                    </div>
                </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onRentClick}>
                Rent now
            </Button>
        </div>
    )
}
