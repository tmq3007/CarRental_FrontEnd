"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Car, Mail, AlertCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateEmail } from "@/lib/validation/user-profile-validation"
import { useForgotPasswordMutation } from "@/lib/services/auth-api"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState<string | undefined>("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation()

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
            await forgotPassword({ Email: email }).unwrap()
            setIsSubmitted(true)
        } catch (error) {
            console.error("Password reset failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Branding */}
                    <div className="hidden lg:flex flex-col justify-center p-8">
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <Car className="w-10 h-10 text-green-600 mr-3" />
                                <span className="text-2xl font-bold text-green-800">Car Rental</span>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">Password Reset Sent</h1>
                            <p className="text-lg text-gray-600 mb-8">
                                We've sent instructions to your email to help you regain access to your account.
                                Check your inbox and follow the steps provided.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Check Your Inbox</h3>
                                    <p className="text-gray-600">Look for an email from our support team</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Can't Find It?</h3>
                                    <p className="text-gray-600">Check your spam or junk folder</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Success Message */}
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-green-600" />
                                </div>
                            </div>

                            {/* Success Message */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <span className="font-semibold text-green-600">{email}</span>
                            </p>
                            <p className="text-gray-500 text-sm mb-8">
                                Please check your email and follow the instructions to reset your password.
                            </p>

                            <div className="space-y-4">
                                <Link href="/signin">
                                    <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
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
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Branding */}
                <div className="hidden lg:flex flex-col justify-center p-8">
                    <div className="mb-8">
                        <div className="flex items-center mb-6">
                            <Car className="w-10 h-10 text-green-600 mr-3" />
                            <span className="text-2xl font-bold text-green-800">Car Rental</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Reset Your Password</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Enter your email address and we'll send you a link to reset your password and regain access to your account.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Quick Recovery</h3>
                                <p className="text-gray-600">Get back to your account in minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Secure Process</h3>
                                <p className="text-gray-600">Your information is protected</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Car className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">FORGOT YOUR PASSWORD?</h2>
                        <p className="text-gray-600 text-center mb-8">
                            Don't worry! Just enter your email and we'll send you a reset link.
                        </p>

                        {/* Forgot Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={`w-full h-12 border rounded-lg focus:ring-2 focus:ring-offset-0 ${
                                            emailError
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
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

                            <Button
                                type="submit"
                                disabled={isLoading || !!emailError || !email}
                                className="w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending Reset Link...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <Mail className="h-5 w-5 mr-2" />
                                        SEND RESET LINK
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Back to sign in link */}
                        <div className="text-center mt-6 pt-5 border-t border-gray-200">
                            <Link
                                href="/signin"
                                className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}