import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentBookings = [
    {
        id: "BK001",
        customer: "John Doe",
        email: "john@example.com",
        car: "Tesla Model 3",
        status: "active",
        amount: "$299",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "BK002",
        customer: "Sarah Wilson",
        email: "sarah@example.com",
        car: "BMW X5",
        status: "completed",
        amount: "$450",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "BK003",
        customer: "Mike Johnson",
        email: "mike@example.com",
        car: "Audi A4",
        status: "pending",
        amount: "$320",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "BK004",
        customer: "Emily Brown",
        email: "emily@example.com",
        car: "Mercedes C-Class",
        status: "active",
        amount: "$380",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "BK005",
        customer: "David Lee",
        email: "david@example.com",
        car: "Honda Civic",
        status: "completed",
        amount: "$180",
        avatar: "/placeholder.svg?height=32&width=32",
    },
]

export function RecentBookings() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest rental bookings from customers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-4">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.customer} />
                                <AvatarFallback>
                                    {booking.customer
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{booking.customer}</p>
                                <p className="text-sm text-muted-foreground">{booking.car}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={
                                        booking.status === "active" ? "default" : booking.status === "completed" ? "secondary" : "outline"
                                    }
                                >
                                    {booking.status}
                                </Badge>
                                <div className="font-medium">{booking.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
