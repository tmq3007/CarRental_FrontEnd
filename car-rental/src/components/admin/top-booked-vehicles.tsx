import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, TrendingUp } from "lucide-react"

const topBookedVehicles = [
    {
        id: "CAR001",
        make: "Tesla",
        model: "Model 3",
        year: "2023",
        totalBookings: 45,
        revenue: "$13,500",
        utilizationRate: "92%",
        status: "available",
        trend: "+15%",
    },
    {
        id: "CAR002",
        make: "BMW",
        model: "X5",
        year: "2022",
        totalBookings: 38,
        revenue: "$17,100",
        utilizationRate: "85%",
        status: "rented",
        trend: "+8%",
    },
    {
        id: "CAR003",
        make: "Mercedes",
        model: "C-Class",
        year: "2022",
        totalBookings: 32,
        revenue: "$12,160",
        utilizationRate: "78%",
        status: "available",
        trend: "+12%",
    },
    {
        id: "CAR004",
        make: "Audi",
        model: "A4",
        year: "2023",
        totalBookings: 28,
        revenue: "$8,960",
        utilizationRate: "71%",
        status: "maintenance",
        trend: "+5%",
    },
    {
        id: "CAR005",
        make: "Honda",
        model: "Civic",
        year: "2021",
        totalBookings: 25,
        revenue: "$4,500",
        utilizationRate: "68%",
        status: "available",
        trend: "+3%",
    },
]

export function TopBookedVehicles() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Top Most Booked Vehicles
                </CardTitle>
                <CardDescription>Vehicles ranked by total bookings this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topBookedVehicles.map((vehicle, index) => (
                        <div key={vehicle.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">
                                        {vehicle.make} {vehicle.model} ({vehicle.year})
                                    </p>
                                    <Badge
                                        variant={
                                            vehicle.status === "available"
                                                ? "secondary"
                                                : vehicle.status === "rented"
                                                    ? "default"
                                                    : "destructive"
                                        }
                                    >
                                        {vehicle.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{vehicle.totalBookings} bookings</span>
                                    <span>{vehicle.revenue} revenue</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Utilization: {vehicle.utilizationRate}</span>
                                    <span className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                                        {vehicle.trend}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
