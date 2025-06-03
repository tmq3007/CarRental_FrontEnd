"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Car, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {useRegisterMutation} from "@/lib/services/user-api";
import {toast} from "sonner";
import {
    validateEmail,
    validateFullName,
    validateNewPassword,
    validatePhoneNumber
} from "@/lib/validation/user-profile-validation";
import {useRouter} from "next/navigation";


export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [userType, setUserType] = useState<"renter" | "owner">("renter")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [register, { isLoading, isError, error }] = useRegisterMutation()
    const router = useRouter() // Initialize the router

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const fullName = formData.get("name") as string
        const phoneNumber = formData.get("phone") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        // Validate fields before submission
        const fullNameError = validateFullName(fullName)
        if (fullNameError) {
            toast.error(fullNameError)
            return
        }

        const phoneError = validatePhoneNumber(phoneNumber)
        if (phoneError) {
            toast.error(phoneError)
            return
        }

        const emailError = validateEmail(email)
        if (emailError) {
            toast.error(emailError)
            return
        }

        const passwordError = validateNewPassword(password)
        if (passwordError) {
            toast.error(passwordError)
            return
        }

        const registerDto = {
            email,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
            fullName,
            phoneNumber,
            roleId: userType === "renter" ? 2 : 4 // Assuming 2 is renter role, 4 is owner role
        }

        try {
            const response = await register(registerDto).unwrap()
            toast.success(response.message)
            // Check if registration was successful (status code 200)
            if (response.message === "Registration successful") {
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    router.push("/signin")
                }, 2000)
            }
        } catch (err: any) {
            console.error("Registration failed:", err)
            toast.error(err.data?.message || "Registration failed. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-2">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-3">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <Car className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">NOT A MEMBER YET?</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 px-6 pb-6">
                    {isError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{
                                // @ts-ignore
                                error?.data?.message || "Registration failed. Please try again."
                            }</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Name Field */}
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Your name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="border-green-200 focus:border-green-400 focus:ring-green-400 h-9"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Your email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="border-green-200 focus:border-green-400 focus:ring-green-400 h-9"
                                required
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Your phone number
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                className="border-green-200 focus:border-green-400 focus:ring-green-400 h-9"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Pick a password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="border-green-200 focus:border-green-400 focus:ring-green-400 pr-10 h-9"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">Use at least one letter, one number,one special character and eight characters.</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="border-green-200 focus:border-green-400 focus:ring-green-400 pr-10 h-9"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* User Type Selection */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">I am a:</Label>
                            <RadioGroup value={userType} onValueChange={(value: "renter" | "owner") => setUserType(value)} className="space-y-1">
                                <div className="flex items-center space-x-3 p-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                                    <RadioGroupItem value="renter" id="renter" className="text-green-600" />
                                    <Label htmlFor="renter" className="flex items-center space-x-2 cursor-pointer flex-1 text-sm">
                                        <Car className="w-4 h-4 text-green-600" />
                                        <span>I want to rent a car</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 p-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                                    <RadioGroupItem value="owner" id="owner" className="text-green-600" />
                                    <Label htmlFor="owner" className="flex items-center space-x-2 cursor-pointer flex-1 text-sm">
                                        <UserCheck className="w-4 h-4 text-green-600" />
                                        <span>I am a car owner</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-2 pt-1">
                            <Checkbox
                                id="terms"
                                checked={agreedToTerms}
                                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                                className="border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 mt-0.5"
                            />
                            <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                I have read and agree with the{" "}
                                <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                                    Terms and Conditions
                                </Link>
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-10 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                            disabled={!agreedToTerms || isLoading}
                        >
                            {isLoading ? (
                                "Processing..."
                            ) : (
                                <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    SIGN UP
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="text-center pt-2 border-t border-green-100">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-green-600 hover:text-green-700 font-medium">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}