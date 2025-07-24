import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutUsPage() {
    return (
        <div className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                {/* Hero Section */}
                <section className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:gap-16 items-center text-center">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">About Our Company</h1>
                            <p className="max-w-[800px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                                We are a passionate team dedicated to building innovative solutions that empower businesses and
                                individuals. Our journey began with a simple idea: to make technology accessible and impactful for
                                everyone.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                            <Link
                                href="learn-more"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-green-500 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-200 dark:text-green-900 dark:hover:bg-green-300 dark:focus-visible:ring-green-700"
                                prefetch={false}
                            >
                                Learn More
                            </Link>
                            <Link
                                href="contact"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-green-700 focus-visible:outline-none focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-green-200 dark:focus-visible:ring-green-700"
                                prefetch={false}
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="mt-12 md:mt-24 lg:mt-32">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission & Values</h2>
                            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Our mission is to deliver exceptional value through innovative technology and unparalleled customer
                                service. We believe in fostering a culture of continuous learning, collaboration, and integrity. Every
                                decision we make is guided by our core values of excellence, transparency, and customer-centricity.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold">Innovation</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        We constantly seek new ways to solve problems and improve our products and services.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold">Integrity</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        We operate with honesty and strong moral principles in all our dealings.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold">Customer Focus</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Our customers are at the heart of everything we do, and their success is our priority.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mt-12 md:mt-24 lg:mt-32">
                    <div className="space-y-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Our Team</h2>
                        <p className="max-w-[900px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Behind every great product is a great team. Get to know the dedicated individuals who make it all happen.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                        <Card className="flex flex-col items-center p-6 text-center">
                            <h3 className="text-lg font-semibold">Truong Manh Quan</h3>
                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">CEO & Founder</p>*/}
                        </Card>
                        <Card className="flex flex-col items-center p-6 text-center">
                            <h3 className="text-lg font-semibold">Nguyen Duc Dat</h3>
                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">Chief Technology Officer</p>*/}
                        </Card>
                        <Card className="flex flex-col items-center p-6 text-center">
                            <h3 className="text-lg font-semibold">Nguyen Manh Kien</h3>
                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">Head of Product</p>*/}
                        </Card>
                        <Card className="flex flex-col items-center p-6 text-center">
                            <h3 className="text-lg font-semibold">Nguyen Viet Hung</h3>
                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">Lead Designer</p>*/}
                        </Card>
                        <Card className="flex flex-col items-center p-6 text-center">
                            <h3 className="text-lg font-semibold">Pham Nhat Minh</h3>
                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">Marketing Manager</p>*/}
                        </Card>
                    </div>
                </section>

                {/* Call to Action / Contact Section */}
                <section className="mt-12 md:mt-24 lg:mt-32 text-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Work With Us?</h2>
                        <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Whether you have a question, want to collaborate, or just say hello, we'd love to hear from you.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="contact">Get in Touch</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}
