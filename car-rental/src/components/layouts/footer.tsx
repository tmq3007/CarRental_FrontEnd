"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-gray-200 py-8 px-4 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Rent Cars Section */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">RENT CARS</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/search" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Search Cars and Rates
                                </Link>
                            </li>
                            <li>
                                <Link href="/locations" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Rental Locations
                                </Link>
                            </li>
                            <li>
                                <Link href="/deals" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Special Deals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Access Section */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">CUSTOMER ACCESS</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/manage-booking" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Manage My Booking
                                </Link>
                            </li>
                            <li>
                                <Link href="/wallet" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    My Wallet
                                </Link>
                            </li>
                            <li>
                                <Link href="/my-car" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    My Car
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Log In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Join Us Section */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">JOIN US</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/signup" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    New User Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/partner" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Become a Partner
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-8 pt-6 border-t border-gray-300">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                        <p>&copy; 2024 Car Rental Service. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="hover:text-green-600 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-green-600 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/contact" className="hover:text-green-600 transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
