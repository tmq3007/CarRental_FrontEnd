"use client"

import FeaturesSection from "./features-section"
import CarTypesCarousel from "./car-types-section"
import TestimonialsSection from "./testimonials-section"
import HeroSearchSection from "./hero-search"

export default function CustomerHomepageLayout() {
  return (
    <div className="min-h-screen bg-gray-300">
      <HeroSearchSection/>
      <FeaturesSection />
      <CarTypesCarousel />
      <TestimonialsSection />
    </div>
  )
}
