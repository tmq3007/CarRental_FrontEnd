"use client"

import { Car, Shield, Clock, MapPin, Users, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Car,
    title: "Wide Selection",
    description: "Choose from over 300 vehicles including economy, luxury, and specialty cars",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "All our vehicles come with comprehensive insurance coverage for your peace of mind",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you whenever you need help",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "Pick up and drop off locations available across the country",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    description: "Over 50,000 satisfied customers have chosen our rental services",
  },
  {
    icon: Star,
    title: "Premium Service",
    description: "High-quality vehicles maintained to the highest standards",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Car Rental Service?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide reliable, affordable, and convenient car rental solutions for all your transportation needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
