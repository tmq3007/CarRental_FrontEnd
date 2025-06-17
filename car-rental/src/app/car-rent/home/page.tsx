"use client";

import CarOwnerHomepageLayout from "@/components/homepage/car-owners-layout";
import CustomerHomepageLayout from "@/components/homepage/customer-layout";
import { RootState } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

export default function CustomerHomePage() {

    const searchParams = useSearchParams();

    if (searchParams.get("selectedPanel") === "car-owner") {
        return <CarOwnerHomepageLayout />;
    }
    return <CustomerHomepageLayout />;


}