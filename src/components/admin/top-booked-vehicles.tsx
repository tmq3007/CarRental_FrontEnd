import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, TrendingUp } from "lucide-react"
import {useGetDashboardStatsQuery, useGetTopBookedVehiclesQuery} from "@/lib/services/dashboard-api";

export function TopBookedVehicles() {
    const {data, isLoading} = useGetTopBookedVehiclesQuery();

    if (isLoading || !data?.data) {
        return <p>Loading dashboard stats...</p>;
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Top Most Booked Vehicles
                </CardTitle>
                <CardDescription>Vehicles ranked by total bookings this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.data.map((vehicle, index) => (
                        <div key={vehicle.carId} className="flex items-center space-x-4 p-3 rounded-lg border">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">
                                        {vehicle.brand} {vehicle.model} ({vehicle.year})
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
                                <div className="flex md:flex-row flex-col items-start md:items-center justify-between text-sm text-muted-foreground">
                                    <span>{vehicle.totalBookings} bookings</span>
                                    <span>{vehicle.revenue}VND revenue</span>
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
