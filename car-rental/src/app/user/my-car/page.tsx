"use client"

import { useEffect, useState } from "react"
import CarListPage from "@/components/homepage/car-list-page"

export default function CarsPage() {
    const [accountId, setAccountId] = useState<string>("")

    useEffect(() => {
        //test accountId, replace with actual logic to get accountId
        const mockAccountId = "3E90353C-1C5D-469E-A572-0579A1C0468D"
        setAccountId(mockAccountId)
    }, [])

    if (!accountId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return <CarListPage accountId={accountId} />
}
