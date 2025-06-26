"use client"

import {
    Car,
    Calendar,
    Users,
    BarChart3,
    Settings,
    CreditCard,
    MapPin,
    FileText,
    Home,
    Bell,
    ChevronUp,
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
    SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useRef} from "react";
import {toast} from "sonner";
import {resetUser} from "@/lib/slice/userSlice";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";

// Menu items data
const data = {
    navMain: [
        {
            title: "Main",
            items: [
                {
                    title: "Dashboard",
                    url: "#",
                    icon: Home,
                    isActive: true,
                },
                {
                    title: "Fleet Management",
                    url: "#",
                    icon: Car,
                },
                {
                    title: "Bookings",
                    url: "#",
                    icon: Calendar,
                },
                {
                    title: "Customers",
                    url: "#",
                    icon: Users,
                },
            ],
        },
        {
            title: "Analytics & Reports",
            items: [
                {
                    title: "Analytics",
                    url: "#",
                    icon: BarChart3,
                },
                {
                    title: "Payments",
                    url: "#",
                    icon: CreditCard,
                },
                {
                    title: "Reports",
                    url: "#",
                    icon: FileText,
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    title: "Locations",
                    url: "#",
                    icon: MapPin,
                },
                {
                    title: "Notifications",
                    url: "#",
                    icon: Bell,
                },
                {
                    title: "Settings",
                    url: "#",
                    icon: Settings,
                },
            ],
        },
    ],
}



export function AppSidebar() {

    const ignoreScrollRef = useRef(false)
    const dispatch = useDispatch();
    const router = useRouter();

    const handleDropdownItemClick = (action: string) => {
        // Temporarily ignore scroll events
        ignoreScrollRef.current = true

        // Perform the action
        console.log(`Clicked: ${action}`)

        // Re-enable scroll detection after a short delay
        setTimeout(() => {
            ignoreScrollRef.current = false
        }, 100)
    }

    const handleLogout = async () => {
        const toastId = toast.loading('Logging out...');

        try {
            await fetch("/api/logout", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setTimeout(() => {
                toast.success('Logged out successfully!', { id: toastId, duration: 2000 });
            });
            router.push('/signin');
            dispatch(resetUser());
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(resetUser());
        }
    }


    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Car className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">RentCar Pro</span>
                                    <span className="truncate text-xs">Admin Dashboard</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                                        <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Admin User</span>
                                        <span className="truncate text-xs">admin@rentcar.com</span>
                                    </div>
                                    <ChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem
                                    className="text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleDropdownItemClick("Log Out")
                                    }}
                                >
                                    <Dialog>
                                        <form>
                                            <DialogTrigger asChild>
                                                <Link href="">Logout</Link>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Logout</DialogTitle>
                                                    <DialogDescription>
                                                        Are you want to logout?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button type="submit"
                                                                onClick={() => handleLogout()}>Logout</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </form>
                                    </Dialog>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
