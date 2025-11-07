"use client"

import FeaturesSection from "./features-section"
import CarTypesCarousel from "./car-types-section"
import TestimonialsSection from "./testimonials-section"

export default function CarOwnerHomepageLayout() {
  return (
    <div className="min-h-screen bg-gray-300">
      <FeaturesSection />
      <CarTypesCarousel />
      <TestimonialsSection />
    </div>
  )
}
