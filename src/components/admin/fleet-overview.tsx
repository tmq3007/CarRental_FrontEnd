import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Plus, Settings } from "lucide-react"

const fleetData = [
    {
        id: "CAR001",
        make: "Tesla",
        model: "Model 3",
        year: "2023",
        status: "available",
        location: "Downtown",
        mileage: "15,420",
        image: "/placeholder.svg?height=80&width=120",
    },
    {
        id: "CAR002",
        make: "BMW",
        model: "X5",
        year: "2022",
        status: "rented",
        location: "Airport",
        mileage: "28,350",
        image: "/placeholder.svg?height=80&width=120",
    },
    {
        id: "CAR003",
        make: "Audi",
        model: "A4",
        year: "2023",
        status: "maintenance",
        location: "Service Center",
        mileage: "12,100",
        image: "/placeholder.svg?height=80&width=120",
    },
    {
        id: "CAR004",
        make: "Mercedes",
        model: "C-Class",
        year: "2022",
        status: "available",
        location: "Mall",
        mileage: "22,800",
        image: "/placeholder.svg?height=80&width=120",
    },
    {
        id: "CAR005",
        make: "Honda",
        model: "Civic",
        year: "2021",
        status: "rented",
        location: "Downtown",
        mileage: "45,200",
        image: "/placeholder.svg?height=80&width=120",
    },
    {
        id: "CAR006",
        make: "Toyota",
        model: "Camry",
        year: "2023",
        status: "available",
        location: "Airport",
        mileage: "8,900",
        image: "/placeholder.svg?height=80&width=120",
    },
]

export function FleetOverview() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Fleet Overview
                    </CardTitle>
                    <CardDescription>Manage your vehicle fleet and track availability</CardDescription>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fleetData.map((car) => (
                        <Card key={car.id} className="relative">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold">
                                            {car.make} {car.model}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {car.year} • {car.id}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            car.status === "available" ? "secondary" : car.status === "rented" ? "default" : "destructive"
                                        }
                                    >
                                        {car.status}
                                    </Badge>
                                </div>

                                <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                                    <Car className="h-8 w-8 text-muted-foreground" />
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span>{car.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mileage:</span>
                                        <span>{car.mileage} mi</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        View Details
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
