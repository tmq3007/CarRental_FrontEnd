"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const carTypes = [
  {
    title: "Economy Cars",
    description: "Perfect for city driving and budget-conscious travelers",
    price: "From $25/day",
    features: ["Fuel Efficient", "Easy Parking", "Affordable"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "SUVs & 4WDs",
    description: "Ideal for family trips and off-road adventures",
    price: "From $55/day",
    features: ["Spacious", "All-Terrain", "Family Friendly"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Luxury Vehicles",
    description: "Premium cars for special occasions and business travel",
    price: "From $95/day",
    features: ["Premium Comfort", "Latest Technology", "Professional"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Vans & Minivans",
    description: "Perfect for group travel and moving large items",
    price: "From $65/day",
    features: ["High Capacity", "Group Travel", "Cargo Space"],
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function CarTypesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vehicle Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From compact cars to luxury vehicles, we have the perfect car for every occasion and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carTypes.map((carType, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={carType.image || "/placeholder.svg"} alt={carType.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{carType.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{carType.description}</p>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-green-600 mb-2">{carType.price}</p>
                  <ul className="space-y-1">
                    {carType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">View Cars</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
