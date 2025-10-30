import { Card } from "@/components/ui/card"
import { Car, DollarSign, ShieldCheck } from "lucide-react"
import Image from "next/image" // Import Image component

export default function LearnMorePage() {
    return (
        <div className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                            Discover More About Our Car Rental Services
                        </h1>
                        <p className="max-w-[800px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                            At RentCar Pro, we are committed to providing you with the best car rental experience. Learn more
                            about our history, our fleet, and what makes us different.
                        </p>
                    </div>
                </div>

                {/* Our Story Section */}
                <section className="mt-12 md:mt-24 lg:mt-32">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Story</h2>
                            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Founded in 2025, RentCar Pro started with a vision to simplify car rentals and make travel
                                more accessible. We began with a small fleet and a big dream, growing steadily by focusing on customer
                                satisfaction and reliable service. Today, we are proud to be a trusted name in car rentals, serving
                                thousands of happy customers.
                            </p>
                            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Our commitment to excellence drives us to continuously improve our services, expand our fleet, and
                                embrace new technologies to enhance your rental journey.
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <Image
                                src="/img.png"
                                width={600}
                                height={400}
                                alt="Our Story Image"
                                className="w-full h-auto rounded-lg object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="mt-12 md:mt-24 lg:mt-32">
                    <div className="space-y-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Us?</h2>
                        <p className="max-w-[900px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            We go the extra mile to ensure your car rental experience is seamless and enjoyable.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <Card className="flex flex-col items-center p-6 text-center">
                            <Car className="h-12 w-12 text-green-500 dark:text-green-200 mb-4" />
                            <h3 className="text-xl font-bold">Diverse Fleet</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Choose from a wide range of vehicles, from economy cars to luxury SUVs.
                            </p>
                        </Card>
                        <Card className="flex flex-col items-center p-6 text-center">
                            <DollarSign className="h-12 w-12 text-green-500 dark:text-green-200 mb-4" />
                            <h3 className="text-xl font-bold">Competitive Pricing</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Enjoy transparent pricing with no hidden fees and great deals.
                            </p>
                        </Card>
                        <Card className="flex flex-col items-center p-6 text-center">
                            <ShieldCheck className="h-12 w-12 text-green-500 dark:text-green-200 mb-4" />
                            <h3 className="text-xl font-bold">Exceptional Service</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Our dedicated team is here to assist you 24/7, ensuring a smooth rental.
                            </p>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}
