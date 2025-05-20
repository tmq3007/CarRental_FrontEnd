import Link from "next/link"
import { Car } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-zinc-700 text-white">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <Car className="h-6 w-6" />
                        <Link href="/" className="text-xl font-bold">
                            Rent a car today!
                        </Link>
                    </div>
                    <Link href="/" className="text-sm hover:underline">
                        HOME
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-6">About Us</h1>
                <div className="prose max-w-none">
                    <p>
                        We are a peer-to-peer car rental marketplace that connects car owners with people who need to rent a
                        vehicle. Our platform makes it easy for car owners to earn extra income from their vehicles when they're not
                        using them, and provides renters with more affordable and convenient car rental options.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
                    <p>
                        Our mission is to transform the way people think about car ownership and rentals. By creating a community
                        marketplace for cars, we're helping to reduce the number of vehicles on the road, decrease traffic
                        congestion, and lower carbon emissions.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
                    <p>Our platform is designed to be simple and secure for both car owners and renters:</p>
                    <ul>
                        <li>Car owners list their vehicles on our platform, setting their own availability and pricing</li>
                        <li>Renters search for available cars in their area and book the ones that meet their needs</li>
                        <li>We verify all users and provide insurance coverage during the rental period</li>
                        <li>Owners and renters meet for a key exchange and vehicle inspection</li>
                        <li>After the rental period, the car is returned and both parties rate their experience</li>
                    </ul>

                    <div className="mt-8">
                        <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-200 py-8">
                <div className="container mx-auto text-center text-sm text-gray-600 px-4">
                    <p>© {new Date().getFullYear()} Car Rental Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
