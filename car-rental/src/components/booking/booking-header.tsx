"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import Link from "next/link";

interface BookingHeaderProps {
    title: string
    carName: string
    carId: string
    fromDate: string
    toDate: string
    numberOfDays: number
    basePrice?: string
    total?: string
    deposit?: string
    bookingNo?: string
    bookingStatus?: string
    carImageFront?: string
    carImageBack?: string
    carImageLeft?: string
    carImageRight?: string
}

export default function BookingHeader({
    title = "Booking Details",
    carName = "Nissan Navara El 2017",
    fromDate = "13/02/2022 - 12:00 PM",
    toDate = "23/02/2022 - 14:00 PM",
    numberOfDays = 10,
    basePrice = "500,000",
    total = "5,000,000",
    deposit = "1,000,000",
    bookingNo = "012345",
    bookingStatus = "Confirmed",
    carImageFront,
    carImageBack,
    carImageLeft,
    carImageRight,
    carId
}: BookingHeaderProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const carImages = [
        { src: carImageFront, alt: "Front view" },
        { src: carImageBack, alt: "Back view" },
        { src: carImageLeft, alt: "Left side view" },
        { src: carImageRight, alt: "Right side view" }
    ]
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === carImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? carImages.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-6 ">{title}</h1>

            <div className="flex gap-6 mb-6">
                {/* Car Image Section */}
                <div className="flex-shrink-0">
                    <div className="border rounded-md flex items-center justify-center w-80 h-52 relative bg-gray-50">
                        <ChevronLeft
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={prevImage}
                        />
                        <img
                            src={carImages[currentImageIndex].src}
                            alt={carImages[currentImageIndex].alt}
                            className="w-full h-full object-cover rounded-md"
                        />
                        <ChevronRight
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={nextImage}
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="flex gap-1">
                            {carImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Car Details and Actions Section */}
                <div className="flex-1 flex">
                    {/* Car Details */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-3">{carName}</h2>
                        <div className="space-y-1 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">From:</span>
                                <span>{fromDate}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">To:</span>
                                <span>{toDate}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">Number of days:</span>
                                <span>{numberOfDays} days</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">Base price:</span>
                                <span>{basePrice} VND</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">Total:</span>
                                <span>{total} VND</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">Deposit:</span>
                                <span>{deposit} VND</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">Booking No.:</span>
                                <span>{bookingNo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-medium">Booking status:</span>
                                <span className={`font-medium ${bookingStatus === "Confirmed" ? "text-green-600" : ""}`}>
                                    {bookingStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/user/booking/car-detail/${carId}`} passHref>
                            <Button
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 h-8 w-full"
                            >
                                View Car Details
                            </Button>
                        </Link>
                        {bookingStatus === "in_progress" ? (
                            <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-1 h-8 w-full">
                                Return Car
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" className="border-gray-300 text-sm px-3 py-1 h-8 w-full">
                                    Confirm Pick-up
                                </Button>
                                <Button variant="destructive" className="text-sm px-3 py-1 h-8 w-full">
                                    Cancel Booking
                                </Button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}