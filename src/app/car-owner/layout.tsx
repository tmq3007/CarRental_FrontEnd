"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { CarOwnerSidebar } from "@/components/car-owner/sidebar/car-owner-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function CarOwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <CarOwnerSidebar />
      <SidebarInset className="w-full">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-green-200/30 bg-gradient-to-r from-white to-green-50/30 px-4">
          <SidebarTrigger className="text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200 -ml-2" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
