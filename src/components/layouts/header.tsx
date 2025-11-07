"use client"

import { Car, ChevronDown, User, Phone, MapPin, Clock, Menu, X, LogOut } from "lucide-react"
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

    const email = useSelector((state: RootState) => state.user?.email);
    const username = useSelector((state: RootState) => state.user?.full_name);
    const role = useSelector((state: RootState) => state.user?.role);

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
        { name: "HOME", href: "/" },
        { name: "SEARCH", href: "/search" },
        // { name: "PRICING", href: "/pricing" },
        { name: "ABOUT US", href: "/about-us" },
        { name: "CONTACT", href: "/contact" },
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
            router.push("/signin");
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(resetUser());
        }
    }

    return (
        <header
            className={`fixed top-0 left-0 pt-0 right-0 bg-gradient-to-r from-green-500 to-green-600 shadow-lg transition-all duration-300 ease-in-out max-width: 100vw ${isScrolled ? "py-2" : "py-4"
                }`}
            style={{ zIndex: 100 }}
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
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 ease-in-out relative group ${isScrolled ? "text-sm px-3 py-2" : "text-base px-4 py-2"}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {item.name}
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
                                </Button>
                            </Link>
                        ))}
                    </nav>


                    {/* Right side - User menu and mobile menu */}
                    <div className="flex items-center gap-2">
                        {email ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <div className="relative">
                                            <img
                                                src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                                                alt="User avatar"
                                                className={`rounded-full ring-2 ring-white/30 transition-all duration-300 ${
                                                    isScrolled ? "w-7 h-7" : "w-8 h-8"
                                                }`}
                                            />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                        </div>
                                        <span className="hidden sm:inline font-medium">{username || email}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[280px] p-2 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23] rounded-lg shadow-lg "
                                    style={{ zIndex: 101 }}
                                >
                                    <div className="flex items-center gap-3 p-2 mb-2">
                                        <img
                                            src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                                            alt="User avatar"
                                            className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30]"
                                        />
                                        <div className="grid gap-0.5">
                                            <div className="font-medium text-gray-900 dark:text-white">{username || "User"}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{email}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 dark:border-[#1F1F23] -mx-2 my-2"></div>
                                    
                                    <Link href="/user/profile" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors">
                                        My Profile
                                    </Link>
                                    <Link href="/user/wallet" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors">
                                        My Wallet
                                    </Link>

                                    {role === "car_owner" ? (
                                        <>
                                            <Link href="/car-owner/my-car" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors">
                                                My Cars
                                            </Link>
                                            <Link href="/car-owner/add-car" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors">
                                                Add A Car
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href="/user/booking" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors">
                                            My Bookings
                                        </Link>
                                    )}

                                    <div className="border-t border-gray-200 dark:border-[#1F1F23] -mx-2 my-2"></div>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                Sign Out
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Sign Out</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to sign out?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button onClick={handleLogout}>Sign Out</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                                onClick={() => router.push('/signin')}
                            >
                                <User className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`} />
                                <span className="hidden sm:inline">Sign In</span>
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5 text-white" />
                            ) : (
                                <Menu className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Overlay */}
                {isMobileMenuOpen && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className="fixed top-[72px] left-0 right-0 bottom-0 bg-white dark:bg-[#0F0F12] z-50 lg:hidden">
                            <div className="flex flex-col h-full overflow-y-auto">
                                <nav className="flex-1 py-4 px-4">
                                    <div className="space-y-1">
                                        {navItems.map((item) => (
                                            <Link 
                                                key={item.name} 
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </nav>
                                {email && (
                                    <div className="border-t border-gray-200 dark:border-[#1F1F23] p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img
                                                src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                                                alt="User avatar"
                                                className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30]"
                                            />
                                            <div className="grid gap-0.5">
                                                <div className="font-medium text-gray-900 dark:text-white">{username || "User"}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{email}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </header>
    )
}
