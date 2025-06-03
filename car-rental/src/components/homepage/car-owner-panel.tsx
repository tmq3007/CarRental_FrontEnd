"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Car, Sparkles, TrendingUp, Users, Shield, Zap, ArrowRight } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface CarOwnerPanelProps {
  isTransitioning: boolean
  selectedPanel: "left" | "right" | null
  isVisible: boolean
  earningsCount: number
  rightHovered: boolean
  setRightHovered: Dispatch<SetStateAction<boolean>>
  handlePanelSelect: (panel: "left" | "right", targetUrl: string) => void
  getPanelStyles: (panel: "left" | "right") => React.CSSProperties
}

export default function CarOwnerPanel({
  isTransitioning,
  selectedPanel,
  isVisible,
  earningsCount,
  rightHovered,
  setRightHovered,
  handlePanelSelect,
  getPanelStyles,
}: CarOwnerPanelProps) {
  return (
    <div
      className={`p-6 md:p-8 lg:p-12 flex flex-col justify-center border-t lg:border-t-0 border-gray-600 group relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isTransitioning ? "pointer-events-none" : "cursor-pointer"
      }`}
      style={getPanelStyles("right")}
      onMouseEnter={() => !isTransitioning && setRightHovered(true)}
      onMouseLeave={() => !isTransitioning && setRightHovered(false)}
    >
      <div
        className={`transform transition-all duration-700 ${
          rightHovered && !isTransitioning ? "scale-105 rotate-1" : "scale-100"
        } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* Earnings display */}
        <div
          className={`flex flex-wrap items-center gap-4 mb-8 transition-all duration-500 ${
            isTransitioning && selectedPanel === "right" ? "animate-fade-in-up" : ""
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
            isTransitioning && selectedPanel === "right" ? "animate-fade-in-up" : ""
          }`}
        >
          <div
            className={`p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full transition-all duration-500 ${
              rightHovered && !isTransitioning ? "scale-110" : ""
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
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight transition-all duration-700 delay-200 ${
            rightHovered && !isTransitioning ? "animate-pulse" : ""
          } ${isTransitioning && selectedPanel === "right" ? "animate-fade-in-up" : ""}`}
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
            Are you a car owner?
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-lg text-gray-200 mb-8 leading-relaxed transition-all duration-500 delay-300 ${
            rightHovered && !isTransitioning ? "text-white scale-105" : ""
          } ${isTransitioning && selectedPanel === "right" ? "animate-fade-in-up" : ""}`}
        >
          Transform your car into a <span className="text-green-400 font-bold animate-pulse">money-making asset</span>
          <br />
          and start earning <span className="text-blue-400 font-semibold">passive income</span>
          <span className="text-purple-400 font-semibold"> today!</span>
        </p>

        {/* CTA Button */}
        <div
          className={`mb-6 transition-all duration-500 delay-400 ${
            isTransitioning && selectedPanel === "right" ? "animate-fade-in-up" : ""
          }`}
        >
          <Button
            onClick={() => handlePanelSelect("right", "/list-your-car")}
            disabled={isTransitioning}
            className={`group bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 hover:from-purple-600 hover:via-blue-500 hover:to-purple-600 text-white px-8 py-6 h-auto flex items-center gap-3 text-lg font-bold rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-500 hover:shadow-blue-500/70 hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              rightHovered && !isTransitioning ? "animate-bounce-subtle" : ""
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
            isTransitioning && selectedPanel === "right" ? "animate-fade-in-up" : ""
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
  )
}
