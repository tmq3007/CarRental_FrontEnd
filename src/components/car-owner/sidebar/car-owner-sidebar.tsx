"use client"

import {
  LayoutDashboard,
  Car,
  BarChart3,
  Settings,
  PlusCircle,
  List,
  CalendarDays,
  MessageSquare,
  LogOut,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { resetUser } from "@/lib/slice/userSlice"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CarOwnerSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const [vehiclesOpen, setVehiclesOpen] = useState<boolean>(
    pathname?.includes("/car-owner/my-car") || pathname?.includes("/car-owner/add-car"),
  )

  const navItems = [
    {
      title: "Overview",
      url: "/car-owner/",
      icon: LayoutDashboard,
      isActive: pathname === "/car-owner/",
    },
    {
      title: "Vehicles",
      url: "/car-owner/my-car",
      icon: Car,
      isActive: pathname?.includes("/car-owner/my-car") || pathname?.includes("/car-owner/add-car"),
    },
    {
      title: "Statistics",
      url: "/car-owner/statistics",
      icon: BarChart3,
      isActive: pathname === "/car-owner/statistics",
    },
    {
      title: "Feedback",
      url: "/car-owner/feedback",
      icon: MessageSquare,
      isActive: pathname === "/car-owner/feedback",
    },
    {
      title: "Settings",
      url: "/car-owner/settings",
      icon: Settings,
      isActive: pathname === "/car-owner/settings",
    },
  ]

  const vehicleSubItems = [
    {
      title: "My Cars",
      url: "/car-owner/my-car",
      icon: List,
      isActive: pathname?.includes("/car-owner/my-car") && !pathname?.includes("/edit-car"),
    },
    {
      title: "Add Car",
      url: "/car-owner/add-car",
      icon: PlusCircle,
      isActive: pathname === "/car-owner/add-car",
    },
    {
      title: "Bookings",
      url: "/car-owner/bookings",
      icon: CalendarDays,
      isActive: pathname?.includes("/car-owner/bookings"),
    },
  ]

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...")

    try {
      await fetch("/api/logout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setTimeout(() => {
        toast.success("Logged out successfully!", { id: toastId, duration: 2000 })
      })
      dispatch(resetUser())
      router.push("/signin")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed", { id: toastId })
      dispatch(resetUser())
    }
  }

  return (
    <Sidebar className="border-r border-green-200/20 bg-white">
      {/* Header */}
      <SidebarHeader className="border-b border-green-200/20 bg-gradient-to-br from-green-50 to-white p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-auto gap-3 px-2 py-3">
              <a href="/car-owner/" className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-green-700 text-white aspect-square size-10 flex-shrink-0">
                  <Car className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-bold text-gray-900">RentCar Pro</span>
                  <span className="truncate text-xs text-gray-500">Owner Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-0 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {navItems.map((item) => {
                if (item.title === "Vehicles") {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <button
                        onClick={() => setVehiclesOpen(!vehiclesOpen)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                          item.isActive
                            ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-expanded={vehiclesOpen}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                            vehiclesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {vehiclesOpen && (
                        <div className="mt-2 ml-2 flex flex-col gap-1 border-l border-green-200/30 pl-3">
                          {vehicleSubItems.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.title}
                              asChild
                              isActive={subItem.isActive}
                              className={`h-9 text-sm transition-all duration-200 ${
                                subItem.isActive
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              <Link
                                href={subItem.url}
                                className="flex items-center gap-2"
                                aria-current={subItem.isActive ? "page" : undefined}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <span className="truncate">{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className={`h-10 transition-all duration-200 font-medium text-sm ${
                        item.isActive
                          ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2"
                        aria-current={item.isActive ? "page" : undefined}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="border-t border-green-200/20 bg-gradient-to-t from-green-50/50 to-white p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium text-sm"
              title="Sign out of your account"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
