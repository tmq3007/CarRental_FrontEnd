import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Crown, Mail, Calendar } from "lucide-react"

const topPayingCustomers = [
    {
        id: "CUST001",
        name: "Robert Johnson",
        email: "robert.j@example.com",
        phone: "+1 (555) 123-4567",
        totalPayments: "$8,450",
        totalBookings: 12,
        memberSince: "2022",
        status: "VIP",
        lastBooking: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        preferredVehicle: "Tesla Model 3",
    },
    {
        id: "CUST002",
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        phone: "+1 (555) 987-6543",
        totalPayments: "$7,230",
        totalBookings: 15,
        memberSince: "2021",
        status: "Premium",
        lastBooking: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
        preferredVehicle: "BMW X5",
    },
    {
        id: "CUST003",
        name: "Michael Chen",
        email: "michael.c@example.com",
        phone: "+1 (555) 456-7890",
        totalPayments: "$6,890",
        totalBookings: 18,
        memberSince: "2023",
        status: "Gold",
        lastBooking: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        preferredVehicle: "Mercedes C-Class",
    },
    {
        id: "CUST004",
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "+1 (555) 321-0987",
        totalPayments: "$5,670",
        totalBookings: 9,
        memberSince: "2022",
        status: "Premium",
        lastBooking: "5 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        preferredVehicle: "Audi A4",
    },
    {
        id: "CUST005",
        name: "David Martinez",
        email: "david.m@example.com",
        phone: "+1 (555) 654-3210",
        totalPayments: "$4,920",
        totalBookings: 11,
        memberSince: "2023",
        status: "Gold",
        lastBooking: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
        preferredVehicle: "Honda Civic",
    },
    {
        id: "CUST006",
        name: "Lisa Thompson",
        email: "lisa.t@example.com",
        phone: "+1 (555) 789-0123",
        totalPayments: "$4,560",
        totalBookings: 7,
        memberSince: "2022",
        status: "Standard",
        lastBooking: "2 weeks ago",
        avatar: "/placeholder.svg?height=40&width=40",
        preferredVehicle: "Toyota Camry",
    },
]

export function TopPayingCustomers() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Top Paying Customers
                    </CardTitle>
                    <CardDescription>Customers ranked by total payments and loyalty</CardDescription>
                </div>
                <Button variant="outline">View All Customers</Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {topPayingCustomers.map((customer, index) => (
                        <Card key={customer.id} className="relative">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                                            <AvatarFallback>
                                                {customer.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-sm">{customer.name}</h3>
                                            <p className="text-xs text-muted-foreground">Member since {customer.memberSince}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            customer.status === "VIP"
                                                ? "default"
                                                : customer.status === "Premium"
                                                    ? "secondary"
                                                    : customer.status === "Gold"
                                                        ? "outline"
                                                        : "secondary"
                                        }
                                        className={
                                            customer.status === "VIP"
                                                ? "bg-purple-100 text-purple-800"
                                                : customer.status === "Gold"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : ""
                                        }
                                    >
                                        {customer.status}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Total Payments</span>
                                        <span className="text-lg font-bold text-green-600">{customer.totalPayments}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Bookings:</span>
                                            <span className="ml-1 font-medium">{customer.totalBookings}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Last:</span>
                                            <span className="ml-1 font-medium">{customer.lastBooking}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Preferred:</span>
                                        <span className="ml-1 font-medium">{customer.preferredVehicle}</span>
                                    </div>

                                    <div className="flex gap-1 pt-2">
                                        <Button variant="outline" size="sm" className="flex-1 h-8">
                                            <Mail className="h-3 w-3 mr-1" />
                                            Contact
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 h-8">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            History
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
