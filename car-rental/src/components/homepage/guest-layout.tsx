"use client"

import FeaturesSection from "./features-section"
import CarTypesCarousel from "./car-types-section"
import TestimonialsSection from "./testimonials-section"
import DualPurposeHero from "./guest-hero-section"

export default function GuestHomepageLayout() {
  return (
    <div className="min-h-screen bg-gray-300">
      <DualPurposeHero />
      <FeaturesSection />
      <CarTypesCarousel />
      <TestimonialsSection />
    </div>
  )
}
