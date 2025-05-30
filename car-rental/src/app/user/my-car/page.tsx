import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const cars = [
    {
        id: 1,
        name: "Nissan Navara El 2017",
        rating: 0,
        rides: 0,
        price: "900k/day",
        location: "Cau Giay, Hanoi",
        status: "Stopped",
    },
    {
        id: 2,
        name: "Nissan Navara El 2017",
        rating: 0,
        rides: 0,
        price: "900k/day",
        location: "Cau Giay, Hanoi",
        status: "Available",
    },
    {
        id: 3,
        name: "Nissan Navara El 2017",
        rating: 0,
        rides: 0,
        price: "900k/day",
        location: "Cau Giay, Hanoi",
        status: "Booked",
    },
]

export default function CarListPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
                    <span className="mx-2">{">"}</span>
                    <span className="text-gray-600">My Cars</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">List of Cars</h1>
                    <div className="flex gap-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">Add car</Button>
                        <Select defaultValue="newest">
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest to Latest</SelectItem>
                                <SelectItem value="oldest">Oldest to Newest</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Car Cards */}
                <div className="space-y-4">
                    {cars.map((car) => (
                        <Card key={car.id} className="bg-white">
                            <CardContent className="p-6">
                                <div className="flex gap-6">
                                    {/* Navigation Arrow Left */}
                                    <Button variant="ghost" size="icon" className="self-center">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Car Image */}
                                    <div className="relative w-64 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-full relative">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-32 h-32 border border-gray-400 transform rotate-45"></div>
                                                    <div className="absolute w-32 h-32 border border-gray-400 transform -rotate-45"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Dots indicator */}
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Navigation Arrow Right */}
                                    <Button variant="ghost" size="icon" className="self-center">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    {/* Car Details */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-semibold">{car.name}</h3>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Ratings:</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className="h-4 w-4 text-gray-300" />
                                                    ))}
                                                    <span className="text-gray-500 ml-2">No ratings yet</span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-medium">No. of rides:</span>
                                                <div className="mt-1">{car.rides}</div>
                                            </div>

                                            <div>
                                                <span className="font-medium">Price:</span>
                                                <div className="mt-1 font-semibold">{car.price}</div>
                                            </div>

                                            <div>
                                                <span className="font-medium">Locations:</span>
                                                <div className="mt-1 text-blue-600">{car.location}</div>
                                            </div>

                                            <div>
                                                <span className="font-medium">Status:</span>
                                                <div className="mt-1">
                                                    <Badge
                                                        variant={
                                                            car.status === "Stopped"
                                                                ? "destructive"
                                                                : car.status === "Available"
                                                                    ? "default"
                                                                    : "secondary"
                                                        }
                                                        className={
                                                            car.status === "Stopped"
                                                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                                : car.status === "Available"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                    : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                        }
                                                    >
                                                        {car.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                            View details
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                            Confirm deposit
                                        </Button>
                                        {car.status === "Booked" && (
                                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                                Confirm payment
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            {"<<<"}
                        </Button>
                        <Button variant="ghost" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                            1
                        </Button>
                        <Button variant="ghost" size="sm">
                            2
                        </Button>
                        <Button variant="ghost" size="sm">
                            3
                        </Button>
                        <Button variant="ghost" size="sm">
                            4
                        </Button>
                        <span className="mx-2">...</span>
                        <Button variant="ghost" size="sm">
                            {">>>"}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select defaultValue="20">
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">per page</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
