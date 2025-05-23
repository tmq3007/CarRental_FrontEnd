"use client"

import Link from "next/link"
import { Car, DollarSign, Shield, UserCheck, FileCheck, CreditCard } from "lucide-react"
import {useGetCarsQuery} from "@/lib/services/carApi";
import {Button} from "@/components/ui/button";

export default function Home() {
  // This will fetch cars but won't break if the API isn't ready
  const { data: cars = [], isLoading, error } = useGetCarsQuery(undefined, {

  })


  console.log("data", cars)

  return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-zinc-700 text-white">
          <div className="container mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6" />
              <h1 className="text-xl font-bold">Rent a car today!</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-sm hover:underline">
                ABOUT US
              </Link>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                <span className="text-sm">Welcome, Bao</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="bg-gray-200 py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl font-semibold mb-6">Have a car for rent? Don&apos;t miss out of your benefit</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-2 rounded">
                      <DollarSign className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium">How the insurance works</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    From the minute you list your car, all the way over till the second you get them back you are covered.
                    Your private insurance is not affected.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-2 rounded">
                      <Shield className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium">It&apos;s completely free</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    We offer both owners and renters free sign ups. It&apos;s only once a vehicle is rented out that a
                    share is deducted to cover admin and insurance.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-2 rounded">
                      <UserCheck className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium">You decide the price</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    When you list a car you decide the price. We can help with recommendations as to price, but ultimately
                    you decide!
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-2 rounded">
                      <Car className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium">Handing over your vehicle</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    You arrange the time and location for the exchange of your vehicle with the renter. Both parties will
                    need to agree and sign the vehicle rental sheet before and after key handover.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-2 rounded">
                      <FileCheck className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium">You are in charge</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    All renters are pre-screened by us to ensure safety and get your approval. If you do not feel
                    comfortable with someone you are able to decline a booking.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-2 rounded">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium">Set payment</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    We pay you once a month and you can always view how much your car has earned under your user profile.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Make money on your car right away</h2>
              </div>
              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium">
                  List Your Car Today
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-200 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-gray-700">RENT CARS</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">
                      Search Cars and Rates
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-gray-700">CUSTOMER ACCESS</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/booking" className="text-sm text-gray-600 hover:text-gray-900">
                      Manage My Booking
                    </Link>
                  </li>
                  <li>
                    <Link href="/wallet" className="text-sm text-gray-600 hover:text-gray-900">
                      My Wallet
                    </Link>
                  </li>
                  <li>
                    <Link href="/car" className="text-sm text-gray-600 hover:text-gray-900">
                      My Car
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                      Log In
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-gray-700">JOIN US</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-900">
                      New User Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
  )
}
