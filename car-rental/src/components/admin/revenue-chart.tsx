"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {useGetMonthlyRevenueQuery} from "@/lib/services/dashboard-api";

export function RevenueChart() {
    const {data, isLoading} = useGetMonthlyRevenueQuery();

    if (isLoading || !data) {
        return <p>Loading dashboard stats...</p>;
    }

    return (
        <Card className="md:col-span-5 col-span-2 flex flex-col">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pl-1">
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <BarChart data={data.data}>
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                width={100}
                                axisLine={false}
                                ticks={[0, 1000000, 2500000, 5000000, 7500000, 10000000]}
                                tickFormatter={(value) => {
                                    // Custom formatting - you can modify this logic as needed
                                    if (value >= 1000000) {
                                        return `${(value / 1000000).toFixed(1)}M VND`
                                    } else if (value >= 1000) {
                                        return `${(value / 1000).toFixed(0)}K VND`
                                    } else {
                                        return `${value} VND`
                                    }}}
                            />
                            <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} labelStyle={{ color: "#000" }} />
                            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
