"use client"

import CarListPage from "@/components/car-owner/car-list-page"
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import NoResult from "@/components/common/no-result";

export default function CarsPage() {
    const mockAccountId = useSelector((state: RootState) => state.user?.id)
    const role = useSelector((state: RootState) => state.user?.role)
    if (role === "car_owner") {
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
    }else{
        return <NoResult />
    }

}
