import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Car, Calendar, Users, DollarSign, TrendingUp, TrendingDown} from "lucide-react"
import {useGetDashboardStatsQuery} from "@/lib/services/dashboard-api";

export function StatsCards() {
    const {data, isLoading} = useGetDashboardStatsQuery();

    if (isLoading || !data?.data) {
        return <p>Loading dashboard stats...</p>;
    }

    const stats = [
        {
            title: "Total Revenue",
            value: `${data.data.totalRevenue.toLocaleString()}VND`,
            change: data.data.revenueChange,
            icon: DollarSign,
            trend: data.data.revenueChange.includes('-') ? 'down' : 'up',
        },
        {
            title: "Active Bookings",
            value: data.data.activeBookings.toString(),
            change: data.data.bookingsChange,
            icon: Calendar,
            trend: data.data.bookingsChange.includes('-') ? 'down' : 'up',
        },
        {
            title: "Total Customers",
            value: data.data.totalCustomers.toString(),
            change: data.data.customersChange,
            icon: Users,
            trend: data.data.customersChange.includes('-') ? 'down' : 'up',
        },
        {
            title: "Fleet Utilization",
            value: `${data.data.fleetUtilization.toFixed(2)}%`,
            change: data.data.utilizationChange,
            icon: Car,
            trend: data.data.utilizationChange.includes('-') ? 'down' : 'up',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {stat.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-green-500"/>
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-500"/>
                            )}
                            {stat.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

