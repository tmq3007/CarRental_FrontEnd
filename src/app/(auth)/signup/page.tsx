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
    const router = useRouter()

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
            roleId: userType === "renter" ? 3 : 1
        }

        try {
            const response = await register(registerDto).unwrap()
            toast.success(response.message)
            if (response.message === "Registration successful") {
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Branding */}
                <div className="hidden lg:flex flex-col justify-center p-8">
                    <div className="mb-8">
                        <div className="flex items-center mb-6">
                            <Car className="w-10 h-10 text-green-600 mr-3" />
                            <span className="text-2xl font-bold text-green-800">Car Rental</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Community</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Whether you're looking to rent a car or share yours with others, we've got you covered.
                            Join thousands of satisfied users today.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Wide Selection</h3>
                                <p className="text-gray-600">Choose from hundreds of vehicles</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Verified Users</h3>
                                <p className="text-gray-600">Trustworthy community of renters and owners</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="text-center pb-3">
                            <div className="mx-auto w-16 h-8 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Car className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Create Your Account</CardTitle>
                            <p className="text-gray-600 mt-2">Get started with your free account today</p>
                        </CardHeader>

                        <CardContent className="space-y-4 px-8 pb-8">
                            {/*{isError && (*/}
                            {/*    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">*/}
                            {/*        <strong className="font-bold">Error! </strong>*/}
                            {/*        <span className="block sm:inline">{*/}
                            {/*            // @ts-ignore*/}
                            {/*            error?.data?.message || "Registration failed. Please try again."*/}
                            {/*        }</span>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-8"
                                            required
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-8"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Phone Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+1234567890"
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-8"
                                            required
                                        />
                                    </div>

                                    {/* User Type Selection */}
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">I am a:</Label>
                                        <RadioGroup
                                            value={userType}
                                            onValueChange={(value: "renter" | "owner") => setUserType(value)}
                                            className="flex gap-2"
                                        >
                                            <div className="flex h-8 items-center space-x-2 p-2 rounded-lg border border-gray-300 hover:border-green-500 transition-colors flex-1">
                                                <RadioGroupItem value="renter" id="renter" className="text-green-600" />
                                                <Label htmlFor="renter" className="flex items-center space-x-2 cursor-pointer text-sm">
                                                    {/*<Car className="w-4 h-4 text-green-600" />*/}
                                                    <span>Renter</span>
                                                </Label>
                                            </div>
                                            <div className="flex h-8 items-center space-x-2 p-2 rounded-lg border border-gray-300 hover:border-green-500 transition-colors flex-1">
                                                <RadioGroupItem value="owner" id="owner" className="text-green-600" />
                                                <Label htmlFor="owner" className="flex items-center space-x-2 cursor-pointer text-sm">
                                                    {/*<UserCheck className="w-4 h-4 text-green-600" />*/}
                                                    <span>Owner</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10 h-8"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use at least 8 characters with a mix of letters, numbers & symbols.
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-1">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10 h-8"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start space-x-3 pt-2">
                                    <Checkbox
                                        id="terms"
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                                        className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 mt-0.5"
                                    />
                                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                                            Terms and Conditions
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-11 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-4"
                                    disabled={!agreedToTerms || isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <UserCheck className="w-5 h-5 mr-2" />
                                            Create Account
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* Sign In Link */}
                            <div className="text-center pt-4 border-t border-gray-200 mt-6">
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
            </div>
        </div>
    )
}