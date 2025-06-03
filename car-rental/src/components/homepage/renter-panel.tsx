"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MapPin, Car, Users, Star, Clock, Shield, Zap, Award, CheckCircle, ArrowRight } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface RenterPanelProps {
  isTransitioning: boolean
  selectedPanel: "left" | "right" | null
  isVisible: boolean
  carsCount: number
  usersCount: number
  leftHovered: boolean
  setLeftHovered: Dispatch<SetStateAction<boolean>>
  handlePanelSelect: (panel: "left" | "right", targetUrl: string) => void
  getPanelStyles: (panel: "left" | "right") => React.CSSProperties
}

export default function RenterPanel({
  isTransitioning,
  selectedPanel,
  isVisible,
  carsCount,
  usersCount,
  leftHovered,
  setLeftHovered,
  handlePanelSelect,
  getPanelStyles,
}: RenterPanelProps) {
  return (
    <div
      className={`p-6 md:p-8 lg:p-12 flex flex-col justify-center group relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isTransitioning ? "pointer-events-none" : "cursor-pointer"
      }`}
      style={getPanelStyles("left")}
      onMouseEnter={() => !isTransitioning && setLeftHovered(true)}
      onMouseLeave={() => !isTransitioning && setLeftHovered(false)}
    >
      <div
        className={`transform transition-all duration-700 ${
          leftHovered && !isTransitioning ? "scale-105 rotate-1" : "scale-100"
        } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* Stats */}
        <div
          className={`flex flex-wrap items-center gap-4 mb-8 transition-all duration-500 ${
            isTransitioning && selectedPanel === "left" ? "animate-fade-in-up" : ""
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
            isTransitioning && selectedPanel === "left" ? "animate-fade-in-up" : ""
          }`}
        >
          <div
            className={`p-3 bg-gradient-to-r from-[#358004] to-green-600 rounded-full transition-all duration-500 ${
              leftHovered && !isTransitioning ? "scale-110" : ""
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
                    leftHovered && !isTransitioning ? `animate-bounce delay-${i * 100}` : ""
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
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight transition-all duration-700 delay-200 ${
            leftHovered && !isTransitioning ? "animate-pulse" : ""
          } ${isTransitioning && selectedPanel === "left" ? "animate-fade-in-up" : ""}`}
        >
          <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
            Looking for a vehicle?
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-lg text-gray-200 mb-8 leading-relaxed transition-all duration-500 delay-300 ${
            leftHovered && !isTransitioning ? "text-white scale-105" : ""
          } ${isTransitioning && selectedPanel === "left" ? "animate-fade-in-up" : ""}`}
        >
          Choose between <span className="text-[#358004] font-bold text-xl animate-pulse">{carsCount}+</span> verified
          private cars
          <br />
          at <span className="text-green-400 font-semibold">unbeatable prices</span> with
          <span className="text-blue-400 font-semibold"> instant booking!</span>
        </p>

        {/* CTA Button */}
        <div
          className={`mb-6 transition-all duration-500 delay-400 ${
            isTransitioning && selectedPanel === "left" ? "animate-fade-in-up" : ""
          }`}
        >
          <Button
            onClick={() => handlePanelSelect("left", "/search")}
            disabled={isTransitioning}
            className={`group bg-gradient-to-r from-[#358004] via-green-500 to-[#358004] hover:from-green-600 hover:via-[#358004] hover:to-green-600 text-white px-8 py-6 h-auto flex items-center gap-3 text-lg font-bold rounded-2xl shadow-2xl shadow-[#358004]/50 transition-all duration-500 hover:shadow-[#358004]/70 hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              leftHovered && !isTransitioning ? "animate-bounce-subtle" : ""
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
            isTransitioning && selectedPanel === "left" ? "animate-fade-in-up" : ""
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
  )
}
