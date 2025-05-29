"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const validateEmail = (email: string) => {
        if (!email.trim()) {
            return "Email is required"
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address"
        }
        return ""
    }

    const validatePassword = (password: string) => {
        if (!password.trim()) {
            return "Password is required"
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters"
        }
        return ""
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        setEmailError(validateEmail(value))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        setPasswordError(validatePassword(value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const emailValidation = validateEmail(email)
        const passwordValidation = validatePassword(password)

        setEmailError(emailValidation)
        setPasswordError(passwordValidation)

        if (emailValidation || passwordValidation) {
            return
        }

        setIsLoading(true)

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            console.log("Login attempt:", { email, password })
            // Handle successful login here
        } catch (error) {
            console.error("Login failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Car className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">WELCOME BACK</h2>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Your email address</label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full h-12 border rounded-lg focus:ring-2 focus:ring-offset-0 ${
                                        emailError
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                            : "border-gray-200 focus:border-green-500 focus:ring-green-200"
                                    }`}
                                />
                                {emailError && (
                                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {emailError && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`w-full h-12 border rounded-lg focus:ring-2 focus:ring-offset-0 pr-10 ${
                                        passwordError
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                            : "border-gray-200 focus:border-green-500 focus:ring-green-200"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        <div className="text-center">
                            <Link href="/forgot-password" className="text-green-600 hover:text-green-700 text-sm font-medium">
                                Forgot your password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !!emailError || !!passwordError || !email || !password}
                            className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </div>
                            ) : (
                                <>
                                    <User className="h-5 w-5 mr-2" />
                                    LOG IN
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Sign up link */}
                    <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
                <Link href="/user/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </Link>
            </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
