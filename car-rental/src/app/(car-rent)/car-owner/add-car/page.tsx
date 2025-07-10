"use client"
import React, { useState } from "react"

// Import step components
import BasicInfoStep from "@/components/car/add-car/basic-info-step"
import DetailsStep from "@/components/car/add-car/details-step"
import PricingStep from "@/components/car/add-car/pricing-step"
import FinishStep from "@/components/car/add-car/finish-step"
import Breadcrumb from "@/components/common/breadcum";
import {AddCarDTO} from "@/lib/services/car-api";
import LoadingPage from "@/components/common/loading";


const steps = [
    { id: 1, title: "Basic", description: "Basic information" },
    { id: 2, title: "Details", description: "Car details and images" },
    { id: 3, title: "Pricing", description: "Pricing and terms" },
    { id: 4, title: "Finish", description: "Review and submit" },
]

export default function AddCarPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [AddCarDTO, setAddCarDTO] = useState<AddCarDTO>({
        // Basic Info
        LicensePlate: "",
        BrandName: "",
        Model: "",
        ProductionYear: "",
        Transmission: "automatic",
        Color: "",
        NumberOfSeats: "",
        Fuel: "gasoline",
        Documents: {
            RegistrationPaper: null,
            CertificateOfInspection: null,
            Insurance: null,
        },

        // Details
        Mileage: "",
        FuelConsumption: "",
        Address: {
            Search: "",
            ProvinceCode: null,
            ProvinceName: "",
            DistrictCode: null,
            DistrictName: "",
            WardCode: null,
            WardName: "",
            HouseNumber: "",
        },
        Description: "",
        AdditionalFunctions: {
            Bluetooth: false,
            GPS: false,
            Camera: false,
            SunRoof: false,
            ChildLock: false,
            ChildSeat: false,
            DVD: false,
            USB: false,
        },
        Images: {
            Front: null,
            Back: null,
            Left: null,
            Right: null,
        },

        // Pricing
        BasePrice: "",
        RequiredDeposit: "",
        TermsOfUse: {
            NoSmoking: false,
            NoFoodInCar: false,
            NoPet: false,
            Other: false,
            OtherText: "",
        },
    })

    const updateAddCarDTO = (updates: Partial<AddCarDTO>) => {
        setAddCarDTO((prev) => ({ ...prev, ...updates }))
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

    const setPageLoading = (loading: boolean) => {
        setIsPageLoading(loading)
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep carData={AddCarDTO} updateCarData={updateAddCarDTO} onNext={nextStep} />
            case 2:
                return <DetailsStep carData={AddCarDTO} updateCarData={updateAddCarDTO} onNext={nextStep} onPrev={prevStep} />
            case 3:
                return <PricingStep carData={AddCarDTO} updateCarData={updateAddCarDTO} onNext={nextStep} onPrev={prevStep} />
            case 4:
                return <FinishStep carData={AddCarDTO} onPrev={prevStep} setPageLoading={setPageLoading} />
            default:
                return null
        }
    }

    if (isPageLoading) {
        return <LoadingPage />
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">

            <div className="mx-auto">
                <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Add A Car" }]} />

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
