"use client";

import ClickSpark from "@/blocks/Animations/ClickSpark/ClickSpark";
import CarOwnerHomepageLayout from "@/components/homepage/car-owners-layout";
import CustomerHomepageLayout from "@/components/homepage/customer-layout";
import { useSearchParams } from "next/navigation";
export default function CustomerHomePage() {

    const searchParams = useSearchParams();

    if (searchParams.get("selectedPanel") === "car-owner") {
        return (
            <CarOwnerHomepageLayout />
        )
    }
    return (
        <CustomerHomepageLayout />);


}