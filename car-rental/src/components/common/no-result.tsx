"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {Home, RefreshCw, Search} from "lucide-react"

export default function NoResult() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="min-h-screen  via-white  flex items-center justify-center p-4 overflow-hidden relative">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-60 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="text-center !mt-2 mb-10 z-10 max-w-2xl mx-auto">
                <div
                    className={`transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                    <div className="text-6xl mb-6 animate-bounce-slow">
                        <Search className="w-20 h-20 mx-auto text-gray-400" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title and message */}
                <div
                    className={`transition-all duration-1000 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">No Results Found</h2>
                    <p className="text-gray-500 mb-6">
                        We couldn't find what you're looking for.
                    </p>
                </div>

                {/* Action buttons */}
                <div
                    className={`transition-all duration-1000 delay-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild className="group hover:scale-105 transition-transform duration-200">
                            <Link href="/home">
                                <Home className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                Go back home
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="group hover:scale-105 transition-transform duration-200"
                        >
                            <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
                            Try again
                        </Button>
                    </div>
                </div>

            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
