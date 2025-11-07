"use client"

import {
  Car,
  Settings,
  PlusCircle,
  List,
  CalendarDays,
  LogOut,
  ChevronsUpDown,
  LayoutDashboard,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { resetUser } from "@/lib/slice/userSlice"
import type { RootState } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type NavItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
}

export function CarOwnerSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const email = useSelector((state: RootState) => state.user?.email)
  const username = useSelector((state: RootState) => state.user?.full_name)
  const role = useSelector((state: RootState) => state.user?.role)

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/car-owner",
      icon: LayoutDashboard,
      isActive: pathname === "/car-owner" || pathname === "/car-owner/",
    },
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
      await fetch("/api/logout", { method: "PUT", headers: { "Content-Type": "application/json" } })
      setTimeout(() => toast.success("Logged out successfully!", { id: toastId, duration: 2000 }))
      dispatch(resetUser())
      router.push("/signin")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed", { id: toastId })
      dispatch(resetUser())
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUserHeader
          email={email || ""}
          username={username || "User"}
          onLogout={handleLogout}
          role={role}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={navItems[0].isActive}>
                  <Link href={navItems[0].url} className="flex items-center gap-2">
                    {(() => {
                      const Icon = navItems[0].icon
                      return <Icon className="w-5 h-5" />
                    })()}
                    <span className="truncate">{navItems[0].title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Vehicle Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(1).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/car-owner/settings"}>
                  <Link href="/car-owner/settings" className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    <span className="truncate">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function NavUserHeader({
  email,
  username,
  onLogout,
  role,
}: {
  email: string
  username: string
  onLogout: () => void
  role?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" alt={username} />
            <AvatarFallback className="rounded-lg">{username?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{username}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" alt={username} />
              <AvatarFallback className="rounded-lg">{username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{username}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user/profile">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user/wallet">My Wallet</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {role === "car_owner" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/car-owner/my-car">My Cars</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/car-owner/add-car">Add A Car</Link>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/user/booking">My Bookings</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-700">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
