"use client"

import { Car, ChevronDown, User, Phone, MapPin, Clock, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "@/lib/slice/userSlice";
import { toast } from "sonner";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const ignoreScrollRef = useRef(false)
    const dispatch = useDispatch();
    const router = useRouter();

    const username = useSelector((state: RootState) => state.user?.full_name);

    // Debounced scroll handler to prevent rapid state changes
    const handleScroll = useCallback(() => {
        if (ignoreScrollRef.current) return

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const scrollY = window.scrollY
            setIsScrolled(scrollY > 50)
        }, 10)
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [handleScroll])

    const navItems = [
        { name: "FLEET", href: "#fleet" },
        { name: "LOCATIONS", href: "#locations" },
        { name: "PRICING", href: "#pricing" },
        { name: "ABOUT US", href: "#about" },
        { name: "CONTACT", href: "#contact" },
    ]

    // Handle dropdown menu item clicks without affecting scroll
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
            dispatch(resetUser());
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(resetUser());
        }
    }

    return (
        <header
            className={`fixed top-0 left-0 pt-0 right-0 z-50 bg-gradient-to-r from-green-500 to-green-600 shadow-lg transition-all duration-300 ease-in-out max-width: 100vw ${isScrolled ? "py-2" : "py-4"
                }`}
        >
            {/* Top info bar - only visible when not scrolled */}
            <div
                className={`bg-green-700 text-white text-sm transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>24/7 Support: +1 (555) 123-4567</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>50+ Locations Nationwide</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Open 24/7</span>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4 p-1">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo and tagline */}
                    <Link href="/"> 
                        <div
                            className={`flex items-center gap-3 text-white transition-all duration-300 ease-in-out ${isScrolled ? "scale-90" : "scale-100"
                                }`}
                        >
                            <div className="relative group">
                                <Car
                                    className={`transition-all duration-300 ease-in-out group-hover:rotate-12 ${isScrolled ? "h-8 w-8" : "h-12 w-12"
                                        }`}
                                />
                                <div
                                    className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className={`font-bold transition-all duration-300 ease-in-out ${isScrolled ? "text-lg" : "text-2xl lg:text-3xl"
                                        }`}
                                >
                                    RentCar Pro
                                </span>
                                <span
                                    className={`font-light transition-all duration-300 ease-in-out ${isScrolled ? "text-xs opacity-0 max-h-0" : "text-sm opacity-100 max-h-6"
                                        } overflow-hidden`}
                                >
                                    Your journey starts here
                                </span>
                            </div>
                        </div>
                    </Link>


                    {/* Center - Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <Button
                                key={item.name}
                                variant="ghost"
                                className={`text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 ease-in-out relative group ${isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    // Handle navigation without scrolling to top
                                    console.log(`Navigate to: ${item.name}`)
                                }}
                            >
                                {item.name}
                                <div
                                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
                            </Button>
                        ))}
                    </nav>

                    {/* Right side - User menu and mobile menu */}
                    <div className="flex items-center gap-2">
                        {/* User dropdown */}
                        {username ? (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 ease-in-out flex items-center gap-2 ${isScrolled ? "text-sm px-2 py-1" : "text-base px-3 py-2"
                                            }`}
                                    >
                                        <div className="relative">
                                            <User
                                                className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`} />
                                            <div
                                                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <span className="hidden sm:inline">Welcome, {username}</span>
                                        <ChevronDown
                                            className={`transition-all duration-300 ${isScrolled ? "h-3 w-3" : "h-4 w-4"}`} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48 animate-in slide-in-from-top-2 z-[60] bg-white border border-gray-200 shadow-lg"
                                    sideOffset={5}
                                    style={{ zIndex: 9999 }}
                                >
                                    <DropdownMenuItem
                                        className="hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDropdownItemClick("My Profile")
                                        }}
                                    >
                                        <Link href="/user/profile">
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDropdownItemClick("My Bookings")
                                        }}
                                    >
                                        <Link href="/user/profile"> My Bookings </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDropdownItemClick("My Wallet")
                                        }}
                                    >
                                        <Link href="/user/profile">My Wallet</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDropdownItemClick("Settings")
                                        }}
                                    >
                                        <Link href="/user/profile">Settings</Link>
                                    </DropdownMenuItem>
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
                                                    <Link href="/">Logout</Link>
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
                            </DropdownMenu>) : (
                            <Button
                                variant="ghost"
                                className={`text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 ease-in-out flex items-center gap-2 ${isScrolled ? "text-sm px-2 py-1" : "text-base px-3 py-2"
                                    }`}
                                onClick={() => router.push('/signin')}
                            >
                                <User className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`} />
                                <span className="hidden sm:inline">Login / Register</span>
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            className="lg:hidden text-white hover:bg-white/20 p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
                        }`}
                >
                    <nav className="flex flex-col space-y-2 pb-4">
                        {navItems.map((item, index) => (
                            <Button
                                key={item.name}
                                variant="ghost"
                                className="text-white hover:bg-white/20 justify-start transition-all duration-200 ease-in-out"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsMobileMenuOpen(false)
                                    console.log(`Navigate to: ${item.name}`)
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </nav>
                </div>

                {/* Dialog logout */}
                <div>

                </div>

            </div>
        </header>
    )
}
