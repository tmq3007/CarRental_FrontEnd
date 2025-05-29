"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Los Angeles, CA",
    rating: 5,
    comment:
      "Excellent service! The car was clean, well-maintained, and the booking process was seamless. Highly recommended!",
    date: "2 weeks ago",
  },
  {
    name: "Michael Chen",
    location: "San Francisco, CA",
    rating: 5,
    comment:
      "Great value for money. The staff was friendly and helpful. Will definitely use their service again for my next trip.",
    date: "1 month ago",
  },
  {
    name: "Emily Rodriguez",
    location: "San Diego, CA",
    rating: 5,
    comment:
      "Perfect for our family vacation. The SUV was spacious and comfortable. The pickup and drop-off process was very convenient.",
    date: "3 weeks ago",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>

                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                  <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
