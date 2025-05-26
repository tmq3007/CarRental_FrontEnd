"use client"

import Link from "next/link"
import {useGetCarsQuery} from "@/lib/services/car-api";
import {Button} from "@/components/ui/button";
import { DollarSign, MapPin, Shield, Headphones, User } from "lucide-react"
import {useGetUserByIdQuery} from "@/lib/services/user-api";
export default function Home() {
  // This will fetch cars but won't break if the API isn't ready
   const {data, isLoading, error} = useGetUserByIdQuery ("3E90353C-1C5D-469E-A572-0579A1C0468D")
 console.log("data", data)
  return (
      <main className="min-h-screen">
        {/* Why us section */}
        <section className="py-12 px-4 md:px-6 lg:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Why us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-3">Save money</h3>
                <p className="text-sm text-gray-600">
                  We have no setup or registration fees. No extra charge when you rent a car. So get started for FREE!
                </p>
              </div>

              <div className="border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-3">Convenient</h3>
                <p className="text-sm text-gray-600">
                  We have a large selection of premium cars to suit your needs throughout the country
                </p>
              </div>

              <div className="border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-3">Legal and insurance</h3>
                <p className="text-sm text-gray-600">
                  We fully cover all rentals and even provide roadside assistance. Our rating system and extended member
                  profile checks provide safety.
                </p>
              </div>

              <div className="border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-3">24/7 support</h3>
                <p className="text-sm text-gray-600">
                  Our team is ready to support you at every step with our 24/7 hotline and services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What people say section */}
        <section className="py-12 px-4 md:px-6 lg:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">What people say?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Where to find us section */}
        <section className="py-12 px-4 md:px-6 lg:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Where to find us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-white text-center">
                  <h3 className="text-xl font-bold">Hanoi</h3>
                  <p className="text-sm">50+ cars</p>
                </div>
              </div>

              <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-white text-center">
                  <h3 className="text-xl font-bold">Ho Chi Minh city</h3>
                  <p className="text-sm">100+ cars</p>
                </div>
              </div>

              <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-white text-center">
                  <h3 className="text-xl font-bold">Da Nang - Hoi An</h3>
                  <p className="text-sm">30+ cars</p>
                </div>
              </div>

              <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-white text-center">
                  <h3 className="text-xl font-bold">Nha Trang</h3>
                  <p className="text-sm">25+ cars</p>
                </div>
              </div>

              <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-white text-center">
                  <h3 className="text-xl font-bold">Da Lat</h3>
                  <p className="text-sm">20+ cars</p>
                </div>
              </div>

              <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-white text-center">
                  <h3 className="text-xl font-bold">Quang Ninh</h3>
                  <p className="text-sm">15+ cars</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Rent Cars</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Search Cars and Rates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Customer Access</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Manage My Booking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    My Wallet
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    My Car
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Log In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Join Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    New User Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
  )
}
