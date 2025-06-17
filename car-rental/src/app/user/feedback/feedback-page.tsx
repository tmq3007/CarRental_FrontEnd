import { Button } from "@/components/ui/button"
import { Star, User, ChevronDown, Car } from "lucide-react"

export default function Component() {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))
    }

    const feedbackData = [
        {
            id: 1,
            user: "User 1234",
            rating: 5,
            date: "02/02/2022 08:30",
            feedback:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula placerat faucibus. Sed convallis tempus rhoncus. Sed adipiscing est.",
            car: "Nissan Navara El 2017",
            rentalFrom: "13/02/2022 - 12:00 PM",
            rentalTo: "23/02/2022 - 14:00 PM",
        },
        {
            id: 2,
            user: "User 1234",
            rating: 5,
            date: "02/02/2022 08:30",
            feedback:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula placerat faucibus. Sed convallis tempus rhoncus. Sed adipiscing est.",
            car: "Nissan Navara El 2017",
            rentalFrom: "13/02/2022 - 12:00 PM",
            rentalTo: "23/02/2022 - 14:00 PM",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gray-600 text-white p-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Car className="w-6 h-6" />
                        <span className="text-lg font-semibold">Rent a car today!</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white hover:text-gray-200">
                            ABOUT US
                        </Button>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Welcome, An</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-white border-b px-4 py-2">
                <div className="max-w-6xl mx-auto text-sm text-gray-600">Home {">"} My Reports</div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Header Section */}
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Feedback</h1>
                        <h2 className="text-lg text-gray-600 mb-6">Average Ratings</h2>

                        {/* Average Rating Display */}
                        <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-gray-800 mb-2">4.25</div>
                            <div className="flex justify-center gap-1 mb-4">{renderStars(4)}</div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Details</h3>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200">
                                    All
                                </Button>
                                <Button variant="outline" size="sm">
                                    5 Stars
                                    <span className="ml-1 text-xs">(100)</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                    4 Stars
                                    <span className="ml-1 text-xs">(50)</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                    3 Stars
                                    <span className="ml-1 text-xs">(25)</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                    2 Stars
                                    <span className="ml-1 text-xs">(10)</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                    1 Star
                                    <span className="ml-1 text-xs">(5)</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Feedback List */}
                    <div className="divide-y">
                        {feedbackData.map((feedback) => (
                            <div key={feedback.id} className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* User Avatar */}


                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-800">{feedback.user}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">{renderStars(feedback.rating)}</div>
                                                <span className="text-sm text-gray-500">{feedback.date}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-4">{feedback.feedback}</p>

                                        {/* Car Details */}
                                        <div className="flex gap-4">
                                            <div className="w-32 h-20 bg-gray-100 rounded border flex items-center justify-center">
                                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                                                    <Car className="w-8 h-8 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800 mb-2">{feedback.car}</h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <div>
                                                        <span className="font-medium">From:</span> {feedback.rentalFrom}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">To:</span> {feedback.rentalTo}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">RENT CARS</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>Search Cars and Rates</li>
                                <li>My Wallet</li>
                                <li>My Car</li>
                                <li>Log In</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">CUSTOMER ACCESS</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>Manage My Booking</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">JOIN US</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>New User Sign Up</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
