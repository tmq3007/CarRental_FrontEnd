"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import {AddCarDTO, useAddCarMutation} from "@/lib/services/car-api";
import LoadingPage from "@/components/common/loading";
import { toast } from "sonner";

interface FinishStepProps {
    carData: AddCarDTO
    onPrev: () => void
    setPageLoading: (loading: boolean) => void
}

export default function FinishStep({ carData, onPrev, setPageLoading }: FinishStepProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [addCar, { isLoading, isError, isSuccess }] = useAddCarMutation();


    // Get available images
    const images = Object.values(carData.Images).filter((img) => img !== null)
    const hasImages = images.length > 0

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            console.log("Submitting car data:", carData);

            setPageLoading(true)

            const response = await addCar(carData).unwrap();

            console.log("Success:", response);

            toast.success("Car submitted successfully!");
            // Optionally reset form or redirect
        } catch (error) {
            console.error("Error submitting car:", error);
            toast.error("Failed to submit car. Please try again.");
        } finally {
            setPageLoading(false);
        }
    };

    const nextImage = () => {
        if (hasImages) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length)
        }
    }

    const prevImage = () => {
        if (hasImages) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
        }
    }

    // Generate car title
    const carTitle = `${carData.BrandName} ${carData.Model} ${carData.ProductionYear}`.trim()

    // Format price
    const formattedPrice = carData.BasePrice
        ? `${Number.parseInt(carData.BasePrice).toLocaleString()}k/day`
        : "Price not set"

    // Get location
    const location =
        [carData.Address.HouseNumber, carData.Address.WardName, carData.Address.DistrictName, carData.Address.ProvinceName]
            .filter(Boolean)
            .join(", ") ||
        carData.Address.Search ||
        "Location not specified"

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Preview</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Car Image Preview */}
                <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
                        {hasImages ? (
                            <>
                                <img
                                    src={URL.createObjectURL(images[currentImageIndex]) || "/placeholder.svg"}
                                    alt={`Car image ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded"></div>
                                    <p>No image uploaded</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image Indicators */}
                    {hasImages && images.length > 1 && (
                        <div className="flex justify-center space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentImageIndex ? "bg-gray-800" : "bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Car Details */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">{carTitle || "Car Title"}</h2>

                    {/* Ratings */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Ratings:</span>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 text-gray-300" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">(No ratings yet)</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">No. of rides:</span>
                            <span className="font-medium">0</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium text-lg">{formattedPrice}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Locations:</span>
                            <span className="font-medium">{location}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium text-green-600">Available</span>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                        <h4 className="font-medium text-gray-800">Car Details:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">License:</span>
                                <span className="ml-2">{carData.LicensePlate || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Seats:</span>
                                <span className="ml-2">{carData.NumberOfSeats || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Transmission:</span>
                                <span className="ml-2 capitalize">{carData.Transmission || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Fuel:</span>
                                <span className="ml-2 capitalize">{carData.Fuel || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    {Object.values(carData.AdditionalFunctions).some(Boolean) && (
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-800 mb-2">Features:</h4>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(carData.AdditionalFunctions)
                                    .filter(([_, enabled]) => enabled)
                                    .map(([feature, _]) => (
                                        <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                      {feature.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrev} className="text-gray-600">
                    Previous
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>
    )
}
