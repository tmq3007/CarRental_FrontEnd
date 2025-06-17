"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { DashboardContent } from "@/components/admin/dashboard-content"

export function AdminDashboard() {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <DashboardContent />
            </div>
        </SidebarProvider>
    )
}
