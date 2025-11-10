"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import CarOwnerDashboard from "@/components/car-owner/dashboard/car-owner-dashboard"

export default function CarOwnerDashboardPage() {
  const userId = useSelector((state: RootState) => state.user?.id) || "demo-user"

  return <CarOwnerDashboard userId={userId} />
}
