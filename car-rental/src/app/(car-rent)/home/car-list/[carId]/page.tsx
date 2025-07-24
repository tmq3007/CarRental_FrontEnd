"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Breadcrumb from "@/components/common/breadcum";
import {CarImageCarousel} from "@/components/car/car-detail/car-image-carousel";
import {CarInfoHeader} from "@/components/car/car-detail/car-info-header";
import {BasicInformationTab} from "@/components/car/car-detail/basic-information-tab";
import {DetailsTab} from "@/components/car/car-detail/details-tab";
import {TermsOfUseTab} from "@/components/car/car-detail/terms-of-use-tab";
import {useGetCarDetailQuery} from "@/lib/services/car-api";
import NoResult from "@/components/common/no-result";
import CarDetailsPageSkeleton from "@/components/skeleton/car-detail-skeleton";
import { useRouter } from "next/navigation";

export default async function MyCarDetailsPage({ params }: { params: Promise< {carId: string }> }) {
    console.log("params.carId:", params); // Debug log
    const { data: carDetail, isLoading, error } = useGetCarDetailQuery((await params).carId);
    const route =  useRouter();
    console.log("carDetail", carDetail)

    if (isLoading) {
        return <CarDetailsPageSkeleton />
    }

    if (error) {
        return <NoResult/>;
    }

    if (!carDetail?.data) {
        return <NoResult/>;
    }


    const car = carDetail.data;


    // Prepare car images array
    const carImages = [
        car.carImageFront,
        car.carImageBack,
        car.carImageLeft,
        car.carImageRight
    ].filter(Boolean) as string[];

    // Prepare car info for header
    const carInfo = {
        name: `${car.brand} ${car.model} ${car.productionYear}`,
        rating: Number(car.rating), // You might want to get this from API
        totalRating: Number( car.totalRating ), // You might want to get this from API
        numberOfRides: car.numberOfRides,
        price: `${car.basePrice.toLocaleString()} VND/day`,
        location: `${car.district}, ${car.cityProvince}`,
        status: car.status as "verified" | "not_verified" | "stopped" | "available",
    }

    // Prepare car specs for basic info tab
    const carSpecs = {
        licensePlate: car.licensePlate || "N/A",
        brandName: car.brand || "N/A",
        productionYear: car.productionYear?.toString() || "N/A",
        transmission: car.isAutomatic ? "Automatic" : "Manual",
        color: car.color || "N/A",
        model: car.model || "N/A",
        numberOfSeats: car.numberOfSeats?.toString() || "N/A",
        fuel: car.isGasoline ? "Gasoline" : "Diesel",
    }

    // Prepare documents for basic info tab
    const documents = [
        { no: 1, name: "Registration paper", note: car.registrationPaperUriIsVerified ? "Verified" : "Not verified" },
        { no: 2, name: "Certificate of Inspection", note: car.certificateOfInspectionUriIsVerified ? "Verified" : "Not verified" },
        { no: 3, name: "Insurance", note: car.insuranceUriIsVerified ? "Verified" : "Not available" },
    ]

    // Prepare car details for details tab
    const carDetails = {
        mileage: car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A",
        fuelConsumption: car.fuelConsumption ? `${car.fuelConsumption} liter/100 km` : "N/A",
        address: `${car.houseNumberStreet}, ${car.ward}, ${car.district}, ${car.cityProvince}`,
        description: car.description || "No description available",
    }

    // Prepare pricing for terms tab
    const pricing = {
        basePrice: car.basePrice.toLocaleString(),
        requiredDeposit: car.deposit.toLocaleString(),
    }

    const handleRentClick = () => {
        // Implement rent functionality
        route.push(`/booking?carId=${car.id}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto ">
                <Breadcrumb items={[{ label: "Home", path: "/" },
                    { label: "My Car", path: "/user/my-car" },
                    { label: carInfo.name }]} />
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Car Details</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <CarImageCarousel images={carImages} alt={carInfo.name} />
                    </div>

                    <div className="space-y-6">
                        <CarInfoHeader carInfo={carInfo} onRentClick={handleRentClick} isCarOwner={false} />
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
                            <DetailsTab details={carDetails} additionalFunction={car.additionalFunction}/>
                        </TabsContent>

                        <TabsContent value="terms" className="mt-6">
                            <TermsOfUseTab pricing={pricing} terms={car.termOfUse} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
