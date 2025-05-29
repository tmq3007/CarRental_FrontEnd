"use client"

import FeaturesSection from "./features-section"
import CarTypesSection from "./car-types-section"
import TestimonialsSection from "./testimonials-section"
import HeroSearchSection from "./hero-search"

export default function CustomerHomepageLayout() {
  return (
    <div className="min-h-screen bg-gray-300">
      {/* Hero Section */}
      <HeroSearchSection/>
      <FeaturesSection />
      <CarTypesSection />
      <TestimonialsSection />
    </div>
  )
}
