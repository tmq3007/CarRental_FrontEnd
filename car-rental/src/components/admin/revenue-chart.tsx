"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    { name: "Jan", total: 12000 },
    { name: "Feb", total: 19000 },
    { name: "Mar", total: 15000 },
    { name: "Apr", total: 25000 },
    { name: "May", total: 22000 },
    { name: "Jun", total: 30000 },
    { name: "Jul", total: 28000 },
    { name: "Aug", total: 35000 },
    { name: "Sep", total: 32000 },
    { name: "Oct", total: 38000 },
    { name: "Nov", total: 42000 },
    { name: "Dec", total: 45000 },
]

export function RevenueChart() {
    return (
        <Card className="col-span-4 flex flex-col">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pl-2">
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
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
