"use client";

import CarOwnerHomepageLayout from "@/components/homepage/car-owners-layout";
import CustomerHomepageLayout from "@/components/homepage/customer-layout";
import GuestHomepageLayout from "@/components/homepage/guest-layout";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function CustomerHomePage() {

    const role = useSelector((state: RootState) => state.user?.role);
    
    // if (role === "car_owner") {
    //     return <CarOwnerHomepageLayout />;
    // }else if (role === "customer") {
        return <CustomerHomepageLayout />;
    // }else {
    //     return <GuestHomepageLayout />;
    // }
}