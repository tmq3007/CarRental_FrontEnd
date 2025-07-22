"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import EditCarDetails from "@/components/car/edit-car/edit-car-details"
import { setCarId } from "@/lib/slice/carSlice"

export default function EditCarPage() {
    const params = useParams()
    const dispatch = useDispatch()
    const carId = useSelector((state: RootState) => state.car.id)
    const carIdFromParams = params?.carId as string

    useEffect(() => {
        if (carIdFromParams && !isNaN(Number(carIdFromParams))) {
            dispatch(setCarId(carIdFromParams))
        }
    }, [carIdFromParams, dispatch])

    const effectiveCarId = carId || carIdFromParams || ""

    if (isNaN(Number(effectiveCarId))) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Car ID</h2>
                    <p className="text-gray-600">Please provide a valid car ID.</p>
                </div>
            </div>
        )
    }

    return <EditCarDetails/>
}