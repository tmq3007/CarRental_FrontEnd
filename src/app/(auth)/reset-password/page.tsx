"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { validateNewPassword, validateConfirmPassword } from "@/lib/validation/user-profile-validation"
import { useResetPasswordMutation } from "@/lib/services/auth-api"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie";
import NoResult from "@/components/common/no-result";
import Redis from "ioredis";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("" as string | undefined)
    const [confirmPasswordError, setConfirmPasswordError] = useState("" as string | undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [ResetPassword, {isLoading: isResetPasswordLoading}] = useResetPasswordMutation()
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const rawParams = new URLSearchParams(window.location.search);
        const token = rawParams.get('token');

        if (!token) {
            setError(true);
            return;
        }

        const validateToken = async () => {
            try {
                const decoded: any = jwtDecode(token);
                const now = Math.floor(Date.now() / 1000);
                if (!decoded.exp || decoded.exp < now) {
                    setError(true);
                    return;
                }

                console.log("Decoded JWT:", decoded);
                console.log("Token JTI:", decoded.jti);
                console.log("Token Email:", decoded.email);

                //Send token to next-backend for Redis validation
                const res = await fetch('/api/validate-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jti: decoded.jti, email: decoded.email  }),
                });

                if (!res.ok) {
                    setError(true);
                    return;
                }

                // ✅ Store token for later form submit
                Cookies.set('Forgot_Password_Token', token, {
                    secure: true,
                    sameSite: 'Strict',
                    expires: (decoded.exp - now) / 60 / 60 / 24
                });

                // 🔒 Remove token from URL
                window.history.replaceState({}, '', '/reset-password');
            } catch (err) {
                setError(true);
            }
        };

        validateToken();
    }, [mounted]);


    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        setPasswordError(validateNewPassword(value))
        if (confirmPassword) {
            setConfirmPasswordError(validateConfirmPassword(value, confirmPassword))
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setConfirmPassword(value)
        setConfirmPasswordError(validateConfirmPassword(password, value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const passwordValidation = validateNewPassword(password)
        const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword)

        setPasswordError(passwordValidation)
        setConfirmPasswordError(confirmPasswordValidation)

        if (passwordValidation || confirmPasswordValidation) return

        setIsLoading(true)

        try {
            await ResetPassword({
                currentPassword: "",
                newPassword: password,
                confirmPassword: confirmPassword,
            }).unwrap()

            setIsSuccess(true)
        } catch (error) {
            console.error("Password reset failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? "slide-in-right" : "opacity-0"}`}>
                    <div className="bg-white rounded-2xl shadow-lg p-8 form-container text-center">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful</h2>
                        <p className="text-gray-600 mb-8">
                            Your password has been successfully reset. You can now sign in with your new password.
                        </p>

                        <Link href="/signin">
                            <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Go to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {error ? (
                <NoResult/>
            ) : (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? "slide-in-right" : "opacity-0"}`}>
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
                        <p className="text-gray-600 text-center mb-8">Please set your new password</p>

                        {/* Reset Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Pick a password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Pick a password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`w-full h-12 border rounded-lg focus:ring-2 focus:ring-offset-0 pr-10 transition-all duration-200 ${
                                            passwordError
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-green-500 focus:ring-green-200"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Use at least one letter, one number, one special character and eight characters.
                                </p>
                                {passwordError && (
                                    <p className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                                        <AlertCircle className="h-4 w-4" />
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Confirm password</label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className={`w-full h-12 border rounded-lg focus:ring-2 focus:ring-offset-0 pr-10 transition-all duration-200 ${
                                            confirmPasswordError
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-green-500 focus:ring-green-200"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {confirmPasswordError && (
                                    <p className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                                        <AlertCircle className="h-4 w-4" />
                                        {confirmPasswordError}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !!passwordError || !!confirmPasswordError || !password || !confirmPassword}
                                className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Resetting...
                                    </div>
                                ) : (
                                    <>
                                        <Lock className="h-5 w-5 mr-2" />
                                        RESET
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
            </div>)}
        </>
    )
}
