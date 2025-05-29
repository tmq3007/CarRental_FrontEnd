"use client"

import { Car, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
    return (
        <header className="bg-green-400 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left side - Logo and tagline */}
                <div className="flex items-center gap-3 text-white">
                    <Car className="h-12 w-12" />
                    <span className="text-3xl font-serif">Rent a car today!</span>
                </div>

                {/* Center - Navigation */}
                <nav className="hidden md:flex">
                    <Button variant="ghost" className=" text-2xl text-white hover:bg-green-500">
                        ABOUT US
                    </Button>
                </nav>

                {/* Right side - User menu */}
                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className=" text-xl text-white hover:bg-green-500 flex items-center gap-2"
                            >
                                <User className="h-4 w-4" />
                                <span>Welcome, An</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>My Profile</DropdownMenuItem>
                            <DropdownMenuItem>My Bookings</DropdownMenuItem>
                            <DropdownMenuItem>My Wallet</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
