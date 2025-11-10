"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Car, User, Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuthRedirect from "@/lib/hook/useAuthRedirect"
import {LoginVO, useLoginMutation, useLoginWithGoogleQuery} from "@/lib/services/auth-api"
import {ApiResponse} from "@/lib/store"
import {toast} from "sonner"
import { validateEmail, validateNewPassword } from "@/lib/validation/user-profile-validation"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState<string | undefined>("")
    const [passwordError, setPasswordError] = useState<string | undefined>("")
    const [isLoading, setIsLoading] = useState(false)
    const [login, {isLoading: loginLoading}] = useLoginMutation()
    const [loginData, setLoginData] = useState<ApiResponse<LoginVO>>()

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        setEmailError(validateEmail(value))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        setPasswordError(validateNewPassword(value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = await login({ Email: email, Password: password }).unwrap()
            setLoginData(data)
        } catch (error) {
            toast.error("Login failed. Please check your credentials and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useAuthRedirect(loginData, undefined, {
        success: () => {
            setIsLoading(false)
        }
    })

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            window.location.href = "http://localhost:5227/api/Auth/login/google"
        } catch (error) {
            console.error("Google login error:", error)
            setIsLoading(false)
        }
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
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Sign in to access your account and continue your journey with us.
                            Manage your bookings, vehicles, and preferences all in one place.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Easy Booking</h3>
                                <p className="text-gray-600">Quick and hassle-free car rentals</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Personalized Experience</h3>
                                <p className="text-gray-600">Tailored recommendations just for you</p>
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
                                <User className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">SIGN IN TO YOUR ACCOUNT</h2>
                        <p className="text-gray-600 text-center mb-8">Enter your credentials to continue</p>

                        {/* Login Form */}
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
                                                : "border-gray-300 focus:border-green-500 focus:ring-green-200"
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

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !!emailError || !!passwordError || !email || !password}
                                className="w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <User className="h-5 w-5 mr-2" />
                                        SIGN IN
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-12 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </button>

                        {/* Sign up link */}
                        <div className="text-center mt-6 pt-5 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                                    Create one here
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}