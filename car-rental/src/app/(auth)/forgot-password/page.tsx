"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Mail, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { validateEmail } from "@/lib/validation/user-profile-validation"
import { useForgotPasswordMutation } from "@/lib/services/auth-api"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("" as string | undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [ForgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation()

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        setEmailError(validateEmail(value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const emailValidation = validateEmail(email)
        setEmailError(emailValidation)

        if (emailValidation) return

        setIsLoading(true)

        try {
            await ForgotPassword({ Email: email }).unwrap()
            setIsSubmitted(true)
        } catch (error) {
            console.error("Password reset failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? "slide-in-left" : "opacity-0"}`}>
                    <div className="bg-white rounded-2xl shadow-lg p-8 form-container text-center">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
                        <p className="text-gray-600 mb-8">
                            We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
                            instructions to reset your password.
                        </p>

                        <div className="space-y-4">
                            <Link href="/signin">
                                <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                    Back to Sign In
                                </Button>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsSubmitted(false)
                                    setEmail("")
                                    setEmailError("")
                                }}
                                className="w-full text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                            >
                                Try a different email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? "slide-in-left" : "opacity-0"}`}>
                <div className="bg-white rounded-2xl shadow-lg p-8 form-container">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Car className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Reset Password</h2>

                    {/* Description */}
                    <p className="text-gray-600 text-center mb-8">
                        Enter the email address associated with your account, and we'll email you with the link to reset your
                        password.
                    </p>

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Your email address</label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full h-12 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
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
                                <p className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                                    <AlertCircle className="h-4 w-4" />
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !!emailError || !email}
                            className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </div>
                            ) : (
                                <>
                                    <Mail className="h-5 w-5 mr-2" />
                                    SUBMIT
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Back to sign in link */}
                    <div className="text-center mt-6">
                        <Link
                            href="/signin"
                            className="text-green-600 hover:text-green-700 font-medium transition-all duration-200 hover:underline flex items-center justify-center gap-1"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
