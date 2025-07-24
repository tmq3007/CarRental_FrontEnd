import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Map } from "lucide-react" // Added Map icon for the button
import { Button } from "@/components/ui/button" // Import Button
import Link from "next/link" // Import Link

export default function ContactPage() {
    // Google Maps URL for FPT University Hanoi directions
    const fptUniversityAddress =
        "FPT University Hà Nội, Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội"
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fptUniversityAddress)}`

    return (
        <div className="w-full py-8 md:py-18 lg:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Get in Touch</h1>
                        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to
                            reach out.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-1 lg:gap-12">
                    {/* Contact Information & Map */}
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <Mail className="h-6 w-6 text-green-500 dark:text-green-200" />
                                <div>
                                    <h3 className="text-lg font-semibold">Email</h3>
                                    <p className="text-gray-500 dark:text-gray-400">support@rentcarpro.com</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <Phone className="h-6 w-6 text-green-500 dark:text-green-200" />
                                <div>
                                    <h3 className="text-lg font-semibold">Phone</h3>
                                    <p className="text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <MapPin className="h-6 w-6 text-green-500 dark:text-green-200" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Address</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            FPT University Hà Nội, Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội
                                        </p>
                                    </div>
                                </div>
                                {/* Google Map Embed */}
                                <div className="w-full h-[300px] rounded-md overflow-hidden mb-4">
                                    {" "}
                                    {/* Added mb-4 for spacing */}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29796.050736475056!2d105.48718214035036!3d21.012416675952743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1753283786668!5m2!1svi!2s"                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="FPT University Hanoi on Google Maps"
                                    ></iframe>
                                </div>
                                {/* Directions Button */}
                                <Button
                                    asChild
                                    className="w-full bg-green-500 text-gray-50 hover:bg-green-600 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-200 dark:text-green-900 dark:hover:bg-green-300 dark:focus-visible:ring-green-700"
                                >
                                    <Link href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
                                        <Map className="mr-2 h-4 w-4" /> Get Directions
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
