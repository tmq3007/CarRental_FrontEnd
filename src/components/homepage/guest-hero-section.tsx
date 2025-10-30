"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import RenterPanel from "@/components/homepage/renter-panel"
import CarOwnerPanel from "@/components/homepage/car-owner-panel"
import { Star } from "lucide-react"


interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  opacity: number
  direction: number
}

interface TransitionState {
  isTransitioning: boolean
  selectedPanel: "left" | "right" | null
  stage: "idle" | "animating" | "focused" | "navigating"
}

export default function AnimatedDualPurposeHeroPage() {
  const router = useRouter()
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [leftHovered, setLeftHovered] = useState(false)
  const [rightHovered, setRightHovered] = useState(false)
  const [carsCount, setCarsCount] = useState(0)
  const [usersCount, setUsersCount] = useState(0)
  const [earningsCount, setEarningsCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentRenterTestimonial, setCurrentRenterTestimonial] = useState(0)

  // Transition state management
  const [transition, setTransition] = useState<TransitionState>({
    isTransitioning: false,
    selectedPanel: null,
    stage: "idle",
  })

  const ownerTestimonials = useMemo(
    () => [
      { text: "Found my perfect car in minutes!", author: "Sarah M.", rating: 5 },
      { text: "Earning $600+ monthly from my car", author: "Mike R.", rating: 5 },
      { text: "Best car rental experience ever", author: "Emma L.", rating: 5 },
      { text: "Super easy to list and earn money", author: "David K.", rating: 5 },
    ],
    [],
  )

  const renterTestimonials = useMemo(
    () => [
      { text: "Amazing selection of cars!", author: "John D.", rating: 5 },
      { text: "Saved so much money on rentals", author: "Lisa K.", rating: 5 },
      { text: "Quick and easy booking process", author: "Tom W.", rating: 5 },
      { text: "Great customer service support", author: "Anna P.", rating: 5 },
    ],
    [],
  )

  const stats = useMemo(
    () => ({
      cars: { target: 300, increment: 3, interval: 40 },
      users: { target: 50000, increment: 800, interval: 25 },
      earnings: { target: 500, increment: 8, interval: 35 },
    }),
    [],
  )

  // Intersection Observer for entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 })
    const heroElement = document.getElementById("hero-section")
    if (heroElement) observer.observe(heroElement)
    return () => observer.disconnect()
  }, [])

  // Animated counters
  useEffect(() => {
    if (!isVisible) return

    const animateCounter = (
      setter: React.Dispatch<React.SetStateAction<number>>,
      target: number,
      increment: number,
      interval: number,
      delay = 0,
    ) => {
      setTimeout(() => {
        const timer = setInterval(() => {
          setter((prev) => {
            const next = prev + increment
            return next >= target ? target : next
          })
        }, interval)
        setTimeout(() => clearInterval(timer), (target / increment) * interval + 100)
      }, delay)
    }

    animateCounter(setCarsCount, stats.cars.target, stats.cars.increment, stats.cars.interval, 0)
    animateCounter(setUsersCount, stats.users.target, stats.users.increment, stats.users.interval, 200)
    animateCounter(setEarningsCount, stats.earnings.target, stats.earnings.increment, stats.earnings.interval, 400)
  }, [isVisible, stats])

  // Particle system
  useEffect(() => {
    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
      y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
      size: Math.random() * 3 + 1,
      color: ["#358004", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"][Math.floor(Math.random() * 5)],
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      direction: Math.random() * 0.02 - 0.01,
    })

    const initialParticles = Array.from({ length: 25 }, createParticle)
    setParticles(initialParticles)

    let animationFrame: number
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          const newY = particle.y - particle.speed
          const newX = particle.x + Math.sin(newY * 0.01) * 0.8 + particle.direction * 20

          if (newY < -50) return createParticle()

          return {
            ...particle,
            y: newY,
            x: newX,
            opacity: Math.max(0.1, particle.opacity - 0.001),
          }
        }),
      )
      animationFrame = requestAnimationFrame(animateParticles)
    }

    animationFrame = requestAnimationFrame(animateParticles)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Testimonial rotation for owners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % ownerTestimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [ownerTestimonials.length])

  // Testimonial rotation for renters
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRenterTestimonial((prev) => (prev + 1) % renterTestimonials.length)
    }, 3500) // Slightly different timing to avoid sync
    return () => clearInterval(interval)
  }, [renterTestimonials.length])

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (transition.isTransitioning) return
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [transition.isTransitioning],
  )

  // Panel selection and animation handler
  const handlePanelSelect = useCallback(
    (panel: "left" | "right", targetUrl: string) => {
      if (transition.isTransitioning) return

      setTransition({
        isTransitioning: true,
        selectedPanel: panel,
        stage: "animating",
      })

      // Stage 1: Start animation (0-600ms)
      setTimeout(() => {
        setTransition((prev) => ({
          ...prev,
          stage: "focused",
        }))
      }, 600)

      // Stage 2: Navigate (after 1200ms total)
      setTimeout(() => {
        setTransition((prev) => ({
          ...prev,
          stage: "navigating",
        }))

        // Navigate to target page
        console.log(`Would navigate to: ${targetUrl}`)
        router.push(targetUrl) // Commented out for demo
      }, 1200)
    },
    [transition.isTransitioning],
  )

  // Reset transition
  const handleReset = useCallback(() => {
    setTransition({
      isTransitioning: false,
      selectedPanel: null,
      stage: "idle",
    })
  }, [])

  // Get panel transform styles
  const getPanelStyles = (panel: "left" | "right") => {
    if (!transition.isTransitioning) return {}

    const isSelected = transition.selectedPanel === panel
    const isUnselected = transition.selectedPanel !== panel

    if (transition.stage === "animating" || transition.stage === "focused") {
      if (isSelected) {
        return {
          transform: "translateX(0) translateY(-5vh) scale(1.05)",
          zIndex: 50,
          opacity: 1,
        }
      } else if (isUnselected) {
        const slideDirection = panel === "left" ? "-100%" : "100%"
        return {
          transform: `translateX(${slideDirection}) scale(0.9)`,
          opacity: 0,
          filter: "blur(8px)",
        }
      }
    }

    return {}
  }

  return (
    <section id="hero-section" className="relative overflow-hidden pt-8" onMouseMove={handleMouseMove}>
      {/* Background with transition effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        {/* Transition overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-700 ${
            transition.isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#358004]/10 via-transparent to-blue-600/10 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />

        {/* Mouse follower */}
        <div
          className={`absolute w-96 h-96 bg-gradient-radial from-[#358004]/20 via-blue-500/10 to-transparent rounded-full blur-3xl transition-all duration-500 pointer-events-none ${
            transition.isTransitioning ? "opacity-30" : "opacity-100"
          }`}
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: `scale(${leftHovered || rightHovered ? 1.2 : 1})`,
          }}
        />
      </div>

      {/* Floating particles */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${
          transition.isTransitioning ? "opacity-30" : "opacity-100"
        }`}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full transition-opacity duration-1000"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Floating elements */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${
          transition.isTransitioning ? "opacity-20" : "opacity-100"
        }`}
      >
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#358004]/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-500/20 rounded-full blur-lg animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500/15 rounded-full blur-xl animate-float-slow" />
        <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-yellow-400/20 rounded-full blur-lg animate-pulse" />

        {/* Floating testimonial for car owners (right side) - Better positioning */}
        <div className="absolute top-16 right-8 xl:right-16 transform transition-all duration-1000 hidden xl:block max-w-xs">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 animate-float">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(ownerTestimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-white text-xs mb-1 leading-relaxed">"{ownerTestimonials[currentTestimonial]?.text}"</p>
            <p className="text-gray-300 text-xs">- {ownerTestimonials[currentTestimonial]?.author}</p>
          </div>
        </div>

        {/* Floating testimonial for renters (left side) - Better positioning */}
        <div className="absolute top-20 left-8 xl:left-16 transform transition-all duration-1000 hidden xl:block max-w-xs">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 animate-float-delayed">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(renterTestimonials[currentRenterTestimonial]?.rating || 5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-white text-xs mb-1 leading-relaxed">
              "{renterTestimonials[currentRenterTestimonial]?.text}"
            </p>
            <p className="text-gray-300 text-xs">- {renterTestimonials[currentRenterTestimonial]?.author}</p>
          </div>
        </div>
      </div>

      {/* Reset button during transition */}
      {transition.isTransitioning && (
        <button
          onClick={handleReset}
          className="fixed top-6 right-6 z-[60] p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="container mx-auto relative z-10 px-4  flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative">
          {/* "OR" divider - Hidden on mobile, shown on desktop */}
          <div
            className={`hidden lg:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 z-10 ${
              transition.isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#358004]/30 via-blue-500/30 to-purple-600/30 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-white font-bold text-lg">OR</span>
            </div>
          </div>

          {/* Mobile "OR" divider - Shown between panels on mobile */}
          <div
            className={`lg:hidden flex justify-center items-center py-4 transition-opacity duration-700 ${
              transition.isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#358004]/30 via-blue-500/30 to-purple-600/30 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-white font-bold text-sm">OR</span>
            </div>
          </div>

          {/* Left Panel - For Renters */}
          <div className="flex justify-center items-center order-1 lg:order-1">
            <div className="w-full max-w-lg">
              <RenterPanel
                isTransitioning={transition.isTransitioning}
                selectedPanel={transition.selectedPanel}
                isVisible={isVisible}
                carsCount={carsCount}
                usersCount={usersCount}
                leftHovered={leftHovered}
                setLeftHovered={setLeftHovered}
                handlePanelSelect={handlePanelSelect}
                getPanelStyles={getPanelStyles}
              />
            </div>
          </div>

          {/* Right Panel - For Car Owners */}
          <div className="flex justify-center items-center order-3 lg:order-2">
            <div className="w-full max-w-lg">
              <CarOwnerPanel
                isTransitioning={transition.isTransitioning}
                selectedPanel={transition.selectedPanel}
                isVisible={isVisible}
                earningsCount={earningsCount}
                rightHovered={rightHovered}
                setRightHovered={setRightHovered}
                handlePanelSelect={handlePanelSelect}
                getPanelStyles={getPanelStyles}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

        /* Mobile-specific styles */
        @media (max-width: 1023px) {
          .grid {
            grid-template-rows: auto auto auto;
          }
        }
      `}</style>
    </section>
  )
}


