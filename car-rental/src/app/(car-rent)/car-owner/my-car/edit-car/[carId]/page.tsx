"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import EditCarDetails from "@/components/car/edit-car/edit-car-details"

export default function EditCarPage() {
    const params = useParams()
    const carId = params?.carId as string
    const [initialData, setInitialData] = useState<any>(null)

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`http://localhost:5227/api/Car/${carId}/detail`)
                if (response.ok) {
                    const data = await response.json()
                    setInitialData(data.data)
                } else {
                    console.error("Failed to fetch car data:", response.statusText)
                }
            } catch (error) {
                console.error("Error fetching car data:", error)
            }
        }
        fetchCarData()
    }, [carId])

    if (!initialData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return <EditCarDetails carId={carId} initialData={initialData} />
}