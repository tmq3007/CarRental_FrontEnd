"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Breadcrumb from "@/components/common/breadcum";
import {CarImageCarousel} from "@/components/car/car-detail/car-image-carousel";
import {CarInfoHeader} from "@/components/car/car-detail/car-info-header";
import {BasicInformationTab} from "@/components/car/car-detail/basic-information-tab";
import {DetailsTab} from "@/components/car/car-detail/details-tab";
import {TermsOfUseTab} from "@/components/car/car-detail/terms-of-use-tab";

export function CarDetailsPage() {

    const carInfo = {
        name: "Nissan Navara El 2017",
        ratings: 0,
        totalRatings: 0,
        numberOfRides: 0,
        price: "900k/day",
        location: "Cau Giay, Hanoi",
        status: "Available" as const,
    }

    const carSpecs = {
        licensePlate: "",
        brandName: "",
        productionYear: "",
        transmission: "",
        color: "",
        model: "",
        numberOfSeats: "",
        fuel: "",
    }

    const documents = [
        { no: 1, name: "Registration paper", note: "Verified" },
        { no: 2, name: "Certificate of Inspection", note: "Verified" },
        { no: 3, name: "Insurance", note: "Not available" },
    ]

    const carDetails = {
        mileage: "",
        fuelConsumption: "18 liter/100 km",
        address: "",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    }

    const pricing = {
        basePrice: "900,000",
        requiredDeposit: "15,000,000",
    }

    const handleRentClick = () => {
        console.log("Rent button clicked")
        // Implement rent functionality
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto ">
                <Breadcrumb items={[{ label: "Home", path: "/" },
                    { label: "Cars", path: "/cars" },
                    { label: carInfo.name }]} />
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Car Details</h1>
                <Separator className="mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <CarImageCarousel alt={carInfo.name} />
                    </div>

                    <div className="space-y-6">
                        <CarInfoHeader carInfo={carInfo} onRentClick={handleRentClick} />
                    </div>
                </div>

                <div className="mt-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-md">
                            <TabsTrigger value="basic">Basic Information</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="terms">Terms of use</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="mt-6">
                            <BasicInformationTab specs={carSpecs} documents={documents} />
                        </TabsContent>

                        <TabsContent value="details" className="mt-6">
                            <DetailsTab details={carDetails} />
                        </TabsContent>

                        <TabsContent value="terms" className="mt-6">
                            <TermsOfUseTab pricing={pricing} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
