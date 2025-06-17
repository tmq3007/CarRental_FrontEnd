"use client"

import EditCarDetails from "@/components/homepage/edit-car-details"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

export default function EditCarPage() {
    const params = useParams()
    const carIdFromParams = params?.carId as string


    const carIdFromStore = useSelector((state: RootState) => state.car?.id)
    const carId = carIdFromParams || carIdFromStore || ""

    if (isNaN(Number(carId))) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Car ID</h2>
                    <p className="text-gray-600">Please provide a valid car ID.</p>
                </div>
            </div>
        )
    }

    return <EditCarDetails carId={carId}/>
}
