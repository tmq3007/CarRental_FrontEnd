import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Users, Crown, Mail, Calendar} from "lucide-react"
import {useGetTopPayingCustomersQuery} from "@/lib/services/dashboard-api";

export function TopPayingCustomers() {
    const {data, isLoading} = useGetTopPayingCustomersQuery();

    if (isLoading || !data?.data) {
        return <p>Loading dashboard stats...</p>;
    }

    return (
        <Card>
            <CardHeader className="flex md:flex-row flex-col items-start md:items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5"/>
                        Top Paying Customers
                    </CardTitle>
                    <CardDescription>Customers ranked by total payments and loyalty</CardDescription>
                </div>
                <Button variant="outline">View All Customers</Button>
            </CardHeader>
            <CardContent>
                {data.data.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No customer found</span>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.data.map((customer, index) => (
                            <Card key={customer.accountId} className="relative">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {index === 0 && <Crown className="h-4 w-4 text-yellow-500"/>}
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={customer.avatar || "/placeholder.svg"}
                                                             alt={customer.customerName}/>
                                                <AvatarFallback>
                                                    {customer.customerName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-sm">{customer.customerName}</h3>
                                                <p className="text-xs text-muted-foreground">Member
                                                    since {customer.memberSince}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Total Payments</span>
                                            <span
                                                className="text-lg font-bold text-green-600">{customer.totalPayments}</span>
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
                                                <Mail className="h-3 w-3 mr-1"/>
                                                Contact
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 h-8">
                                                <Calendar className="h-3 w-3 mr-1"/>
                                                History
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
