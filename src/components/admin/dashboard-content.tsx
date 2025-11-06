"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { StatsCards } from "@/components/admin/stats-cards"
import { TopBookedVehicles } from "@/components/admin/top-booked-vehicles"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { TopPayingCustomers } from "@/components/admin/top-paying-customers"
import Breadcrumb from "@/components/common/breadcum";
import React from "react";

export function DashboardContent() {
    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="mr-2 h-5">
                    <Breadcrumb items={[{ label: "Admin", path: "/admin" }, { label: "Dashboard" }]} />
                    </div>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="p-6 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">
                                Welcome back! Here's what's happening with your car rental business today.
                            </p>
                        </div>

                        <StatsCards />

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                            <RevenueChart />
                            <TopBookedVehicles />
                        </div>

                        <TopPayingCustomers />
                    </div>
                </div>
            </div>
        </SidebarInset>
    )
}
