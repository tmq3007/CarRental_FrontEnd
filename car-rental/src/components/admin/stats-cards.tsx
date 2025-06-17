import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

const stats = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1% from last month",
        icon: DollarSign,
        trend: "up",
    },
    {
        title: "Active Bookings",
        value: "127",
        change: "+12% from last month",
        icon: Calendar,
        trend: "up",
    },
    {
        title: "Total Customers",
        value: "2,350",
        change: "+8.2% from last month",
        icon: Users,
        trend: "up",
    },
    {
        title: "Fleet Utilization",
        value: "78%",
        change: "-2.1% from last month",
        icon: Car,
        trend: "down",
    },
]

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {stat.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            {stat.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
