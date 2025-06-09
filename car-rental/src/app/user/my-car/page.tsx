"use client"

import { useEffect, useState } from "react"
import CarListPage from "@/components/homepage/car-list-page"
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";

export default function CarsPage() {
     const mockAccountId = useSelector((state: RootState) => state.user?.id)

    if (!mockAccountId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return <CarListPage accountId={mockAccountId} />
}
