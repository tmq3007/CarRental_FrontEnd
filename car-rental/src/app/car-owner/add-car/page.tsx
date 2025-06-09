"use client"
import React, { useState } from "react"

// Import step components
import BasicInfoStep from "@/app/car-owner/add-car/basic-info-step"
import DetailsStep from "@/app/car-owner/add-car/details-step"
import PricingStep from "@/app/car-owner/add-car/pricing-step"
import FinishStep from "@/app/car-owner/add-car/finish-step"
import Breadcrumb from "@/components/common/breadcum";

// Types
export interface CarData {
    // Basic Info
    licensePlate: string
    brandName: string
    model: string
    productionYear: string
    transmission: string
    color: string
    numberOfSeats: string
    fuel: string
    documents: {
        registrationPaper: File | null
        certificateOfInspection: File | null
        insurance: File | null
    }

    // Details
    mileage: string
    fuelConsumption: string
    address: {
        search: string
        cityProvince: string
        district: string
        ward: string
        houseNumber: string
    }
    description: string
    additionalFunctions: {
        bluetooth: boolean
        gps: boolean
        camera: boolean
        sunRoof: boolean
        childLock: boolean
        childSeat: boolean
        dvd: boolean
        usb: boolean
    }
    images: {
        front: File | null
        back: File | null
        left: File | null
        right: File | null
    }

    // Pricing
    basePrice: string
    requiredDeposit: string
    termsOfUse: {
        noSmoking: boolean
        noFoodInCar: boolean
        noPet: boolean
        other: boolean
        otherText: string
    }
}

const steps = [
    { id: 1, title: "Basic", description: "Basic information" },
    { id: 2, title: "Details", description: "Car details and images" },
    { id: 3, title: "Pricing", description: "Pricing and terms" },
    { id: 4, title: "Finish", description: "Review and submit" },
]

export default function AddCarPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [carData, setCarData] = useState<CarData>({
        licensePlate: "",
        brandName: "",
        model: "",
        productionYear: "",
        transmission: "automatic",
        color: "",
        numberOfSeats: "",
        fuel: "gasoline",
        documents: {
            registrationPaper: null,
            certificateOfInspection: null,
            insurance: null,
        },
        mileage: "",
        fuelConsumption: "",
        address: {
            search: "",
            cityProvince: "",
            district: "",
            ward: "",
            houseNumber: "",
        },
        description: "",
        additionalFunctions: {
            bluetooth: false,
            gps: false,
            camera: false,
            sunRoof: false,
            childLock: false,
            childSeat: false,
            dvd: false,
            usb: false,
        },
        images: {
            front: null,
            back: null,
            left: null,
            right: null,
        },
        basePrice: "",
        requiredDeposit: "",
        termsOfUse: {
            noSmoking: false,
            noFoodInCar: false,
            noPet: false,
            other: false,
            otherText: "",
        },
    })

    const updateCarData = (updates: Partial<CarData>) => {
        setCarData((prev) => ({ ...prev, ...updates }))
    }

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep carData={carData} updateCarData={updateCarData} onNext={nextStep} />
            case 2:
                return <DetailsStep carData={carData} updateCarData={updateCarData} onNext={nextStep} onPrev={prevStep} />
            case 3:
                return <PricingStep carData={carData} updateCarData={updateCarData} onNext={nextStep} onPrev={prevStep} />
            case 4:
                return <FinishStep carData={carData} onPrev={prevStep} />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">

            <div className="max-w-5xl mx-auto">
                <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Profile" }]} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a car</h2>

                {/* Step Progress */}
                <div className="flex items-center mb-8 overflow-hidden w-full">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div
                                className={`relative px-6 py-3 text-sm font-medium transition-colors w-full text-center ${
                                    currentStep === step.id
                                        ? "bg-green-500 text-white"
                                        : currentStep > step.id
                                            ? "bg-gray-400 text-white"
                                            : "bg-gray-300 text-gray-700"
                                }`}
                                style={{
                                    clipPath:
                                        index === 0
                                            ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
                                            : "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                                }}
                            >
                                <div className="relative z-10">
                                    Step {step.id}: {step.title}
                                </div>
                            </div>
                            {index < steps.length - 1 && <div className="-ml-5 w-5"></div>}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">{renderStep()}</div>
            </div>


        </div>
        </div>
    )
}
