"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Car,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  Clock,
  Shield,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

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

export default function AnimatedDualPurposeHero() {
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

  // Transition state management
  const [transition, setTransition] = useState<TransitionState>({
    isTransitioning: false,
    selectedPanel: null,
    stage: "idle",
  })

  const testimonials = useMemo(
    () => [
      { text: "Found my perfect car in minutes!", author: "Sarah M.", rating: 5 },
      { text: "Earning $600+ monthly from my car", author: "Mike R.", rating: 5 },
      { text: "Best car rental experience ever", author: "Emma L.", rating: 5 },
      { text: "Super easy to list and earn money", author: "David K.", rating: 5 },
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

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

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
        router.push(targetUrl)
      }, 1200)
    },
    [transition.isTransitioning, router],
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
    <section id="hero-section" className="relative overflow-hidden" onMouseMove={handleMouseMove}>
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

        {/* Floating testimonial */}
        <div className="absolute top-1/4 right-10 transform transition-all duration-1000">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 animate-float">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-white text-xs mb-1">"{testimonials[currentTestimonial]?.text}"</p>
            <p className="text-gray-300 text-xs">- {testimonials[currentTestimonial]?.author}</p>
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

      <div className="container mx-auto relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen relative">
          {/* Animated divider */}
          <div
            className={`hidden lg:block absolute top-0 bottom-0 left-1/2 w-1 transform -translate-x-1/2 transition-opacity duration-700 ${
              transition.isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-full bg-gradient-to-b from-[#358004] via-blue-500 to-purple-600 animate-pulse shadow-2xl shadow-[#358004]/30 rounded-full" />
          </div>

          {/* Left Panel - For Renters */}
          <div
            className={`p-6 md:p-12 lg:p-16 flex flex-col justify-center group relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              transition.isTransitioning ? "pointer-events-none" : "cursor-pointer"
            }`}
            style={getPanelStyles("left")}
            onMouseEnter={() => !transition.isTransitioning && setLeftHovered(true)}
            onMouseLeave={() => !transition.isTransitioning && setLeftHovered(false)}
          >
            <div
              className={`transform transition-all duration-700 ${
                leftHovered && !transition.isTransitioning ? "scale-105 rotate-1" : "scale-100"
              } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              {/* Stats */}
              <div
                className={`flex flex-wrap items-center gap-4 mb-8 transition-all duration-500 ${
                  transition.isTransitioning && transition.selectedPanel === "left" ? "animate-fade-in-up" : ""
                }`}
              >
                <div className="flex items-center gap-2 bg-[#358004]/20 px-4 py-3 rounded-full backdrop-blur-md border border-[#358004]/30 hover:bg-[#358004]/30 transition-all duration-300">
                  <Car className="w-5 h-5 text-[#358004]" />
                  <span className="text-[#358004] font-bold text-xl tabular-nums">{carsCount}+</span>
                  <span className="text-white text-sm font-medium">Cars</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-3 rounded-full backdrop-blur-md border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-bold text-xl tabular-nums">{usersCount.toLocaleString()}+</span>
                  <span className="text-white text-sm font-medium">Users</span>
                </div>
              </div>

              {/* Rating */}
              <div
                className={`flex items-center gap-4 mb-6 transition-all duration-500 delay-100 ${
                  transition.isTransitioning && transition.selectedPanel === "left" ? "animate-fade-in-up" : ""
                }`}
              >
                <div
                  className={`p-3 bg-gradient-to-r from-[#358004] to-green-600 rounded-full transition-all duration-500 ${
                    leftHovered && !transition.isTransitioning ? "animate-spin-slow scale-110" : ""
                  }`}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 text-yellow-400 fill-current transition-all duration-300 ${
                          leftHovered && !transition.isTransitioning ? `animate-bounce delay-${i * 100}` : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">4.9/5</span>
                  <span className="text-gray-300 text-sm">(2,847 reviews)</span>
                </div>
              </div>

              {/* Heading */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-700 delay-200 ${
                  leftHovered && !transition.isTransitioning ? "animate-pulse" : ""
                } ${transition.isTransitioning && transition.selectedPanel === "left" ? "animate-fade-in-up" : ""}`}
              >
                <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
                  Looking for a vehicle?
                </span>
              </h1>

              {/* Description */}
              <p
                className={`text-lg text-gray-200 mb-8 leading-relaxed transition-all duration-500 delay-300 ${
                  leftHovered && !transition.isTransitioning ? "text-white scale-105" : ""
                } ${transition.isTransitioning && transition.selectedPanel === "left" ? "animate-fade-in-up" : ""}`}
              >
                Choose between <span className="text-[#358004] font-bold text-xl animate-pulse">{carsCount}+</span>{" "}
                verified private cars
                <br />
                at <span className="text-green-400 font-semibold">unbeatable prices</span> with
                <span className="text-blue-400 font-semibold"> instant booking!</span>
              </p>

              {/* CTA Button */}
              <div
                className={`mb-6 transition-all duration-500 delay-400 ${
                  transition.isTransitioning && transition.selectedPanel === "left" ? "animate-fade-in-up" : ""
                }`}
              >
                <Button
                  onClick={() => handlePanelSelect("left", "/search")}
                  disabled={transition.isTransitioning}
                  className={`group bg-gradient-to-r from-[#358004] via-green-500 to-[#358004] hover:from-green-600 hover:via-[#358004] hover:to-green-600 text-white px-8 py-6 h-auto flex items-center gap-3 text-lg font-bold rounded-2xl shadow-2xl shadow-[#358004]/50 transition-all duration-500 hover:shadow-[#358004]/70 hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    leftHovered && !transition.isTransitioning ? "animate-bounce-subtle" : ""
                  } bg-[length:200%_100%] animate-gradient-x`}
                >
                  <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  Find Your Perfect Car
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>

              {/* Features */}
              <div
                className={`grid grid-cols-2 gap-4 text-sm transition-all duration-500 delay-500 ${
                  transition.isTransitioning && transition.selectedPanel === "left" ? "animate-fade-in-up" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Fully Insured</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Best Prices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - For Car Owners */}
          <div
            className={`p-6 md:p-12 lg:p-16 flex flex-col justify-center border-t lg:border-t-0 border-gray-600 group relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              transition.isTransitioning ? "pointer-events-none" : "cursor-pointer"
            }`}
            style={getPanelStyles("right")}
            onMouseEnter={() => !transition.isTransitioning && setRightHovered(true)}
            onMouseLeave={() => !transition.isTransitioning && setRightHovered(false)}
          >
            <div
              className={`transform transition-all duration-700 ${
                rightHovered && !transition.isTransitioning ? "scale-105 rotate-1" : "scale-100"
              } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              {/* Earnings display */}
              <div
                className={`flex flex-wrap items-center gap-4 mb-8 transition-all duration-500 ${
                  transition.isTransitioning && transition.selectedPanel === "right" ? "animate-fade-in-up" : ""
                }`}
              >
                <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 px-4 py-3 rounded-full backdrop-blur-md border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300">
                  <span className="text-green-400 font-bold text-xl tabular-nums">${earningsCount}+</span>
                  <span className="text-white text-sm font-medium ml-2">Monthly Avg</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-3 rounded-full backdrop-blur-md border border-purple-500/30">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-bold">+25%</span>
                  <span className="text-white text-sm">Income Boost</span>
                </div>
              </div>

              {/* Icon section */}
              <div
                className={`flex items-center gap-4 mb-6 transition-all duration-500 delay-100 ${
                  transition.isTransitioning && transition.selectedPanel === "right" ? "animate-fade-in-up" : ""
                }`}
              >
                <div
                  className={`p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full transition-all duration-500 ${
                    rightHovered && !transition.isTransitioning ? "animate-spin-slow scale-110" : ""
                  } bg-[length:200%_100%] animate-gradient-x`}
                >
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  <span className="text-white font-semibold">Top Earner Platform</span>
                </div>
              </div>

              {/* Heading */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-700 delay-200 ${
                  rightHovered && !transition.isTransitioning ? "animate-pulse" : ""
                } ${transition.isTransitioning && transition.selectedPanel === "right" ? "animate-fade-in-up" : ""}`}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  Are you a car owner?
                </span>
              </h1>

              {/* Description */}
              <p
                className={`text-lg text-gray-200 mb-8 leading-relaxed transition-all duration-500 delay-300 ${
                  rightHovered && !transition.isTransitioning ? "text-white scale-105" : ""
                } ${transition.isTransitioning && transition.selectedPanel === "right" ? "animate-fade-in-up" : ""}`}
              >
                Transform your car into a{" "}
                <span className="text-green-400 font-bold animate-pulse">money-making asset</span>
                <br />
                and start earning <span className="text-blue-400 font-semibold">passive income</span>
                <span className="text-purple-400 font-semibold"> today!</span>
              </p>

              {/* CTA Button */}
              <div
                className={`mb-6 transition-all duration-500 delay-400 ${
                  transition.isTransitioning && transition.selectedPanel === "right" ? "animate-fade-in-up" : ""
                }`}
              >
                <Button
                  onClick={() => handlePanelSelect("right", "/list-your-car")}
                  disabled={transition.isTransitioning}
                  className={`group bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 hover:from-purple-600 hover:via-blue-500 hover:to-purple-600 text-white px-8 py-6 h-auto flex items-center gap-3 text-lg font-bold rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-500 hover:shadow-blue-500/70 hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    rightHovered && !transition.isTransitioning ? "animate-bounce-subtle" : ""
                  } bg-[length:200%_100%] animate-gradient-x`}
                >
                  <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                    <Car className="w-5 h-5" />
                  </div>
                  Start Earning Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>

              {/* Features */}
              <div
                className={`grid grid-cols-2 gap-4 text-sm transition-all duration-500 delay-500 ${
                  transition.isTransitioning && transition.selectedPanel === "right" ? "animate-fade-in-up" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>Passive Income</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Full Insurance</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Trusted Platform</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Quick Setup</span>
                </div>
              </div>
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
      `}</style>
    </section>
  )
}
